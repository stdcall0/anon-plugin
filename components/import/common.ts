// @ts-ignore
import common from '../../../../lib/common/common.js';

const Common = {
    async replyPrivate(userId: string, msg: string) {
        return await common.relpyPrivate(userId, msg);
    },
    async makeForwardMsg(e: any, msgs: string[], desc?: string, anonymous?: boolean) {
        return await common.makeForwardMsg(e, msgs, desc, anonymous);
    }
};

export default Common;
