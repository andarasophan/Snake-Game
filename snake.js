const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

const box = 30;
let screen = 630;
let gameX = 690;
let gameY = 630;

let score = 0;

const meat = new Image();
meat.src = 'img/meat.png';
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

// function makeFood(objectPos1, objectPos2 = [], objectPos3 = [], objectPos4 = [], objectPos5 = []) { //junkfood karena array input pertama objectPos1(bentuknya array)
//     let obj = {
//         x: (Math.floor(Math.random() * 20.99999) + 1) * box,
//         y: (Math.floor(Math.random() * 18.99999) + 3) * box
//     }
//     if (Array.isArray(objectPos1)) {
//         for (let i = 0; i < objectPos1.length; i++) {
//             if (obj.x === objectPos1[i].x && obj.y === objectPos1[i].y || obj.x === objectPos2.x && obj.y === objectPos2.y || obj.x === objectPos3.x && obj.y === objectPos3.y || obj.x === objectPos4.x && obj.y === objectPos4.y || obj.x === objectPos5.x && obj.y === objectPos5.y) {
//                 return makeFood(objectPos1, objectPos2, objectPos3, objectPos4, objectPos5);
//             }
//         }
//         return obj;
//     } else {
//         if (obj.x === objectPos1.x && obj.y === objectPos1.y || obj.x === objectPos2.x && obj.y === objectPos2.y || obj.x === objectPos3.x && obj.y === objectPos3.y || obj.x === objectPos4.x && obj.y === objectPos4.y || obj.x === objectPos5.x && obj.y === objectPos5.y) {
//             return makeFood(objectPos1, objectPos2, objectPos3, objectPos4, objectPos5);
//         } else {
//             return obj;
//         }
//     }
// }

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

let food = makeFood(snake[0]);
let junkfood = [];
let veget = {};
let bomb = {};

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

function eatJunk(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x - box / 2 == array[i].x && head.y - box / 2 == array[i].y) {
            array.splice(i, 1);
            return true;
        }
    }
    return false;
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
    for (let i = 0; i < snake.length; i++) {
        ctx.beginPath();
        if (i === 0) {
            ctx.arc(snake[i].x, snake[i].y, 15, 0, Math.PI * 2, true);
            ctx.fillStyle = 'rgb(100,80,10)';
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
            ctx.strokeStyle = 'rgb(100,80,10)';
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(snake[i].x, snake[i].y, 14, 0, Math.PI * 2, true);
            ctx.fillStyle = 'rgb(100,80,10)';
            ctx.fill();
        }
    }
    //draw items (all food & bomb)
    ctx.drawImage(meat, food.x, food.y, box, box);
    ctx.drawImage(vgtbl, veget.x, veget.y, box, box);
    ctx.drawImage(bmb, bomb.x, bomb.y, box, box);
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


    let x = snake[snake.length - 1];
    if (snakeX - box / 2 == food.x && snakeY - box / 2 == food.y) {
        score++;
        food = makeFood(junkfood, snake[0], veget, bomb);
        let prob = Math.random();
        if (prob < 1 / 3) {
            junkfood.push(makeFood(junkfood, snake[0], food, veget, bomb));
        } else if (prob < 2 / 3) {
            if (veget.x === undefined) {
                veget = makeFood(junkfood, snake[0], food, bomb);
            }
        } else {
            if (bomb.x === undefined) {
                bomb = makeFood(junkfood, snake[0], food, veget);
            }
        }
    } else if (eatJunk(snake[0], junkfood)) {
        veget = {};
    } else if (snakeX - box / 2 == veget.x && snakeY - box / 2 == veget.y) {
        score++;
        snake.pop();
        snake.pop();
        veget = {};
    } else {
        x = snake.pop();
    }

    // add new Head
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // game over
    if (snakeX < box || snakeX > 22 * box || snakeY < 3 * box || snakeY > 22 * box || Collision(newHead, snake) || snakeX - box / 2 === bomb.x && snakeY - box / 2 === bomb.y) {
        for (let i = 0; i < snake.length; i++) {
            ctx.beginPath();
            if (i === 0) {
                ctx.arc(snake[i].x, snake[i].y, 15, 0, Math.PI * 2, true);
                ctx.fillStyle = 'rgb(100,0,0)';
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
                ctx.strokeStyle = 'rgb(100,0,0)';
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(snake[i].x, snake[i].y, 14, 0, Math.PI * 2, true);
                ctx.fillStyle = 'rgb(100,0,0)';
                ctx.fill();
            }
        }
        ctx.beginPath();
        ctx.arc(x.x, x.y, 15, 0, Math.PI * 2, true);
        ctx.strokeStyle = 'rgb(100,0,0)';
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x.x, x.y, 14, 0, Math.PI * 2, true);
        ctx.fillStyle = 'rgb(100,0,0)';
        ctx.fill();

        clearInterval(game);
    }

    snake.unshift(newHead);
}

let game = setInterval(draw, 100);