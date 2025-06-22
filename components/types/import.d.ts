/**
 * IMPORTANT - do not use imports in this file!
 * It will break global definition.
 */

type ISegment = import("../import/types.ts").ISegment;
type IYunzai = import("../import/types.ts").IYunzai;
declare namespace NodeJS {
    export interface Global {
        segment: ISegment;
        Bot: IYunzai;
    }
}

declare var segment: ISegment;
declare var Bot: IYunzai;
