import fs from 'fs';

import * as chokidar from 'chokidar';
import YAML from 'yaml';

import PLUGIN_ID from '#gc.id';
import { Logger } from '#gc';

export default class ConfigFile {
    path: string;
    data: string;
    document: YAML.Document;
    watcher: chokidar.FSWatcher;

    constructor(path: string) {
        this.path = path;
        this.init();
    }

    init() {
        this.data = fs.readFileSync(this.path, 'utf8');
        this.document = YAML.parseDocument(this.data);

        if (!this.watcher) {
            this.watcher = chokidar.watch(this.path).on('change', () => {
                Logger.info(`[${PLUGIN_ID}] Reload config file: ` + this.path);
                this.init();
            });
        }
    }

    get json(): string {
        return this.document.toJSON();
    }

    has(key: string): boolean {
        return this.document.hasIn(key.split('.'));
    }
    get(key: string): any {
        return this.document.getIn(key.split('.'));
    }
    set(key: string, value: any) {
        this.document.setIn(key.split('.'), value);
        this.save();
    }
    
    save() {
        const yaml = this.document.toString();
        if (yaml === this.data) return;
        fs.writeFileSync(this.path, yaml, "utf8");
    }
};
