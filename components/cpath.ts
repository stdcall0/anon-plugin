
const cwd = process.cwd();

const Path = {
    Process: cwd,
    Config: `${cwd}/plugins/ba-plugin/config`,
    Resource: `${cwd}/plugins/ba-plugin/resources`,
    HTML: `${cwd}/plugins/ba-plugin/resources/html`,
    Image: `${cwd}/plugins/ba-plugin/resources/img`
};

export default Path;
