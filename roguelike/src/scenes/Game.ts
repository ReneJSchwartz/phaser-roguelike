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
 * Also has player's input handling.
 */
export class Game extends Scene {
    // Player input handling (must be done in scene to access plugin?).
    /** 
     * Just pressed up? Needed since Phaser's default gamepad implementation
     * does not have JustDown() like keyboard does.
     */
    private firstUpPress = true;
    /** Just pressed down? Limits rate of gamepad movement. */
    private firstDownPress = true;
    /** Just pressed left? Limits rate of gamepad movement. */
    private firstLeftPress = true;
    /** Just pressed right? Limits rate of gamepad movement. */
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
        // Processes pressing up to move or attack there. 

        // Keyboard, uses JustDown
        const upW: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        const upArrow: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        if (Phaser.Input.Keyboard.JustDown(upW) || Phaser.Input.Keyboard.JustDown(upArrow)) {
            Player.Instance.moveUp();
            this.firstUpPress = false;
        }
        else if (this.input.gamepad?.pad1.up && this.firstUpPress) {
            // Gamepad, uses custom pressed this frame check.
            // Gamepad presses are limited by firstDirPress as 
            // otherwise the player would go lightspeed.
            Player.Instance.moveUp();
            this.firstUpPress = false;
        }
        else {
            // Once not pressed up gamepad can move in that direction
            // on the next frame. 
            this.firstUpPress = true;
        }

        const downS: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        const downArrow: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        if (Phaser.Input.Keyboard.JustDown(downS) || Phaser.Input.Keyboard.JustDown(downArrow)) {
            Player.Instance.moveDown();
            this.firstDownPress = false;
        }
        else if (this.input.gamepad?.pad1.down && this.firstDownPress) {
            Player.Instance.moveDown();
            this.firstDownPress = false;
        }
        else {
            this.firstDownPress = true;
        }

        const leftA: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const leftArrow: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        if (Phaser.Input.Keyboard.JustDown(leftA) || Phaser.Input.Keyboard.JustDown(leftArrow)) {
            Player.Instance.moveLeft();
            this.firstLeftPress = false;
        }
        else if (this.input.gamepad?.pad1.left && this.firstLeftPress) {
            Player.Instance.moveLeft();
            this.firstLeftPress = false;
        }
        else {
            this.firstLeftPress = true;
        }

        const rightD: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        const rightArrow: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        if (Phaser.Input.Keyboard.JustDown(rightD) || Phaser.Input.Keyboard.JustDown(rightArrow)) {
            Player.Instance.moveRight();
            this.firstRightPress = false;
        }
        else if (this.input.gamepad?.pad1.right && this.firstRightPress) {
            Player.Instance.moveRight();
            this.firstRightPress = false;
        }
        else {
            this.firstRightPress = true;
        }
    }
}
