const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");
//game screen
const box = 30;
const gameX = 690;
const gameY = 630;
const canvasX = 690;
const canvasY = 690;
//game speed
let speed = 100;
//snake color
let normalColor = 'rgb(100,80,10)'
let deadColor = 'rgb(100,0,0)'
let invColor = 'rgba(100,80,10,0.3)'
let snakeColor;
//read all food
const meatImg = new Image();
meatImg.src = 'img/meat.png';
const junk = new Image();
junk.src = 'img/junk.png';
const vgtbl = new Image();
vgtbl.src = 'img/vegetable.png';
const bmb = new Image();
bmb.src = 'img/bomb.png';
const enrgy = new Image();
enrgy.src = 'img/energy.png'

function makeFood() {
    let obj = {
        x: (Math.floor(Math.random() * 20.99999) + 1) * box,
        y: (Math.floor(Math.random() * 18.99999) + 3) * box
    }
    let i = 0;
    while (i < arguments.length) {
        if (Array.isArray(arguments[i])) {
            let status = true;
            for (let j = 0; j < arguments[i].length; j++) {
                if (obj.x === arguments[i][j].x && obj.y === arguments[i][j].y) {
                    obj.x = (Math.floor(Math.random() * 20.99999) + 1) * box;
                    obj.y = (Math.floor(Math.random() * 18.99999) + 3) * box;
                    i = 0;
                    status = false;
                    break;
                }
            }
            if (status) {
                i++;
            }
        } else {
            if (obj.x === arguments[i].x && obj.y === arguments[i].y) {
                obj.x = (Math.floor(Math.random() * 20.99999) + 1) * box;
                obj.y = (Math.floor(Math.random() * 18.99999) + 3) * box;
                i = 0;
            } else {
                i++;
            }
        }
    }
    return obj;
}

function convertingHead(snake) {
    let convertHead = {};
    convertHead['x'] = snake.x - box / 2;
    convertHead['y'] = snake.y - box / 2;
    return convertHead;
}

//initialization
let score = 0;
let snake = [];
snake[0] = {
    x: gameX / 2,
    y: gameY / 2 + 60
};
let meat = makeFood(convertingHead(snake[0]));
let junkfood = [];
let veget = [];
let bomb = [];
let energydrink = [];

//control the game
let d;
let pause = false;
let dead = false;
let invisible = false;
let invPower = 100;
document.addEventListener("keydown", keyD);
document.addEventListener("keyup", keyU);

function keyD(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT" || key == 65 && d != "RIGHT") {
        d = "LEFT";
    } else if (key == 38 && d != "DOWN" || key == 87 && d != "DOWN") {
        d = "UP";
    } else if (key == 39 && d != "LEFT" || key == 68 && d != "LEFT") {
        d = "RIGHT";
    } else if (key == 40 && d != "UP" || key == 83 && d != "UP") {
        d = "DOWN";
    }

    if (key == 16 && dead === false && pause === false) {
        pause = true;
        clearInterval(game);
        ctx.font = '70px arial';
        ctx.textBaseline = 'hanging';
        ctx.fillStyle = 'white';
        ctx.fillText(`PAUSED`, 205, gameY / 2);
        ctx.font = '30px arial';
        ctx.fillText(`Press ctrl to continue`, 206, gameY / 2 + 70);
    }
    if (key == 17 && pause === true && dead === false) {
        game = setInterval(draw, speed);
        pause = false;
    }

    if (key == 90 && invPower > 0 || key == 190 && invPower > 0) {
        invisible = true;
    }

    if (key === 13) {
        reset();
    }
}

function keyU(event) {
    let key = event.keyCode;
    if (key == 90 || key == 190) {
        invisible = false;
    }
}

function Collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function eatFood(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y && invisible === false) {
            array.splice(i, 1);
            return true;
        }
    }
    return false;
}

function drawHead(snake, colorRGB) {
    ctx.beginPath();
    ctx.arc(snake.x, snake.y, 15, 0, Math.PI * 2, true);
    ctx.fillStyle = colorRGB;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(snake.x - box / 4, snake.y - box / 4, 3, 0, Math.PI * 2, true);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(snake.x - box / 4 + box / 2, snake.y - box / 4, 3, 0, Math.PI * 2, true);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(snake.x - box / 4 + box / 2, snake.y - box / 4, 2, 0, Math.PI * 2, true);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(snake.x - box / 4, snake.y - box / 4, 2, 0, Math.PI * 2, true);
    ctx.fillStyle = 'black';
    ctx.fill();
}

function drawBody(snake, colorRGB) {
    ctx.beginPath();
    ctx.arc(snake.x, snake.y, 15, 0, Math.PI * 2, true);
    ctx.strokeStyle = colorRGB;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(snake.x, snake.y, 14, 0, Math.PI * 2, true);
    ctx.fillStyle = colorRGB;
    ctx.fill();
}

function drawSnake(snake, colorRGB) {
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            drawHead(snake[i], colorRGB);
        } else {
            drawBody(snake[i], colorRGB);
        }
    }
}

function draw() {
    //tampilan atas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 690, 60);
    //score
    ctx.font = '30px arial';
    ctx.textBaseline = 'hanging';
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText(`Score: ${score}`, 15, 22);
    //length
    ctx.font = '15px arial';
    ctx.textBaseline = 'hanging';
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText(`Length: ${snake.length}`, 17, 10);
    //invisible bar
    ctx.fillStyle = 'rgb(230,230,230)' //background
    ctx.beginPath();
    ctx.moveTo(470, 20);
    ctx.lineTo(670, 20);
    ctx.lineTo(670, 40);
    ctx.lineTo(470, 40);
    ctx.closePath();
    ctx.fill()
    let barColor = invisible === true && invPower > 25 ? 'rgb(245, 242, 66)' : invPower <= 25 ? 'red' : 'rgb(52, 235, 67)';
    ctx.fillStyle = barColor //inner box
    ctx.beginPath();
    ctx.moveTo(470, 20);
    ctx.lineTo(470 + invPower * 2, 20);
    ctx.lineTo(470 + invPower * 2, 40);
    ctx.lineTo(470, 40);
    ctx.closePath();
    ctx.fill()
    ctx.strokeStyle = 'black'; //outer box
    ctx.beginPath();
    ctx.moveTo(470, 20);
    ctx.lineTo(670, 20);
    ctx.lineTo(670, 40);
    ctx.lineTo(470, 40);
    ctx.closePath();
    ctx.stroke()
    ctx.font = '10px arial'; //text
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText('INVISIBLE', 620, 19);
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText(`${invPower}/100`, 470, 42);

    //untuk game screen
    ctx.fillStyle = 'rgb(100,100,300)';
    ctx.fillRect(0, 60, gameX, gameY);
    ctx.strokeStyle = 'black';
    for (let i = 0; i < gameX / 30; i++) {
        for (let j = 0; j < gameY / 30; j++) {
            ctx.strokeRect(i * 30, j * 30 + 60, 30, 30);
        }
    }
    // ctx.clearRect(30, 90, gameX - 60, gameY - 60)
    ctx.fillStyle = 'rgb(250,210,210)';
    ctx.fillRect(30, 90, gameX - 60, gameY - 60);

    //copyright
    ctx.font = '15px arial';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText('2019 By Andara Sophan', 490, 646);
    ctx.fillText('Game Snake', 561, 629);

    //draw snake && check invisibility
    if (invPower <= 0) {
        invisible = false;
    }
    if (invisible === true && invPower > 0) {
        snakeColor = invColor;
        invPower -= 1;
    } else {
        snakeColor = normalColor;
    }
    drawSnake(snake, snakeColor)

    //draw items (all food & bomb)
    ctx.drawImage(meatImg, meat.x, meat.y, box, box);
    for (let i = 0; i < veget.length; i++) {
        ctx.drawImage(vgtbl, veget[i].x, veget[i].y, box, box);
    }
    for (let i = 0; i < bomb.length; i++) {
        ctx.drawImage(bmb, bomb[i].x, bomb[i].y, box, box);
    }
    for (let i = 0; i < junkfood.length; i++) {
        ctx.drawImage(junk, junkfood[i].x, junkfood[i].y, box, box);
    }
    for (let i = 0; i < energydrink.length; i++) {
        ctx.drawImage(enrgy, energydrink[i].x, energydrink[i].y, box, box);
    }

    //cek diluar game screen atau tidak
    let inFrame = true;
    if (snake[0].x - box / 2 === 0 || snake[0].x + box / 2 === canvasX || snake[0].y - box / 2 === 0 || snake[0].y + box / 2 === canvasY) {
        inFrame = false;
    }

    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // which direction
    if (d == "LEFT" && snake[0].x - box / 2 > 0) {
        snakeX -= box;
        inFrame = true;
    } else if (d == "UP" && snake[0].y - box / 2 > 0) {
        snakeY -= box;
        inFrame = true;
    } else if (d == "RIGHT" && snake[0].x + box / 2 < canvasX) {
        snakeX += box;
        inFrame = true;
    } else if (d == "DOWN" && snake[0].y + box / 2 < canvasY) {
        snakeY += box;
        inFrame = true;
    }

    // add new Head
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    let tail = snake[snake.length - 1]; //buat ujung ular diwarnai saat gameover

    //cek makan item
    if (convertingHead(newHead).x == meat.x && convertingHead(newHead).y == meat.y && invisible === false) {
        score++;
        meat = makeFood(junkfood, convertingHead(newHead), veget, bomb, energydrink);
        let prob = Math.random();
        if (prob < 3 / 9) {
            junkfood.push(makeFood(junkfood, convertingHead(newHead), meat, veget, bomb, energydrink));
        } else if (prob < 6 / 9) {
            veget.push(makeFood(junkfood, convertingHead(newHead), meat, veget, bomb, energydrink));
        } else if (prob < 8 / 9) {
            bomb.push(makeFood(junkfood, convertingHead(newHead), meat, veget, bomb, energydrink));
        } else {
            energydrink.push(makeFood(junkfood, convertingHead(newHead), meat, veget, bomb, energydrink))
        }
    } else if (eatFood(convertingHead(newHead), junkfood)) {
        let prob = Math.random();
        if (prob < 1 / 3) {
            veget.push(makeFood(junkfood, convertingHead(newHead), meat, veget, bomb, energydrink));
        }
    } else if (eatFood(convertingHead(newHead), veget)) {
        let prob = Math.random();
        if (prob < 1 / 3) {
            bomb.push(makeFood(junkfood, convertingHead(newHead), meat, veget, bomb, energydrink));
        }
        score++;
        snake.pop();
        snake.pop();
    } else if (eatFood(convertingHead(newHead), energydrink)) {
        let prob = Math.random();
        if (prob < 1 / 3) {
            bomb.push(makeFood(junkfood, convertingHead(newHead), meat, veget, bomb, energydrink));
        }
        let newInvPower = invPower + 20; //tambah invisible power
        newInvPower > 100 ? invPower = 100 : invPower = newInvPower;
    } else {
        if (inFrame) {
            tail = snake.pop();
        }
    }

    // game over
    if (snakeX < box && invisible === false || snakeX > 22 * box && invisible === false || snakeY < 3 * box && invisible === false || snakeY > 22 * box && invisible === false || Collision(newHead, snake) && invisible === false || Collision(convertingHead(newHead), bomb) && invisible === false) {
        drawSnake(snake, deadColor)
        if (snake.length >= 1 && inFrame === true) {
            drawBody(tail, deadColor)
        } else if (inFrame === true) {
            drawHead(tail, deadColor)
        }
        clearInterval(game);
        dead = true;
    }
    if (inFrame) {
        snake.unshift(newHead);
    }
}
let game = setInterval(draw, speed);

const newGame = document.getElementById('reset');
newGame.addEventListener('click', reset)

function reset() {
    clearInterval(game)
    //reset initialization
    score = 0;
    snake = [];
    snake[0] = {
        x: gameX / 2,
        y: gameY / 2 + 60
    };
    meat = makeFood(convertingHead(snake[0]));
    junkfood = [];
    veget = [];
    bomb = [];
    energydrink = [];
    d = undefined;
    pause = false;
    dead = false;
    invPower = 100;
    game = setInterval(draw, speed);
}