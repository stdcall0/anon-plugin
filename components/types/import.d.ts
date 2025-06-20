/**
 * IMPORTANT - do not use imports in this file!
 * It will break global definition.
 */

type Segment = import("../import/types.ts").Segment;
type IYunzai = import("../import/types.ts").IYunzai;
declare namespace NodeJS {
    export interface Global {
        segment: Segment;
        Bot: IYunzai;
    }
}

declare var segment: Segment;
declare var Bot: IYunzai;
