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
        const upW: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        const upArrow: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        if (Phaser.Input.Keyboard.JustDown(upW) || Phaser.Input.Keyboard.JustDown(upArrow)) {
            Player.Instance.moveUp();
        }

        const downS: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        const downArrow: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        if (Phaser.Input.Keyboard.JustDown(downS) || Phaser.Input.Keyboard.JustDown(downArrow)) {
            Player.Instance.moveDown();
        }

        const leftA: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const leftArrow: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        if (Phaser.Input.Keyboard.JustDown(leftA) || Phaser.Input.Keyboard.JustDown(leftArrow)) {
            Player.Instance.moveLeft();
        }

        const rightD: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        const rightArrow: Input.Keyboard.Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        if (Phaser.Input.Keyboard.JustDown(rightD) || Phaser.Input.Keyboard.JustDown(rightArrow)) {
            Player.Instance.moveRight();
        }
    }
}
