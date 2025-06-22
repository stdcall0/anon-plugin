import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import PLUGIN_ID from '#gc.id';

const cwd = process.cwd();

const Path = {
    Process: cwd,
    App: `${cwd}/plugins/${PLUGIN_ID}/apps`,
    Config: `${cwd}/plugins/${PLUGIN_ID}/config`,
    DefaultConfig: `${cwd}/plugins/${PLUGIN_ID}/config/default_config`,
    Data: `${cwd}/plugins/${PLUGIN_ID}/data`,
    Resource: `${cwd}/plugins/${PLUGIN_ID}/resources`,
    HTML: `${cwd}/plugins/${PLUGIN_ID}/resources/html`,
    Image: `${cwd}/plugins/${PLUGIN_ID}/resources/img`,

    Quotes: `${cwd}/plugins/${PLUGIN_ID}/data/quotes`,
    QuotesImage: `${cwd}/plugins/${PLUGIN_ID}/data/quotes/image`,

    join: (...args: string[]): string => {
        return path.join(...args);
    }
};

async function ensurePathExists(): Promise<void> {
    await Promise.all(
        Object.values(Path)
            .filter((item): item is string => typeof item === 'string')
            .map(async (path) => {
                try {
                    await fs.mkdir(path, { recursive: true });
                } catch (error) {
                    console.error(`Error creating directory ${path}:`, error);
                }
            })
    );
}

export { Path, ensurePathExists };
