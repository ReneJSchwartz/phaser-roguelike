import { Scene } from 'phaser';
import { GameManager } from '../game-manager';

/** 
 * Main adventure gamemode that is started by selecting New Game
 * and going through Character Creation. Alternatively load new game 
 * can be also used when that is implemented.
 * 
 * Stub until game logic has been designed & diagrammed.
 */
export class Game extends Scene {
    /** Main camera. */
    camera: Phaser.Cameras.Scene2D.Camera;

    constructor() {
        super('Game');
    }

    /** Create UI and start the game. */
    create() {
        this.camera = this.cameras.main;
        const { width, height } = this.scale;

        // Placeholder text.
        this.add.text(width * 0.5, height * 0.5, 'Insert Gameplay here.', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Show map and begin game loop.
        GameManager.Instance.startGame();
    }
}
