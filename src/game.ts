import { Game, Types, Scale } from 'phaser';
console.log("JJJ");


const startGame: () => void = (): void => {
    const gameCanvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement;
    function preload() {
        this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
    }
    function create() {
        this.add.image(400, 300, 'sky');

        var particles = this.add.particles('red');

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        var logo = this.physics.add.image(400, 100, 'logo');

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
    }

    const config: Types.Core.GameConfig = {
        type: Phaser.WEBGL,
        width: 800,
        height: 600,
        canvas: gameCanvas,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        scale: {
            mode: Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            width: 800,
            height: 600,
            min: {
                height: 240,
                width: 320,
            }
        },
        scene: {
            preload: preload,
            create: create
        }
    };
    const game: Game = new Game(config);

    console.log('Game is running', game.isRunning);
}

startGame();
