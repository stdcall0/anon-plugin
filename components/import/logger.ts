type Log = (...args: any[]) => void;
type Color = (...args: any[]) => any;

interface ILogger {
    trace: Log;
    debug: Log;
    info: Log;
    warn: Log;
    error: Log;
    fatal: Log;
    mark: Log;
    chalk: any;
    red: Color;
    green: Color;
    yellow: Color;
    blue: Color;
    magenta: Color;
    cyan: Color;
};

// @ts-ignore
const Logger = logger as ILogger;

export default Logger;
