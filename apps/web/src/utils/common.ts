const BoardKeyCodeReplaceMap: {
    [key: string]: string;
} = {
    ArrowRight: 'Right',
    ArrowLeft: 'Left',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
};

/**
 * 返回键盘按下的组合键，兼容globalShortcut的键绑定如：CommandOrControl+Left
 * @param e 键盘事件：keyup,keydown
 * @returns
 */
export function getCombinationShortcut(e: KeyboardEvent): string | undefined {
    const boardKey = e.key;
    if (['Control', 'Meta'].includes(boardKey)) return;
    let combinationKeys = [];
    const withCommandOrControl = e.metaKey || e.ctrlKey;
    const withShift = e.shiftKey;
    const withAltKey = e.altKey;
    if (withCommandOrControl) {
        combinationKeys.push('CommandOrControl');
    }
    if (withShift) {
        combinationKeys.push('Shift');
    }
    if (withAltKey) {
        combinationKeys.push('Alt');
    }
    if (BoardKeyCodeReplaceMap[e.key]) {
        combinationKeys.push(BoardKeyCodeReplaceMap[e.key]);
    } else if (e.code.startsWith('Key')) {
        combinationKeys.push(e.key.toUpperCase());
    } else {
        combinationKeys.push(e.key);
    }
    const resultKeyboardValue = combinationKeys.join('+');
    return resultKeyboardValue;
}