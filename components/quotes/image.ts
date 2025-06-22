import fs from 'node:fs';

import { Path } from '#gc';

export default abstract class ImageStorage {
    static path(fn: string): string {
        return Path.join(Path.QuotesImage, fn);
    }

    static has(fn: string): boolean {
        return fs.existsSync(ImageStorage.path(fn));
    }

    static set(fn: string, data: Buffer) {
        fs.writeFileSync(ImageStorage.path(fn), data);
    }

    static del(fn: string) {
        const filePath = ImageStorage.path(fn);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};
