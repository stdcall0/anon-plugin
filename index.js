import fs from 'node:fs';
import { Path, Logger, Config } from '#gc';
const apps = await (async () => {
    let ret = [];
    const files = fs
        .readdirSync(`${Path.Process}/plugins/ba-plugin/apps`)
        .filter(file => file.endsWith('.js'));
    Config.load();
    files.forEach((file) => {
        ret.push(import(`./apps/${file}`));
    });
    ret = await Promise.allSettled(ret);
    let apps = {};
    for (let i in files) {
        let name = files[i].replace('.js', '');
        if (ret[i].status != 'fulfilled') {
            Logger.error(`[ba-plugin] Failed to load app ${name}`);
            Logger.error(ret[i].reason);
            continue;
        }
        apps[name] = Object.values(ret[i].value)[0];
    }
    return apps;
})();
export { apps };
