var board = new Array();
var score = 0;
// 用来记录每一个小格子是否已经发生碰撞
var hasConflicted = new Array();

// 支持触控两个坐标start和end
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

// 记录当前最高分
var highScore = 0;

//当整个程序加载完毕之后运行该主函数
$(document).ready(function() {
    // 移动设备先准备
    prepareForMobile();
    //显示新游戏
    newgame();
    returnLastStep();
})

// 实现prepareForMobile()
function prepareForMobile() {
    // 如果当前设备的width大于500px时我们就不需要用自适应，用觉得赋值。
    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;

    }
    // 当前设备的width小于500px时，先对grid-container的css进行调整
    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);
    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02 * cellSideLength);

}

// 实现newgame()函数
function newgame() {
    //初始化棋盘格
    init();
    //在随机两个格子生成2或4数字
    generateOneNumber();
    generateOneNumber();

}

function returnLastStep() {
    history.back();
}
// 实现init();对十六个小方格的位置进行布局
function init() {
    // 对十六个小格子的位置进行赋值
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            //定义一个变量gridCell通过id获得它的值
            var gridCell = $('#grid-cell-' + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }


    // 初始化board[][]
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    // 对小格子里的数字进行显示上的设定
    updateBoardView();
    updateHighScore(highScore);
    updateScore(0);
}


//实现updateBoardView()
function updateBoardView() {
    // 清除掉当前的number-cell的值
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            // $("#grid-container").append('<div class="number-cell" id=""number-cell-" + i + "-" + j"></div>');
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] == 0) {
                // numberCell的宽和高都是0px
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                // 将每个numberCell放到gridCell的中间
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
            } else {
                // numberCell的宽和高都是0px
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                // 将每个numberCell放到gridCell的中间
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                // getNumberBackgroundColor(board[i][j])函数根据返回的board的值显示不同的背景色
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }

    }
    $(".number-cell").css('line-height', cellSideLength + 'px');
    $(".number-cell").css('font-size', 0.6 * cellSideLength + 'px');
}


// 实现generateOneNumber();
function generateOneNumber() {
    // 通过nospace()判断当前棋盘格是否有空隙,为ture时无法生成一个随机数
    if (nospace(board)) {
        return false;
    }
    //随机一个位置X,Y
    // math.random()产生0-1之间浮点的随机数,乘4在下取整,再取整
    var randomX = parseInt(Math.floor(Math.random() * 4));
    var randomY = parseInt(Math.floor(Math.random() * 4));

    // // 死循环判断这个随机生成的位置是否是空的，是的话就跳出，不是再重新生成
    // while(true){
    //     if (board[randomX][randomY] == 0) {
    //         break;
    //     }

    //     randomX = parseInt(Math.floor( Math.random() * 4 ) );
    //     randomY = parseInt(Math.floor( Math.random() * 4 ) );
    // }

    // 优化随机位置生成算法
    var times = 0;
    while (times < 50) {
        if (board[randomX][randomY] == 0) {
            break;
        }

        randomX = parseInt(Math.floor(Math.random() * 4));
        randomY = parseInt(Math.floor(Math.random() * 4));
    }
    if (times == 0) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randomX = i;
                    randomY = j;
                }
            }
        }
    }



    // 随机生成一个数字2或4
    var randomNumber = Math.random() < 0.5 ? 2 : 4;

    // 在随机位置显示随机数字
    board[randomX][randomY] = randomNumber;
    // 显示新生成的这个数字，因为显示是要有动画效果的所以放在showNumberWithAnimatioN()中
    showNumberWithAnimation(randomX, randomY, randomNumber);


    return true;
    // nospace()实现放在support里
}


// 基于玩家响应的游戏循环
$(document).keydown(function(event) {
    // 当浏览器放大是会产生滚动条，此时按上下键进行游戏操作时，滚动条也会上下移动
    // 调用JS默认提供的一个函数
    event.preventDefault();
    switch (event.keyCode) {
        case 37: //left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 38: //up
            if (moveUp()) {
                generateOneNumber();
                isgameover();
            }
            break;
        case 39: //right
            if (moveRight()) {
                generateOneNumber();
                isgameover();
            }
            break;
        case 40: //down
            if (moveDown()) {
                generateOneNumber();
                isgameover();
            }
            break;
        default:
            break;
    }
    if (score > highScore) {
        highScore = score;
    }
});

//实现moveLeft()
//canMoveLeft()在support2048.js中实现
function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    // moveLeft
    // 对后三列进行向左移动
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {

                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        // board[i][k]没有元素此时board[i][j]可以挪过去
                        // board[i][k]到board[i][j]之间没有障碍物
                        // 产生一次移动
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        // 产生一次移动且叠加
                        // 移动动画在showAnimation2048.js
                        showMoveAnimation(i, j, i, k);
                        board[i][k] *= 2;
                        board[i][j] = 0;

                        // 分数添加
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    // 若立马执行updateboardview()则showmoveanimation()来不及执行
    setTimeout("updateBoardView()", 200);
    return true;
}


function moveRight() {
    if (!canMoveRight(board))
        return false;

    //moveRight
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {

                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}


function moveUp() {

    if (!canMoveUp(board))
        return false;

    //moveUp
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {

                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board))
        return false;

    //moveDown
    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {

                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}


// 捕捉触控事件——增加事件监听器,监听touchstart事件
document.addEventListener('touchstart', function(event) {
    startx = event.touches[0].pageX;
    starty = event.targetTouches[0].pageY;
});
// 同上
document.addEventListener('touchend', function(event) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;
    var deltax = endx - startx;
    var deltay = endy - starty;
    // 判断用户是否在滑动还只是点击屏幕，若只是点击屏幕则无需进行任何操作
    if (Math.abs(deltax) < 0.3 * documentWidth && Math.abs(deltay) < 0.3 * documentWidth)
        return;
    // 取绝对值，如果|deltax|>=|deltay|则说明触摸滑动在x轴上运动
    if (Math.abs(deltax) >= Math.abs(deltay)) {
        // 知道是在x轴滑动则可以对x的方向进行判断
        if (deltax > 0) {
            // 向右滑动
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }

        } else {
            // 向左滑动
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
    } else {
        // 在屏幕坐标系中y的正方向是向下的
        if (deltay > 0) {
            // 向下滑动
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        } else {
            // 向上滑动
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
    }
});


// 棋盘格没有空间了且不能进行任何的移动操作了
// nomove在support2048.js
function isgameover() {
    if (nospace(board) && nomove(board)) {

        gameover();
    }
}

function gameover() {
    alert("游戏结束！");
}