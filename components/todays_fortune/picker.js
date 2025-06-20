import seedrandom from 'seedrandom';
import { TodaysFortuneData } from '#gc.res';
export default {
    pick(seed) {
        // 使用 seedrandom 库生成一个确定性的随机数生成器
        const rng = seedrandom(seed);
        // 生成一个随机索引
        const index = Math.floor(rng() * TodaysFortuneData.length);
        // 返回对应的运势数据
        return TodaysFortuneData[index];
    }
};
