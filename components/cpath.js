import { PLUGIN_ID } from '#gc';
const cwd = process.cwd();
const Path = {
    Process: cwd,
    App: `${cwd}/plugins/${PLUGIN_ID}/apps`,
    Config: `${cwd}/plugins/${PLUGIN_ID}/config`,
    Resource: `${cwd}/plugins/${PLUGIN_ID}/resources`,
    HTML: `${cwd}/plugins/${PLUGIN_ID}/resources/html`,
    Image: `${cwd}/plugins/${PLUGIN_ID}/resources/img`
};
export default Path;
