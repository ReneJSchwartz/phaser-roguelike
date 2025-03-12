import { Input, Scene } from 'phaser';
import { GameManager } from '../game-manager';
import { Player } from '../entities/entities';

/** 
 * Main adventure gamemode that is started by selecting New Game
 * and going through Character Creation. Alternatively load new game 
 * can be also used when that is implemented.
 * 
 * Currently starts 7-day roguelike challenge jam's level which is a 
 * Trial/Unique Dungeon that has infinite floors and can be used
 * to test combat.
 * 
 * Atm used for grabbing player input as the scene has access to input
 * plugin and as a general class movement could be part of game class.
 */
export class Game extends Scene {
    // Player input handling (must be done in scene to access plugin?).
    /** 
     * Just pressed up? Look into refactoring using ready made functions.
     * Was used to limit user zooming through the map with light speed.
     */
    private firstUpPress = true;
    /** Just pressed down? */
    private firstDownPress = true;
    /** Just pressed left? */
    private firstLeftPress = true;
    /** Just pressed right? */
    private firstRightPress = true;

    constructor() {
        super('Game');
    }

    /** Starts the game via Game Manager. */
    create() {
        // Show level and UI and begin game loop.
        GameManager.Instance.startGame();
    }

    /** Processes input for the player. */
    update() {
        // todo Refactor (see free Phaser book). 

        // Processes pressing up to move or attack there. 
        // Also limits presses to only those made this frame. 
        const upW: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        const upArrow: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        if (this.firstUpPress && (upW?.isDown || upArrow.isDown)) {
            Player.Instance.moveUp();
            this.firstUpPress = false;
        }
        else if (!(upW?.isDown || upArrow.isDown)) {
            this.firstUpPress = true;
        }

        const downS: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        const downArrow: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        if (this.firstDownPress && (downS?.isDown || downArrow.isDown)) {
            Player.Instance.moveDown();
            this.firstDownPress = false;
        }
        else if (!(downS?.isDown || downArrow.isDown)) {
            this.firstDownPress = true;
        }
        const leftA: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const leftArrow: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        if (this.firstLeftPress && (leftA?.isDown || leftArrow.isDown)) {
            Player.Instance.moveLeft();
            this.firstLeftPress = false;
        }
        else if (!(leftA?.isDown || leftArrow.isDown)) {
            this.firstLeftPress = true;
        }
        const rightD: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        const rightArrow: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        if (this.firstRightPress && (rightD?.isDown || rightArrow.isDown)) {
            Player.Instance.moveRight();
            this.firstRightPress = false;
        }
        else if (!(rightD?.isDown || rightArrow.isDown)) {
            this.firstRightPress = true;
        }
    }
}
