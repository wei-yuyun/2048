// 获取屏幕设备的宽度
documentWidth = window.screen.availWidth;
// 棋盘格大小
gridContainerWidth = 0.92 * documentWidth;
// 每个小方块大小
cellSideLength = 0.18 * documentWidth;
// 每个小方块之间的间距
cellSpace = 0.04 * documentWidth;


function getPosTop(i, j) {
    // return 20 + i * 120;
    return cellSpace + i * (cellSpace + cellSideLength);
}

// 获取每个单元格的坐标
function getPosLeft(i, j) {
    // return 20 + j * 120;
    return cellSpace + j * (cellSpace + cellSideLength);
}

// 设置不同数字的不同背景颜色
function getNumberBackgroundColor(number) {
    switch (number) {
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#ede0c8";
            break;
        case 8:
            return "#f2b179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e3b";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#33b5e5";
            break;
        case 2048:
            return "#09c";
            break;
        case 4096:
            return "#a6c";
            break;
        case 3192:
            return "#93c";
            break;
    }
    return "black";
}

// 设置数字的颜色：2和4的颜色都为#776e65，其它数字的颜色为白色
function getNumberColor(number) {
    if (number <= 4)
        return "#776e65";

    return "white";
}

// 判断当前棋盘格是否有空间
// 双重循环走一遍如果board[][]的值多少0则有空间，返回false
function nospace(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

// 判断canMoveLeft()?
// 一、左边是否没有数字
// 二、左边数字是否和自己相等？
function canMoveLeft(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight(board) {

    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--)
            if (board[i][j] != 0)
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j])
                    return true;

    return false;
}

function canMoveUp(board) {

    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++)
            if (board[i][j] != 0)
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j])
                    return true;

    return false;
}

function canMoveDown(board) {

    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--)
            if (board[i][j] != 0)
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j])
                    return true;

    return false;
}

function noBlockHorizontal(row, col1, col2, board) {
    for (var i = col1 + 1; i < col2; i++)
        if (board[row][i] != 0)
            return false;
    return true;
}

function noBlockVertical(col, row1, row2, board) {
    for (var i = row1 + 1; i < row2; i++)
        if (board[i][col] != 0)
            return false;
    return true;
}


// 判断是否移动
function nomove(board) {
    if (canMoveDown(board) || canMoveLeft(board) || canMoveRight(board) || canMoveUp(board)) {
        return false;
    }
    return true;
}