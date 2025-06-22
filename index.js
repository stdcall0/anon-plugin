import fs from 'node:fs';
import PLUGIN_ID from '#gc.id';
import { Path, Logger, Config, ensurePathExists } from '#gc';
const apps = await (async () => {
    var _a;
    await ensurePathExists();
    Logger.info(`[${PLUGIN_ID}] Loading apps...`);
    let ret = [];
    const files = fs
        .readdirSync(Path.App)
        .filter(file => file.endsWith('.js'));
    Config.load();
    files.forEach((file) => {
        Logger.info(`[${PLUGIN_ID}] App: ${file} <- ${Path.App}/${file}`);
        ret.push(import(`file://${Path.App}/${file}`));
    });
    ret = await Promise.allSettled(ret);
    let apps = {};
    for (let i in files) {
        let name = files[i].replace('.js', '');
        if (ret[i].status !== 'fulfilled') {
            Logger.error(`[${PLUGIN_ID}] Failed to load app ${name}`);
            console.error(((_a = ret[i].reason) === null || _a === void 0 ? void 0 : _a.stack) || ret[i].reason);
            continue;
        }
        if (ret[i].value) {
            apps[name] = ret[i].value.default || Object.values(ret[i].value)[0];
        }
        else {
            Logger.warn(`[${PLUGIN_ID}] app [${name}] loaded but no export found.`);
        }
    }
    return apps;
})();
export { apps };
