import { Plugin } from '#gc';
import { TodaysFortunePicker } from '#gc';
export class AronaPlugin extends Plugin {
    constructor() {
        super({
            name: '今日运势插件',
            dsc: '今日运势数据来自机器人 AL_1S',
            event: 'message',
            priority: '98',
            rule: [
                {
                    reg: '^今日运势$',
                    fnc: 'todays_fortune'
                }
            ]
        });
    }
    async todays_fortune() {
        // 实现效果，每个用户每天运势都一样
        // 我们通过将用户ID+日期拼接作为随机种子来实现
        const userId = this.e.sender.user_id;
        // 使用本地时区
        const date = new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-'); // 格式化为 YYYY-MM-DD
        const seed = `${userId}-${date}`;
        const fortune = TodaysFortunePicker.pick(seed);
        /* Example response
            您的今日运势为：
            凶带吉
            ★★★☆☆☆☆

            半凶半吉，浮沉多端，始凶终吉，能保成功

            所求之事，是吉凶参半。所要经历的，既有非你所愿、无法承受之痛苦，也有甘之如饴、顺风顺水之运气。无法如预期的稳定，不确定的因素对其本身影响很大。要老老实实接受磨难的考验，之后成功就会不期而遇。

            仅供娱乐|相信科学|请勿迷信
        */
        const response = `${fortune.fortuneSummary}
${fortune.luckyStar}

${fortune.signText}

${fortune.unsignText}`;
        await this.e.reply(response, true);
    }
}
;
