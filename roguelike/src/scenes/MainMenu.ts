import { Scene, GameObjects } from 'phaser';
import { Game } from './Game';
import { ScreenBackgroundColor } from './ScreenBackgroundColor';

/** 
 * Main menu view. 
 * Has buttons for starting the game etc.
 */
export class MainMenu extends Scene {
    gameTitle: GameObjects.Text;
    gameName: string = 'Like Rogue RL';
    /** A simple way to prevent buttons from firing multiple times accidentally. */
    shouldProcessButtonPresses: boolean = true;

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
            })
            .setOrigin(0.5);

        // Add Main Menu's main buttons: 
        // New Game, High Scores, Credits, Quit Game.
        // Buttons are 'three sliced' for perf. The height can't be modified.
        const newGameButton = this.add.nineslice(width * 0.5, height * 0.5, 'ui-border-1', 0, 96, 0, 20, 20)
            .setSize(width * 0.3, 0)
            .setInteractive()
            .on('pointerdown', () => this.onLoadNewGameButtonClicked())
            .on('pointerover', () => newGameButton.scale = 1.07)
            .on('pointerout', () => newGameButton.scale = 1);
        this.add.text(newGameButton.x, newGameButton.y, 'New Game')
            .setOrigin(0.5)
            .setStyle({ fontSize: 38 });

        const quitGameButton = this.add.nineslice(width * 0.5, height * 0.65, 'ui-border-1', 0, 96, 0, 20, 20)
            .setSize(width * 0.3, 0)
            .setInteractive()
            .on('pointerdown', () => console.log("Quit Game"))
            .on('pointerover', () => quitGameButton.scale = 1.07)
            .on('pointerout', () => quitGameButton.scale = 1);
        this.add.text(quitGameButton.x, quitGameButton.y, 'Quit Game')
            .setOrigin(0.5)
            .setStyle({ fontSize: 38 });
    }

    /** Loads a new game when button is pressed. Also initiates some visual effects. */
    private onLoadNewGameButtonClicked(): void {
        console.log(this.onLoadNewGameButtonClicked.name);

        // Guard clause against spamming buttons.
        if (this.shouldProcessButtonPresses === false) {
            return;
        }
        this.shouldProcessButtonPresses = false;

        // Visual effects for scene transition.
        ScreenBackgroundColor.instance.briefWhiteFlash();

        this.children.list.forEach(element => {
            this.tweens.add({
                targets: element,
                alpha: 0,
                duration: 250
            })
        });

        this.time.delayedCall(550, () => this.scene.start(Game.name));
    }
}
