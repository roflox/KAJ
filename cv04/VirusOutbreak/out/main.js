function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const promiseTimeout = (milliseconds) => {
    return new Promise(resolve => setTimeout(() => resolve(), milliseconds));
};
class Game {
    constructor(images) {
        this._running = false;
        this._imageSizes = 60;
        this._maxWidth = 950;
        this._maxHeight = 620;
        this._redPixelMultiplier = 19;
        this._world = new World(document.querySelector("canvas"), images, this._imageSizes, this._redPixelMultiplier);
        this._player = new Player();
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
    restart() {
        clearInterval(this._virusInterval);
        this._player.restartScore();
        this._world.restartWorld();
        this.updateScoreBoard();
        this._running = false;
        document.querySelector("#go").classList.add("hidden");
    }
    start() {
        if (!this._running && this._player.killed === 0 && this._player.fails === 0) {
            this._running = true;
            this._virusInterval = setInterval(() => {
                if (this._player.fails >= 50) {
                    this.gameOver();
                }
                else {
                    this.createVirus();
                }
            }, 2000);
        }
        else {
            // alert("game is already running");
        }
    }
    gameOver() {
        console.log("GAME OVER, YOU LOOSER!");
        clearInterval(this._virusInterval);
        document.querySelector("#go").classList.remove("hidden");
        this._running = false;
        // this.restart();
    }
    shoot(x, y) {
        if (this._running) {
            const virus = this._world.virus;
            if (virus) {
                if (Math.abs(x - virus.pos.x) < this._imageSizes && Math.abs(y - virus.pos.y) < this._imageSizes) {
                    this._player.scored();
                    this._world.destroyVirus(true);
                }
                this.updateScoreBoard();
                // console.log(this._player);
            }
        }
    }
    createVirus() {
        // console.log("creating virus");
        this._world.addVirus(new Virus(getRandomInt(0, this._maxWidth - this._imageSizes), getRandomInt(0, this._maxHeight - this._imageSizes)));
        promiseTimeout(1000).then(() => {
            if (this._running) {
                if (!this._world.destroyVirus(false)) {
                    this._player.missed();
                    this._world.increaseRedPixels();
                }
                this.updateScoreBoard();
            }
        });
    }
    ;
    updateScoreBoard() {
        document.querySelector("#score").textContent = this._player.score.toString();
        document.querySelector("#missed").textContent = this._player.fails.toString();
        document.querySelector("#killed").textContent = this._player.killed.toString();
    }
}
class Player {
    constructor() {
        this._fails = 0;
        this._killedViruses = 0;
        document.querySelector("#new-game").addEventListener("click", () => {
            game.start();
        });
        document.querySelector("#restart-game").addEventListener("click", () => {
            game.restart();
        });
    }
    get score() {
        return this._killedViruses - this._fails;
    }
    get killed() {
        return this._killedViruses;
    }
    scored() {
        this._killedViruses++;
    }
    missed() {
        this._fails++;
    }
    restartScore() {
        this._fails = 0;
        this._killedViruses = 0;
    }
    get fails() {
        return this._fails;
    }
}
class World {
    constructor(_canvas, _images, _imageSizes, _redPixelsMultiplier) {
        this._images = _images;
        this._imageSizes = _imageSizes;
        this._redPixelsMultiplier = _redPixelsMultiplier;
        this._viruses = [];
        this._redPixels = 0;
        this._canvas = _canvas;
        this._ctx = this._canvas.getContext("2d");
        this.drawCanvas();
    }
    increaseRedPixels() {
        this._redPixels += this._redPixelsMultiplier;
        this.redrawCanvas();
    }
    restartWorld() {
        this._redPixels = 0;
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.drawImage(this._images[0], 10, 10);
        this._viruses = [];
    }
    drawCanvas() {
        images[0].onload = () => {
            this._ctx.drawImage(this._images[0], 10, 10);
        };
    }
    get virus() {
        return this._viruses[0];
    }
    redrawCanvas() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.drawImage(this._images[0], 10, 10);
        this._ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        this._ctx.fillRect(0, 0, this._redPixels, 620);
        for (const virus of this._viruses) {
            this._ctx.drawImage(this._images[2], virus.pos.x, virus.pos.y, this._imageSizes, this._imageSizes);
        }
        this._ctx.drawImage(this._images[1], this._cursorX - 15, this._cursorY - 15, this._imageSizes, this._imageSizes);
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
        this.redrawCanvas();
        return !(poped && !killed);
    }
    get canvas() {
        return this._canvas;
    }
    drawCross(x, y) {
        this.redrawCanvas();
        this._cursorX = x - 15;
        this._cursorY = y - 15;
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
const images = [new Image(), new Image(), new Image()];
images.forEach((img, index) => {
    img.src = imageSources[index];
});
const game = new Game(images);
// console.log(game)
//# sourceMappingURL=main.js.map