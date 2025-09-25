import _ from 'lodash';

import PLUGIN_ID from '#gc.id';
import { Plugin, Logger, Config } from '#gc';
import { CopypastaRule, isCopypastaRule } from '#gc.model';

let rules: CopypastaRule[] = null;

export class CopypastaPlugin extends Plugin {
    constructor() {
        super({
            name: '复制粘贴插件',
            dsc: '自动发送预设的文本内容。支持分群组自定义触发词与文本内容',
            event: 'message',
            priority: '98',
            rule: []
        });
        if (!_.isArray(rules)) rules = getRulesFromConfig();
    }

    async accept() {
        const group = this.e?.group_id;
        const msg = this.e?.msg;
        if (!msg) return;

        let msg_trim = msg.trim();
        const rule = rules.find(r => {
            if (r.trigger === msg_trim) {
                if (!group) return r.enable_pm;
                if (r.enabled_groups.length > 0 && !r.enabled_groups.includes(group)) return false;
                if (r.disabled_groups.includes(group)) return false;
                return true; 
            }
            return false;
        });

        if (rule) {
            Logger.info(`[${PLUGIN_ID}][copypasta] triggered in ${group ? `group ${group}` : 'PM'}: ${msg_trim}`);
            await this.reply(rule.response);
        }
    }
}

function getRulesFromConfig(): CopypastaRule[] {
    let rules: CopypastaRule[] = [];
    const config = Config.get("copypasta");
    if (config.get("rules")) {
        const rules_raw = config.get("rules")?.toJSON();
        if (_.isArray(rules_raw)) {
            if (rules_raw.every(isCopypastaRule)) {
                rules = rules_raw;
                Logger.info(`[${PLUGIN_ID}][copypasta] loaded ${rules.length} rules.`);
            } else {
                const rules_invalid = rules_raw.filter((r: any) => !isCopypastaRule(r));
                Logger.error(`[${PLUGIN_ID}][copypasta] invalid rule(s): ${rules_invalid}`);
            }
        } else {
            Logger.error(`[${PLUGIN_ID}][copypasta] rules must be an array: ${rules_raw}`);
        }
    } else {
        Logger.error(`[${PLUGIN_ID}][copypasta] no rules found in config!`);
    }
    return rules;
}
