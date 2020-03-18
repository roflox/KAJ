var setPrototypeOf = Reflect.setPrototypeOf;
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
class Game {
    constructor(images) {
        this._player = new Player();
        this._running = false;
        this._imageSizes = 40;
        this._maxWidth = 950;
        this._maxHeight = 620;
        this._world = new World(document.querySelector("canvas"), images, this._imageSizes);
        this._world.canvas.addEventListener("mousemove", (e) => {
            // console.log(`x:${e.clientX}, y:${e.clientY}`);
            // this._canvas.drawCross(e.clientX, e.clientY);
            this._world.drawCross(e.offsetX, e.offsetY);
        });
        this._world.canvas.addEventListener("click", (e) => {
            // console.log(e.offsetX, e.offsetY);
            this.shoot(e.offsetX, e.offsetY);
        });
    }
    start() {
        if (!this._running) {
            this._running = true;
            setInterval(() => {
                this.createVirus();
            }, 3000);
        }
        else {
            alert("game is already running");
        }
    }
    shoot(x, y) {
        if (this._running) {
            const virus = this._world.virus;
            if (virus) {
                if (Math.abs(x - virus.pos.x) < this._imageSizes && Math.abs(y - virus.pos.y) < this._imageSizes) {
                    this._player.scored();
                    this._world.destroyVirus(true);
                }
                else {
                    this._player.missed();
                }
            }
            else {
                this._player.missed();
            }
            this.updateScoreBoard();
            // console.log(this._player);
        }
    }
    createVirus() {
        console.log("creating virus");
        this._world.addVirus(new Virus(getRandomInt(this._maxWidth), getRandomInt(this._maxHeight)));
        setTimeout(() => {
            if (!this._world.destroyVirus(false)) {
                this._player.missed();
            }
            this.updateScoreBoard();
        }, 2000);
    }
    ;
    updateScoreBoard() {
        document.querySelector("#score").textContent = this._player.score.toString();
        document.querySelector("#missed").textContent = this._player.fails.toString();
    }
}
class Player {
    constructor() {
        this._score = 0;
        this._fails = 0;
    }
    get score() {
        return this._score;
    }
    scored() {
        this._score++;
    }
    missed() {
        this._fails++;
        this._score--;
    }
    get fails() {
        return this._fails;
    }
}
class World {
    constructor(_canvas, _images, _imageSizes) {
        this._images = _images;
        this._imageSizes = _imageSizes;
        this._viruses = [];
        this._canvas = _canvas;
        this._ctx = this._canvas.getContext("2d");
        this.drawCanvas();
    }
    drawCanvas() {
        images[0].onload = () => {
            this._ctx.drawImage(this._images[0], 10, 10);
        };
    }
    get virus() {
        return this._viruses[0];
    }
    resetCanvas() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.drawImage(this._images[0], 10, 10);
        for (const virus of this._viruses) {
            this._ctx.drawImage(this._images[2], virus.pos.x, virus.pos.y, this._imageSizes, this._imageSizes);
        }
        this._ctx.drawImage(this._images[1], this.cursorX, this.cursorY, this._imageSizes, this._imageSizes);
    }
    addVirus(virus) {
        this._viruses.push(virus);
        this._ctx.drawImage(this._images[2], virus.pos.x, virus.pos.y, this._imageSizes, this._imageSizes);
    }
    destroyVirus(killed) {
        let poped;
        if (this._viruses.length > 0) {
            this._viruses.pop();
            poped = true;
        }
        else {
            poped = false;
        }
        this.resetCanvas();
        return !(poped && !killed);
    }
    get canvas() {
        return this._canvas;
    }
    drawCross(x, y) {
        this.resetCanvas();
        this.cursorX = x - 15;
        this.cursorY = y - 15;
    }
}
class Virus {
    constructor(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }
    get pos() {
        return { x: this.xPos, y: this.yPos };
    }
}
const imageSources = ["http://seznam.github.io/CVUT/KAJ/cviceni/04/corona/world-map.svg", "http://seznam.github.io/CVUT/KAJ/cviceni/04/corona/cr.png", "http://seznam.github.io/CVUT/KAJ/cviceni/04/corona/Corona.png"];
const images = [new Image, new Image(), new Image()];
images.forEach((img, index) => {
    img.src = imageSources[index];
});
const game = new Game(images);
console.log(game);
document.querySelector("#new-game").addEventListener("click", () => {
    game.start();
});
//# sourceMappingURL=main.js.map