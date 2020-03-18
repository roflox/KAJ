import setPrototypeOf = Reflect.setPrototypeOf;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class Game {
    private _player: Player = new Player();
    private _world: World;
    private _running: boolean = false;
    private _imageSizes: number = 40;
    private _maxWidth: number = 950;
    private _maxHeight: number = 620;

    constructor(images: HTMLImageElement[]) {
        this._world = new World(document.querySelector("canvas"), images, this._imageSizes);
        this._world.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            // console.log(`x:${e.clientX}, y:${e.clientY}`);
            // this._canvas.drawCross(e.clientX, e.clientY);
            this._world.drawCross(e.offsetX, e.offsetY);
        });
        this._world.canvas.addEventListener("click", (e: MouseEvent) => {
            // console.log(e.offsetX, e.offsetY);
            this.shoot(e.offsetX, e.offsetY)
        });

    }

    start() {
        if (!this._running) {
            this._running = true;
            setInterval(() => {
                this.createVirus()
            }, 3000);
        } else {
            alert("game is already running");
        }
    }

    private shoot(x: number, y: number) {
        if (this._running) {
            const virus = this._world.virus;
            if (virus) {
                if (Math.abs(x - virus.pos.x) < this._imageSizes && Math.abs(y - virus.pos.y) < this._imageSizes) {
                    this._player.scored();
                    this._world.destroyVirus(true);
                } else {
                    this._player.missed();
                }
            } else {
                this._player.missed();
            }
            this.updateScoreBoard();
            // console.log(this._player);
        }
    }

    private createVirus() {
        console.log("creating virus");
        this._world.addVirus(new Virus(getRandomInt(this._maxWidth), getRandomInt(this._maxHeight)));
        setTimeout(() => {
            if (!this._world.destroyVirus(false)) {
                this._player.missed();
            }
            this.updateScoreBoard();
        }, 2000);
    };

    private updateScoreBoard() {
        document.querySelector("#score").textContent = this._player.score.toString();
        document.querySelector("#missed").textContent = this._player.fails.toString();
    }
}

class Player {
    private _score: number = 0;
    private _fails: number = 0;

    get score(): number {
        return this._score;
    }

    scored() {
        this._score++;
    }

    missed() {
        this._fails++;
        this._score--;
    }

    get fails(): number {
        return this._fails;
    }
}

class World {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _ctx: CanvasRenderingContext2D;
    private readonly _viruses: Virus[] = [];
    private cursorX: number;
    private cursorY: number;

    constructor(_canvas: HTMLCanvasElement, private readonly _images: HTMLImageElement[], private readonly _imageSizes) {
        this._canvas = _canvas;
        this._ctx = this._canvas.getContext("2d");
        this.drawCanvas();
    }

    drawCanvas() {
        images[0].onload = () => {
            this._ctx.drawImage(this._images[0], 10, 10);
        }
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

    addVirus(virus: Virus) {
        this._viruses.push(virus);
        this._ctx.drawImage(this._images[2], virus.pos.x, virus.pos.y, this._imageSizes, this._imageSizes);
    }

    public destroyVirus(killed: boolean): boolean {
        let poped;
        if (this._viruses.length > 0) {
            this._viruses.pop();
            poped = true;
        } else {
            poped = false;
        }
        this.resetCanvas();
        return !(poped && !killed);
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    drawCross(x: number, y: number) {
        this.resetCanvas();
        this.cursorX = x - 15;
        this.cursorY = y - 15;
    }
}

class Virus {

    constructor(private readonly xPos: number, private readonly yPos: number) {
    }

    get pos() {
        return {x: this.xPos, y: this.yPos}
    }
}

const imageSources: string[] = ["http://seznam.github.io/CVUT/KAJ/cviceni/04/corona/world-map.svg", "http://seznam.github.io/CVUT/KAJ/cviceni/04/corona/cr.png", "http://seznam.github.io/CVUT/KAJ/cviceni/04/corona/Corona.png"];
const images = [new Image, new Image(), new Image()];
images.forEach((img, index) => {
    img.src = imageSources[index];
});

const game = new Game(images);

console.log(game);

document.querySelector("#new-game").addEventListener("click", () => {
    game.start();
});
