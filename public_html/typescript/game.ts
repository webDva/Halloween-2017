/*
 * Template
 */
module GameModuleName {
    /*
     * Boot state for only loading the loading screen
     */
    export class BootState extends Phaser.State {
        constructor() {
            super();
        }

        init() {
            // Set background color
            this.game.stage.backgroundColor = "#312341";
        }

        preload() {
            // Load loading screen image
        }

        create() {
            // Start true loading state
            this.game.state.start("PreloadState");
        }
    }

    /*
     * Preload state for actually loading assets
     */
    export class PreloadState extends Phaser.State {
        constructor() {
            super();
        }

        preload() {
            // Display the loading screen image
            // Load assets

            // test square graphic
            let pumpkinSquare = this.game.add.bitmapData(32, 32);
            let nekoSquare = this.game.add.bitmapData(32, 32);
            let majoSquare = this.game.add.bitmapData(32, 32);

            pumpkinSquare.rect(0, 0, 32, 32, "rgb(255, 165, 0)");
            this.game.cache.addBitmapData("pumpkin", pumpkinSquare);

            nekoSquare.rect(0, 0, 32, 32, 'rgb(0, 0, 0)');
            this.game.cache.addBitmapData('neko', nekoSquare);

            majoSquare.rect(0, 0, 32, 32, 'rgb(128, 128, 128)');
            this.game.cache.addBitmapData('majo', majoSquare);
        }

        create() {
            this.game.state.start("GameState");
        }
    }

    export enum HalloweenArchetype {
        Pumpkin,
        Majo,
        Neko
    }

    /*
     * A falling, kawaii pixel art circle of a Halloween archetype.
     */
    export class KawaiiSprite extends Phaser.Sprite {
        halloweenArchetype: HalloweenArchetype;

        /*
         * Not gonna pass the GameState so that this object can be self-contained or whatever. You can rely on
         * Phaser.Group for adding onInputDown Signals and stuff.
         */
        constructor(game: Phaser.Game, x: number, y: number, key: string) {
            super(game, x, y, key);

            this.game.physics.arcade.enable(this);
            this.body.collideWorldBounds = true;

            let randomType = this.game.rnd.integerInRange(0, 2);
            if (randomType === 0) {
                this.loadTexture(this.game.cache.getBitmapData('pumpkin'));
            } else if (randomType === 1) {
                this.loadTexture(this.game.cache.getBitmapData('majo'));
            } else if (randomType === 2) {
                this.loadTexture(this.game.cache.getBitmapData('neko'));
            }

            // Add to the display, but the physics system already did this, so this is redundant.
            this.game.stage.addChild(this);
        }
    }

    /*
     * The main game running state
     */
    export class GameState extends Phaser.State {
        game: Phaser.Game;

        kawaiiGroup: Phaser.Group;

        constructor() {
            super();
        }

        create() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 400;

            this.kawaiiGroup = this.game.add.group();

            let spawnTimer = this.game.time.create(false);
            spawnTimer.loop(800, () => {
                let singleKawaii = new KawaiiSprite(this.game, this.game.rnd.integerInRange(0, this.game.width - 32), 0, '__default');
                this.kawaiiGroup.add(singleKawaii);
            }, this);
            spawnTimer.start();
        }

        update() {
            this.game.physics.arcade.collide(this.kawaiiGroup);
        }
    }

    export class Game {
        game: Phaser.Game;

        constructor() {
            this.game = new Phaser.Game(550, 550, Phaser.AUTO, "phaser");

            /* The boot state will contain an init() for the scale manager and will load the loading screen,
             * while the preloader will display the loading screen and load assets and then start the main game state.
             */
            this.game.state.add("BootState", BootState, true);
            this.game.state.add("PreloadState", PreloadState);
            this.game.state.add("GameState", GameState);
        }
    }
}

window.onload = () => {
    let game = new GameModuleName.Game();
}; 