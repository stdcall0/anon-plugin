// @ts-ignore
import plugin from '../../../../lib/plugins/plugin.js';

import type { User, Group, IBot } from "./types.js";
interface Task {
    name: string;
    fnc?: any;
    cron?: any;
}
interface Rule {
    reg: string;
    fnc: string;
    log?: boolean;
}
interface ReplyParam {
    recallMsg?: number; // seconds, 0 - 120
    at?: boolean;
}
interface E {
    msg: string;
    sender: User;
    group: Group;
    bot: IBot;

    reply: (msg: string | string[], quote?: boolean, data?: ReplyParam) => Promise<void>;
}

class PluginClass {
    name: string;
    dsc: string;
    event: string;
    priority: number | string;
    task: Task;
    rule: Rule[];
    e: E;

    reply: (msg: string | string[], quote?: boolean, data?: ReplyParam) => Promise<void>;
    constructor(t: any) {};
};

const Plugin = plugin as (typeof PluginClass);

export default Plugin;
