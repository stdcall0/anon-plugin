// @ts-ignore
import common from '../../../../lib/common/common.js';
const Common = {
    async replyPrivate(userId, msg) {
        return await common.relpyPrivate(userId, msg);
    },
    async makeForwardMsg(e, msgs, desc, anonymous) {
        return await common.makeForwardMsg(e, msgs, desc, anonymous);
    }
};
export default Common;
