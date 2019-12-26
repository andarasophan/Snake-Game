const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

const box = 30;
let screen = 630;
let gameX = 690;
let gameY = 630;

let score = 0;

//read all food
const meatImg = new Image();
meatImg.src = 'img/meat.png';
const junk = new Image();
junk.src = 'img/junk.png';
const vgtbl = new Image();
vgtbl.src = 'img/vegetable.png';
const bmb = new Image();
bmb.src = 'img/bomb.png';

let snake = [];
snake[0] = {
    x: gameX / 2,
    y: gameY / 2 + 60
};

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

let meat = makeFood(snake[0]);
let junkfood = [];
let veget = [];
let bomb = [];

//control the snake
let d;
document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") {
        d = "LEFT";
    } else if (key == 38 && d != "DOWN") {
        d = "UP";
    } else if (key == 39 && d != "LEFT") {
        d = "RIGHT";
    } else if (key == 40 && d != "UP") {
        d = "DOWN";
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
        if (head.x == array[i].x && head.y == array[i].y) {
            array.splice(i, 1);
            return true;
        }
    }
    return false;
}

function drawSnake(snake, colorRGB) {
    for (let i = 0; i < snake.length; i++) {
        ctx.beginPath();
        if (i === 0) {
            ctx.arc(snake[i].x, snake[i].y, 15, 0, Math.PI * 2, true);
            ctx.fillStyle = colorRGB;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(snake[i].x - box / 4, snake[i].y - box / 4, 3, 0, Math.PI * 2, true);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(snake[i].x - box / 4 + box / 2, snake[i].y - box / 4, 3, 0, Math.PI * 2, true);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(snake[i].x - box / 4 + box / 2, snake[i].y - box / 4, 2, 0, Math.PI * 2, true);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(snake[i].x - box / 4, snake[i].y - box / 4, 2, 0, Math.PI * 2, true);
            ctx.fillStyle = 'black';
            ctx.fill();

        } else {
            ctx.arc(snake[i].x, snake[i].y, 15, 0, Math.PI * 2, true);
            ctx.strokeStyle = colorRGB;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(snake[i].x, snake[i].y, 14, 0, Math.PI * 2, true);
            ctx.fillStyle = colorRGB;
            ctx.fill();
        }
    }
}

function draw() {
    //tampilan atas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 690, 60);

    ctx.font = '30px serif';
    ctx.textBaseline = 'hanging';
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText(`Score: ${score}`, 15, 18);

    ctx.font = '15px serif';
    ctx.textBaseline = 'hanging';
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText(`Length: ${snake.length}`, 17, 6);

    ctx.font = '15px serif';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText('2019 By Andara Sophan', 540, 40);
    ctx.fillText('Game Snake', 611, 20);

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

    //draw snake
    drawSnake(snake, 'rgb(100,80,10)')

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

    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // which direction
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    let tail = snake[snake.length - 1]; //buat ujung ular diwarnai saat gameover
    let convertHead = {};
    convertHead['x'] = snake[0].x - box / 2;
    convertHead['y'] = snake[0].y - box / 2;

    if (convertHead.x == meat.x && convertHead.y == meat.y) {
        score++;
        meat = makeFood(junkfood, convertHead, veget, bomb);
        let prob = Math.random();
        if (prob < 3 / 7) {
            junkfood.push(makeFood(junkfood, convertHead, meat, veget, bomb));
        } else if (prob < 6 / 7) {
            veget.push(makeFood(junkfood, convertHead, meat, veget, bomb));
        } else {
            bomb.push(makeFood(junkfood, convertHead, meat, veget, bomb));
        }
    } else if (eatFood(convertHead, junkfood)) {
        let prob = Math.random();
        if (prob < 1 / 3) {
            veget.push(makeFood(junkfood, convertHead, meat, veget, bomb));
        }
    } else if (eatFood(convertHead, veget)) {
        let prob = Math.random();
        if (prob < 1 / 3) {
            bomb.push(makeFood(junkfood, convertHead, meat, veget, bomb));
        }
        score++;
        snake.pop();
        snake.pop();
    } else {
        tail = snake.pop();
    }

    // add new Head
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // game over
    if (snakeX < box || snakeX > 22 * box || snakeY < 3 * box || snakeY > 22 * box || Collision(newHead, snake) || Collision(convertHead, bomb)) {
        drawSnake(snake, 'rgb(100,0,0)')
        ctx.beginPath();
        ctx.arc(tail.x, tail.y, 15, 0, Math.PI * 2, true);
        ctx.strokeStyle = 'rgb(100,0,0)';
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(tail.x, tail.y, 14, 0, Math.PI * 2, true);
        ctx.fillStyle = 'rgb(100,0,0)';
        ctx.fill();

        clearInterval(game);
    }

    snake.unshift(newHead);
}

let game = setInterval(draw, 100);