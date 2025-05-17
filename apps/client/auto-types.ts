//
import fs from 'fs';
import ts from 'typescript';

const fileList = ['./src/events/index.ts'];
const ignoreParamTypes = ['BrowserWindow'];

const program = ts.createProgram(fileList, {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
});
const checker = program.getTypeChecker();

interface IFunctionItem {
    funcName: string;
    params: string[];
    result: string;
}
const funcsList: IFunctionItem[] = [];
for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) continue;

    ts.forEachChild(sourceFile, visit);
}

function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.name) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (!symbol) return;

        let func: IFunctionItem = {
            funcName: '',
            params: [],
            result: '',
        };
        func.funcName = symbol.getName();
        console.log(`函数名: ${symbol.getName()}`);

        const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
        const signatures = type.getCallSignatures();

        for (const sig of signatures) {
            // 参数列表
            for (const param of sig.getParameters()) {
                const decl = param.valueDeclaration as ts.ParameterDeclaration;
                const paramType = checker.getTypeOfSymbolAtLocation(param, decl);
                const paramTypeStr = checker.typeToString(paramType);
                console.log(`参数: ${param.getName()}: ${paramTypeStr}`);
                if (ignoreParamTypes.some((item) => paramTypeStr === item)) {
                    continue;
                }
                func.params.push(`${param.getName()}:${paramTypeStr}`);
            }

            // 返回类型
            const returnType = checker.getReturnTypeOfSignature(sig);
            const returnTypeStr = checker.typeToString(returnType);
            console.log(`返回类型: ${returnTypeStr}`);
            func.result = returnTypeStr;
        }
        funcsList.push(func);
    }

    ts.forEachChild(node, visit);
}

// 生成声明文件
// type IpcActionNames = '' | ''
let actionEnumStr = '';
let dtsFileStr = '';

funcsList.forEach((funcItem) => {
    if (!actionEnumStr) {
        actionEnumStr += `declare type IpcActionNames = '${funcItem.funcName}'`;
    } else {
        actionEnumStr += `|'${funcItem.funcName}'`;
    }
});

fs.writeFileSync('../web/typings/electron.d.ts', actionEnumStr);
console.log(funcsList, actionEnumStr, 'auto-types.ts::47行');
