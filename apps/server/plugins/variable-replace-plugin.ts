import * as ts from 'typescript';
import fs from 'fs';
import path from 'path';

import { parseIniFile } from '@mono/utils';

const replaceVariables = {
    'process.env.NODE_ENV': process.env.NODE_ENV,
    'process.env.NODE_CONFIG': () => {
        const commonConfig = parseIniFile(
            fs.readFileSync(path.resolve(__dirname, '../../../env/.env')).toString()
        );
        const envConfig = parseIniFile(
            fs
                .readFileSync(path.resolve(__dirname, `../../../env/.env.${process.env.NODE_ENV}`))
                .toString()
        );
        return JSON.stringify({ ...commonConfig, ...envConfig });
    },
};
const includeFiles: string[] = ['utils/common.util.ts'];

export default function stringReplaceTransformer() {
    return (context) => {
        return (sourceFile) => {
            if (
                includeFiles.length > 0 &&
                !includeFiles.some((file) => sourceFile.fileName.includes(file))
            ) {
                return sourceFile;
            }

            function visitor(node: ts.Node): ts.Node {
                if (ts.isPropertyAccessExpression(node)) {
                    const key = node.getFullText().trim();
                    const replaceFunc = replaceVariables[key];
                    if (typeof replaceFunc === 'string') {
                        return ts.factory.createStringLiteral(replaceFunc);
                    } else if (typeof replaceFunc === 'function') {
                        return ts.factory.createStringLiteral(replaceFunc());
                    }
                }

                return ts.visitEachChild(node, visitor, context);
            }
            return ts.visitNode(sourceFile, visitor);
        };
    };
}
