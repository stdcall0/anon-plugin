// @ts-ignore
import plugin from '../../../../lib/plugins/plugin.js';

import type { User, Group, GroupUser, IBot, MessageSegment, SendMessageResult, MessageResponse } from "./types.js";
interface Task {
    name: string;
    fnc?: any;
    cron?: any;
}

interface Rule {
    reg: string;
    fnc: string;
    permission?: "master";
    log?: boolean;
}

interface ReplyParam {
    recallMsg?: number; // seconds, 0 - 120
    at?: boolean;
}

interface E {
    message: MessageSegment[]; // Message segments array
    message_id: string; // Message ID
    message_type?: "private" | "group"; // Message type
    notice_type?: "friend" | "group"; // Notice type
    isPrivate?: boolean;
    isGroup?: boolean;
    isMaster?: boolean; // Is master user

    msg?: string; // Text message
    atBot?: boolean;
    img?: string[]; // Image urls array
    at?: number;
    sender?: User | GroupUser;
    friend?: User;
    group?: Group;
    member?: GroupUser;
    user_id?: number; // User ID
    group_id?: number; // Group ID

    bot: IBot;

    // NOTE: quote is not working for some reason
    reply: (msg: string | string[], quote?: boolean, data?: ReplyParam) => Promise<SendMessageResult>;
    recall?: () => Promise<any[]>; // Recall message

    reply_id?: string; // Reply message ID
    getReply?: () => Promise<MessageResponse>;
}

class PluginClass {
    name: string;
    dsc: string;
    event: string;
    priority: number | string;
    task: Task;
    rule: Rule[];
    e: E;

    constructor(t: any) {};

    reply: (msg: string | string[], quote?: boolean, data?: ReplyParam) => Promise<SendMessageResult>;

    // isGroup == true => any group member message will trigger the context
    // otherwise only the sender
    // by default isGroup is false
    setContext: (fnc: string, isGroup?: boolean, time?: number, timeout_prompt?: string) => E;
    getContext: (fnc: string, isGroup?: boolean) => E;
    finish: (fnc: string, isGroup?: boolean) => void;
};

const Plugin = plugin as (typeof PluginClass);

export default Plugin;
