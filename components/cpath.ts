
const cwd = process.cwd();

const Path = {
    Process: cwd,
    Config: `${cwd}/plugins/anon-plugin/config`,
    Resource: `${cwd}/plugins/anon-plugin/resources`,
    HTML: `${cwd}/plugins/anon-plugin/resources/html`,
    Image: `${cwd}/plugins/anon-plugin/resources/img`
};

export default Path;
