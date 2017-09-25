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
            let playerSquare = this.game.add.bitmapData(100, 100);

            pumpkinSquare.rect(0, 0, 32, 32, "rgb(255, 165, 0)");
            this.game.cache.addBitmapData("pumpkin", pumpkinSquare);

            nekoSquare.rect(0, 0, 32, 32, 'rgb(0, 0, 0)');
            this.game.cache.addBitmapData('neko', nekoSquare);

            majoSquare.rect(0, 0, 32, 32, 'rgb(128, 128, 128)');
            this.game.cache.addBitmapData('majo', majoSquare);

            playerSquare.rect(0, 0, 100, 100, 'rgb(255, 192, 203)');
            this.game.cache.addBitmapData('player', playerSquare);
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
            this.checkWorldBounds = true;
            this.outOfBoundsKill = true;

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
        player: Phaser.Sprite;

        constructor() {
            super();
        }

        create() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.x = -400;

            this.kawaiiGroup = this.game.add.group();

            let spawnTimer = this.game.time.create(false);
            spawnTimer.loop(800, () => {
                let singleKawaii = new KawaiiSprite(this.game, this.game.width - 32, this.game.rnd.integerInRange(0, this.game.height - 32), '__default');
                this.kawaiiGroup.add(singleKawaii);
            }, this);
            spawnTimer.start();

            this.player = this.game.add.sprite(100, this.game.world.centerY, this.game.cache.getBitmapData('player'));
            this.game.physics.arcade.enable(this.player);
            this.player.body.allowGravity = false;
            this.player.body.collideWorldBounds = true;
        }

        update() {
            this.game.physics.arcade.collide(this.kawaiiGroup);

            this.player.body.velocity.y = 0;

            if (this.game.input.activePointer.isDown) {
                if (this.game.input.position.y < this.game.world.centerY) {
                    this.player.body.velocity.y = -300;
                } else if (this.game.input.position.y > this.game.world.centerY) {
                    this.player.body.velocity.y = 300;
                }
            }
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