import crypto from 'node:crypto';
import _ from 'lodash';

import PLUGIN_ID from '#gc.id';
import { Plugin, Logger, Config } from '#gc';

import { Quotes } from '#gc';
import { Quote } from '#gc.model';

export class QuotesPlugin extends Plugin {
    constructor() {
        super({
            name: '语录插件',
            dsc: '记录并随时查看群友的沙雕语录',
            event: 'message',
            priority: '98',
            rule: [
                {
                    reg: '^上传.*$',
                    fnc: 'upload'
                },
                {
                    reg: '^语录.*$',
                    fnc: 'query'
                },
                {
                    reg: '^\\+tag.*$',
                    fnc: 'addTags'
                },
                {
                    reg: '^\\-tag.*$',
                    fnc: 'removeTags'
                },
                {
                    reg: '^删除$',
                    fnc: 'delete'
                },
                {
                    reg: '^语录信息$',
                    fnc: 'info'
                }
            ]
        });
    }

    getTags(s: string, kw: string): string[] {
        const index = s.indexOf(kw);
        if (index === -1) return [];
        return s.slice(index + kw.length).split(' ').filter(tag => tag);
    }

    setId(message_ids: string[], quote_id: number) {
        message_ids.forEach(m =>
            // @ts-ignore
            await redis.set(`${PLUGIN_ID}:quotes:id:${m}`, quote_id.toString(), { EX: 3600 * 3 })
        );
    }

    async getId(message_id: string) {
        // @ts-ignore
        return redis.get(`${PLUGIN_ID}:quotes:id:${message_id}`)
            .then(id => id ? parseInt(id) : null)
            .catch(err => null);
    }

    async upload() {
        if (!this.e.isGroup || !this.e.group_id || !this.e.user_id) return;

        let message_ids = [this.e.message_id];
        let img_url: string;
        if (this.e.img) {
            img_url = this.e.img[0];
        } else if (this.e.reply_id) {
            let source = (await this.e.getReply()) ?. message;
            if (source && source.length > 0) {
                let imgs = source.filter(m => m.type === 'image');
                if (imgs.length === 1) {
                    img_url = imgs[0].url;
                    message_ids.push(this.e.reply_id);
                }
            }
        }
        if (!img_url) {
            return this.e.reply('请指定要上传的图片！');
        }

        const tags = this.getTags(this.e.msg, '上传');
        Logger.info(`[${PLUGIN_ID}][quotes] 上传语录: ${this.e.msg}，标签: ${tags.join(', ')}`);

        const response = await fetch(img_url);
        if (!response.ok) {
            Logger.error(`[${PLUGIN_ID}][quotes] 无法获取图片: ${img_url}: ${response.statusText}`);
            return this.e.reply(`获取图片失败: ${response.statusText}`);
        }

        const max_img_size: number = Config.get('quotes').get('max_img_size') as number || 5;
        if (parseInt(response.headers.get('size')) > 1024 * 1024 * max_img_size) {
            return this.e.reply(`图片大小超过限制 (${max_img_size} MB)`);
        }

        let fileType = 'png';
        if (response.headers.get('content-type') === 'image/gif') {
            fileType = 'gif';
        }
        else if (response.headers.get('content-type') === 'image/jpeg' || response.headers.get('content-type') === 'image/jpg') {
            fileType = 'jpg';
        }
        else if (response.headers.get('content-type') === 'image/webp') {
            fileType = 'webp';
        }

        // calculate MD5 as filename
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const md5 = crypto.createHash('md5').update(buffer).digest('hex');
        const filename = `${md5}.${fileType}`;

        const quote: Quote = {
            id: 0, // Will be set by the database
            groupId: this.e.group_id,
            uploaderId: this.e.user_id,
            filename,
            tags
        };

        try {
            Quotes.ImageStorage.set(filename, buffer);
            const quoteNew = await (await Quotes.DbService.getInstance()).addQuote(quote);
            Logger.info(`[${PLUGIN_ID}][quotes] 语录上传成功: ${quoteNew.id} -> ${filename}`);

            const result = await this.e.reply(`上传成功！`);
            
            if (Array.isArray(result.message_id))
                message_ids.push(...result.message_id);
            else
                message_ids.push(result.message_id);
            this.setId(message_ids, quoteNew.id);
        } catch (error) {
            Logger.error(`[${PLUGIN_ID}][quotes] 语录上传失败: ${error}`);
            return this.e.reply(`上传失败: ${error.message}`);
        }
    }

    async query() {
        if (!this.e.isGroup || !this.e.group_id) return;

        const tags = this.getTags(this.e.msg, '语录');
        const quotes = (await Quotes.DbService.getInstance()).findQuotesByTags(this.e.group_id, tags);

        if (quotes.length === 0) {
            return this.e.reply('没有找到相关语录');
        }
        // Pick a random quote
        const quote = _.sample(quotes);
        try {
            const result = await this.e.reply(segment.image(`file://${Quotes.ImageStorage.path(quote.filename).replace(/\\/g, '/')}`));

            let message_ids = [this.e.message_id];
            if (Array.isArray(result.message_id))
                message_ids.push(...result.message_id);
            else
                message_ids.push(result.message_id);
            this.setId(message_ids, quote.id);
        }
        catch (error) {
            Logger.error(`[${PLUGIN_ID}][quotes] 查询语录失败: ${error}`);
            return this.e.reply(`查询失败: ${error.message}`);
        }
    }

    async addTags() {
        if (!this.e.isGroup || !this.e.group_id || !this.e.user_id) return;

        if (!this.e.reply_id) return;
        const quote_id = await this.getId(this.e.reply_id);
        if (!quote_id) return;

        const tags = this.getTags(this.e.msg, '+tag');
        if (tags.length === 0) {
            return this.e.reply('请指定要添加的标签');
        }

        const db = await Quotes.DbService.getInstance();
        const quote = db.getQuoteById(quote_id);
        if (!quote || quote.groupId !== this.e.group_id) {
            return this.e.reply('被引用的语录无效');
        }

        const result = await db.updateQuoteTags(quote_id, _.uniq([...quote.tags, ...tags]));
        if (result) {
            Logger.info(`[${PLUGIN_ID}][quotes] 添加标签成功: ${quote_id} -> + ${tags.join(', ')}`);
            const result = await this.e.reply(`添加标签成功`);
            if (Array.isArray(result.message_id)) {
                this.setId(result.message_id, quote_id);
            } else {
                this.setId([result.message_id], quote_id);
            }
            this.setId([this.e.message_id], quote_id);
        } else {
            Logger.error(`[${PLUGIN_ID}][quotes] 添加标签失败: ${quote_id}`);
            return this.e.reply('添加标签失败');
        }
    }

    async removeTags() {
        if (!this.e.isGroup || !this.e.group_id || !this.e.user_id) return;

        if (!this.e.reply_id) return;
        const quote_id = await this.getId(this.e.reply_id);
        if (!quote_id) return;

        const tags = this.getTags(this.e.msg, '-tag');
        if (tags.length === 0) {
            return this.e.reply('请指定要删除的标签');
        }

        const db = await Quotes.DbService.getInstance();
        const quote = db.getQuoteById(quote_id);
        if (!quote || quote.groupId !== this.e.group_id) {
            return this.e.reply('被引用的语录无效');
        }

        const newTags = quote.tags.filter(tag => !tags.includes(tag));
        const result = await db.updateQuoteTags(quote_id, newTags);
        if (result) {
            Logger.info(`[${PLUGIN_ID}][quotes] 删除标签成功: ${quote_id} -> - ${tags.join(', ')}`);
            const result = await this.e.reply(`删除标签成功`);
            if (Array.isArray(result.message_id)) {
                this.setId(result.message_id, quote_id);
            } else {
                this.setId([result.message_id], quote_id);
            }
            this.setId([this.e.message_id], quote_id);
        } else {
            Logger.error(`[${PLUGIN_ID}][quotes] 删除标签失败: ${quote_id}`);
            return this.e.reply('删除标签失败');
        }
    }

    async delete() {
        if (!this.e.isGroup || !this.e.group_id || !this.e.user_id) return;

        if (!this.e.reply_id) return;
        const quote_id = await this.getId(this.e.reply_id);
        if (!quote_id) return;

        const db = await Quotes.DbService.getInstance();
        const quote = db.getQuoteById(quote_id);
        if (!quote || quote.groupId !== this.e.group_id) {
            return this.e.reply('被引用的语录无效');
        }

        if (quote.uploaderId !== this.e.user_id && !this.e.isMaster) {
            return this.e.reply('你没有删除此语录的权限');
        }

        try {
            await db.removeQuote(quote_id);
            Quotes.ImageStorage.del(quote.filename);
            Logger.info(`[${PLUGIN_ID}][quotes] 删除语录成功: ${quote_id}`);
            return this.e.reply('删除语录成功');
        } catch (error) {
            Logger.error(`[${PLUGIN_ID}][quotes] 删除语录失败: ${error}`);
            return this.e.reply(`删除语录失败: ${error.message}`);
        }
    }

    async info() {
        if (!this.e.isGroup || !this.e.group_id) return;

        if (!this.e.reply_id) {
            const db = await Quotes.DbService.getInstance();
            const quotes = db.getAllQuotes(this.e.group_id);

            if (quotes.length === 0) {
                return this.e.reply('本群组当前没有语录');
            }

            const quoteCount = quotes.length;
            const uploaderCount = _.uniq(quotes.map(q => q.uploaderId)).length;
            const tags = _.uniq(_.flatten(quotes.map(q => q.tags))).join(' ');

            return this.e.reply(`当前群组语录信息:\n` +
                `总语录数: ${quoteCount}\n` +
                `上传者数: ${uploaderCount}\n` +
                `标签: ${tags || '无'}`);
        }

        const quote_id = await this.getId(this.e.reply_id);
        if (!quote_id) return;

        const db = await Quotes.DbService.getInstance();
        const quote = db.getQuoteById(quote_id);
        if (!quote || quote.groupId !== this.e.group_id) {
            return this.e.reply('被引用的语录无效');
        }

        const card = this.e.group?.pickMember(quote.uploaderId)?.card;
        const result = await this.e.reply([`语录信息:\n` +
            `ID: ${quote.id}\n` +
            `上传者: ${quote.uploaderId} `,
            segment.at(quote.uploaderId, card),
            `\n` +
            `文件名: ${quote.filename}\n` +
            `标签: ${quote.tags.join(' ') || '无'}`]);
        
        if (Array.isArray(result.message_id)) {
            this.setId(result.message_id, quote.id);
        }
        else {
            this.setId([result.message_id], quote.id);
        }
        this.setId([this.e.message_id], quote.id);
    }
};
