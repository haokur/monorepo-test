// 示例工具函数
export const count = (a: number, b: number): number => a + b + 500;

export const parseIniFile = (data: string) => {
    const regex = {
        section: /^\s*\s*([^]*)\s*\]\s*$/,
        param: /^\s*([\w.\-_]+)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/,
    };
    const value: any = {};
    data = data.toString();
    const lines = data.split(/\r\n|\r|\n/);
    let section: any = null;
    lines.forEach(function (line) {
        if (regex.comment.test(line)) {
            return;
        } else if (regex.param.test(line)) {
            const match: string[] = line.match(regex.param) as string[];
            if (section) {
                value[section][match[1]] = match[2];
            } else {
                value[match[1]] = match[2];
            }
        } else if (regex.section.test(line)) {
            const match = line.match(regex.section) as string[];
            const _key = match[1].replace('[', '').replace(']', '');
            value[_key] = {};
            section = _key;
        } else if (line.length === 0 && section) {
            section = null;
        }
    });
    return value;
};
