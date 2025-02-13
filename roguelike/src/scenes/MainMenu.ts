import { Scene, GameObjects } from 'phaser';
import { Game } from './Game';

/** 
 * Main menu view. 
 * Has buttons for starting the game etc.
 */
export class MainMenu extends Scene {
    gameTitle: GameObjects.Text;
    gameName: string = 'fUntitled Roguelike';

    constructor() {
        super('MainMenu');
    }

    create() {
        const { width, height } = this.scale;

        this.gameTitle = this.add.text(width * 0.5, height * 0.25, this.gameName,
            {
                fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
                stroke: '#000000', strokeThickness: 6,
                align: 'center'
            }).setOrigin(0.5);

        // Add Main Menu's main buttons: 
        // New Game, High Scores, Credits, Quit Game.
        // Buttons are 'three sliced' for perf. The height can't be modified.
        const newGameButton = this.add.nineslice(width * 0.5, height * 0.5, 'ui-border-1', 0, 96, 0, 20, 20)
            .setSize(width * 0.3, 0)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start(Game.name);
            });
        this.add.text(newGameButton.x, newGameButton.y, 'New Game')
            .setOrigin(0.5)
            .setStyle({ fontSize: 38 });

        const quitGameButton = this.add.nineslice(width * 0.5, height * 0.65, 'ui-border-1', 0, 96, 0, 20, 20)
            .setSize(width * 0.3, 0)
            .setInteractive()
            .on('pointerdown', () => console.log("Quit Game"));
        this.add.text(quitGameButton.x, quitGameButton.y, 'Quit Game')
            .setOrigin(0.5)
            .setStyle({ fontSize: 38 });
    }
}
