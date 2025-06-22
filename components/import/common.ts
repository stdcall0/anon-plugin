// @ts-ignore
import common from '../../../../lib/common/common.js';

import type { MessageSegment, SendMessageResult } from "./types.js";

const Common = {
    async replyPrivate(userId: string, msg: string): Promise<SendMessageResult> {
        return await common.relpyPrivate(userId, msg);
    },
    async makeForwardMsg(e: any, msgs: string[], desc?: string, anonymous?: boolean): Promise<MessageSegment[]> {
        return await common.makeForwardMsg(e, msgs, desc, anonymous);
    }
};

export default Common;
