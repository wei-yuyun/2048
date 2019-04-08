function showNumberWithAnimation(i, j, randomNumber) {
    var numberCess = $('#number-cell-' + i + "-" + j);
    numberCess.css('background-color', getNumberBackgroundColor(randomNumber));
    numberCess.css('color', getNumberColor(randomNumber));
    numberCess.text(randomNumber);


    // 动画用jQuery的animate( , 50)50毫秒
    numberCess.animate({
        // width:"100px",
        // height:"100px",
        width: cellSideLength,
        height: cellSideLength,
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 50);

}

// 移动动画实现
function showMoveAnimation(fromx, fromy, tox, toy) {
    var numberCell = $('#number-cell-' + fromx + '-' + fromy);
    numberCell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox, toy)
    }, 200);
}


function updateScore(score) {
    $('#score').text(score);
}

function updateHighScore(highScore) {
    $('#high-score').text(highScore);
}