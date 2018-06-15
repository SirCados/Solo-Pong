class Vector{
    constructor(x = 0, y = 0){ //default values
        this.x = x;
        this.y = y;
    }
    get length(){
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    set length(value){
        const factor = value / this.length;
        this.x *= factor;
        this.y *= factor;
    }
}

class Rectangle{
    constructor(width, height){
        this.position = new Vector;
        this.size = new Vector(width, height)
    }
    get left(){
        return this.position.x - this.size.x / 2;
    }
    get right(){
        return this.position.x + this.size.x / 2;
    }
    get top(){
        return this.position.y - this.size.y / 2;
    }
    get bottom(){
        return this.position.y + this.size.y / 2;
    }
}

class Ball extends Rectangle{
    constructor(){
        super(10,10);
        this.velocity = new Vector;
    }
}

class Player extends Rectangle{
    constructor(){
        super(20,100);
        this.score = 0;
        this.moveUp = false;
        this.moveDown = false;
    }    
}

class Pong{
    constructor(canvas){
        this._canvas = canvas;
        this._context = canvas.getContext("2d");

        this._ball = new Ball;   

        this._player = new Player;

        this._player.position.x = 40;
       
        this._player.position.y = this._canvas.height /2;

        let lastTime;
        const callback = (milliseconds) => {
            if(lastTime){
               this.update((milliseconds - lastTime) / 1000);
            }
            lastTime = milliseconds;        
            requestAnimationFrame(callback); //because requestAnimationFrame calls 'callback' only once, must attach so that it will constantly call and update
        }
        callback();

        this.CHAR_PIXEL = 10;
        this.CHARS = [
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111',
        ].map(string => {
            const canvas = document.createElement('canvas');
            canvas.height = this.CHAR_PIXEL * 5;
            canvas.width = this.CHAR_PIXEL * 3;
            const context = canvas.getContext('2d');
            context.fillStyle = "#fff";
            string.split('').forEach((fill, i) => {
                if(fill === '1'){
                    context.fillRect(
                        (i % 3) * this.CHAR_PIXEL,
                        (i/3 | 0) * this.CHAR_PIXEL,
                    this.CHAR_PIXEL,
                    this.CHAR_PIXEL);
                }
            });
            return canvas;
        });

        this.reset();
    }
    collisionDetection(player, ball){
        if(player.left < ball.right  && player.right > ball.left 
            && player.top < ball.bottom && player.bottom > ball.top){
                const length = ball.velocity.length;
                ball.velocity.x = -ball.velocity.x;
                ball.velocity.y += 300 * (Math.random() - .5);
                ball.velocity.length *= 1.05;
            }
    }
    draw(){
        this._context.fillStyle = "#000";
        this._context.fillRect(0, 0,  this._canvas.width,  this._canvas.height);

        this.drawRectangle(this._ball);

        this.drawRectangle(this._player);

        this.drawScore();
    }
    drawRectangle(rectangle){
        this._context.fillStyle = "#fff";
        this._context.fillRect(rectangle.left, rectangle.top,
             rectangle.size.x, rectangle.size.y);
    }
    drawScore(){
        const align = this._canvas.width / 3;
        const CHAR_WIDTH = this.CHAR_PIXEL * 4;
      
            const chars = this._player.score.toString().split('');
            const offset = align *                           
                           (CHAR_WIDTH * chars.length / 2) +
                           this.CHAR_PIXEL / 2;
            chars.forEach((char, position) => {
                this._context.drawImage(this.CHARS[char | 0], //this pipe in the brackets types to integers?
                                        offset + position * CHAR_WIDTH, 20);
            });
    }
    start(){
        if(this._ball.velocity.x === 0 & this._ball.velocity.y === 0){
            this._ball.velocity.x = 300 * (Math.random() > .5 ? 1: -1);
            this._ball.velocity.y = 300 * (Math.random() * 2 - 1);
            this._ball.velocity.length = 200;
        }
    }
    reset(){
        this._ball.position.x = this._canvas.width/2;
        this._ball.position.y = this._canvas.height/2;
        
        this._ball.velocity.x = 0;
        this._ball.velocity.y = 0;
    }
    update(deltaTime){
        this._ball.position.x += this._ball.velocity.x * deltaTime;
        this._ball.position.y += this._ball.velocity.y * deltaTime;

        if(this._player.moveUp){
            this._player.position.y -= 300 * deltaTime;
        }

        if(this._player.moveDown){
            this._player.position.y += 300 * deltaTime;
        }      
    
        if(this._ball.left < 0){
            const playerId = this._ball.velocity.x < 0 | 0; //this will evaluate to an integer   
            this.reset();            
            this._ball.velocity.x = -this._ball.velocity.x;
        }
    
        if(this._ball.top < 0 || this._ball.bottom >  this._canvas.height){
            this._ball.velocity.y = -this._ball.velocity.y;
        }

        if(this._ball.right >  this._canvas.width){
            this._player.score++;
            this._ball.velocity.x = -this._ball.velocity.x;
        }

        this.collisionDetection(this._player, this._ball);    
        this.draw();
    }
}

const canvas = document.getElementById("pong");
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
    pong._player.position.y = event.offsetY;
});

// function startMovePlayer(event){
//     if(event.keyCode === 87 && pong._player.moveDown === false){
//         pong._player.moveUp = true;
//     } else if(event.keyCode === 83 && pong._player.moveUp === false){
//         pong._player.moveDown = true;
//     }
//     if(event.keyCode === 38 && pong._players[1].moveDown === false){
//         pong._players[1].moveUp = true;
//     } else if(event.keyCode === 40 && pong._players[1].moveUp === false){
//         pong._players[1].moveDown = true;
//     }    
// }

// function stopMovePlayer(event){
//     if(event.keyCode === 87){
//         pong._players[1].moveUp = false;
//     } else if(event.keyCode === 83){
//         pong._players[1].moveDown = false;
//     }

//     if(event.keyCode === 38){
//         pong._players[1].moveUp = false;
//     } else if(event.keyCode === 40){
//         pong._players[1].moveDown = false;
//     }

// }

// canvas.addEventListener('keydown', event => {
//     startMovePlayer(event);
// });

// canvas.addEventListener('keyup', event => {
//     stopMovePlayer(event);
// });

canvas.addEventListener('click', event => {
    pong.start();
});
