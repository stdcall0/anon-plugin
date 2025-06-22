import fs from 'node:fs';
import { Path } from '#gc';
export default class ImageStorage {
    static path(fn) {
        return Path.join(Path.QuotesImage, fn);
    }
    static has(fn) {
        return fs.existsSync(ImageStorage.path(fn));
    }
    static set(fn, data) {
        fs.writeFileSync(ImageStorage.path(fn), data);
    }
    static del(fn) {
        const filePath = ImageStorage.path(fn);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}
;
