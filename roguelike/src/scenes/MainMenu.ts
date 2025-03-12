import { Scene, GameObjects } from 'phaser';
import { ScreenBackgroundColor } from './ScreenBackgroundColor';
import { GameManager } from '../game-manager';
import { StyleConfig } from '../config/style-config';
import i18next from 'i18next';
import { LocalizationId } from '../enums/localization-id';

/** 
 * Main menu view. 
 * Has buttons for starting the game etc.
 */
export class MainMenu extends Scene {
    /** 
     * Text gameobject of the title. Subject to bring in alpha tween at the 
     * beginning of the scene.
     */
    private gameTitle: GameObjects.Text;
    /** A simple way to prevent buttons from firing multiple times. */
    private shouldProcessButtonPresses: boolean = false;

    constructor() {
        super('MainMenu');
    }

    /** Creates main menu UI and initializes GameManager. */
    create() {
        // Initialize game systems after player has proceeded 
        // from press any button scene and wants to play with the game
        // with their chosen input device.
        new GameManager();

        const { width, height } = this.scale;

        // Title
        this.gameTitle = this.add.text(width * 0.5, height * 0.2,
            i18next.t(LocalizationId.GameTitle), StyleConfig.gameTitleStyle)
            .setOrigin(0.5)
            .setAlpha(0);
        // Title entrance
        this.add.tween({
            targets: this.gameTitle,
            alpha: { to: 1, from: 0 },
            ease: 'cubic.in',
            duration: 1000,
        });

        // Main Menu's main buttons: 
        // New Game, High Scores, Credits, Quit Game etc.
        // Buttons are 'three sliced' for perf and simplicity. 
        // Height can't be modified on three sliced images.
        // Further vertical layoyt group could be made with 
        // Actions.GridAlign(items, options) with width 1 grid
        // or maybe AlignTo(items, position, [offsetX], [offsetY]) if it works.

        // New Game Button
        const newGameButtonContainer = this.add.container(width * 1.25, height * 0.5);
        const newGameButtonImage = this.add.nineslice(0, 0,
            'ui-border-1', 0, 96, 0, 20, 20)
            .setSize(width * 0.3, 0)
            .setInteractive()
            .on('pointerdown', () => { this.onStartNewGameButtonClicked(); })
            .on('pointerover', () => {
                if (this.shouldProcessButtonPresses === false) {
                    return;
                }

                this.tweens.killTweensOf(newGameButtonContainer);
                this.tweens.add({
                    targets: newGameButtonContainer,
                    scale: { from: newGameButtonContainer.scale, to: 1.07 },
                    // Duration of 0 hides the button as tween of duration 0 is bugged
                    // with some versions of Phaser
                    duration: 2000 * Math.max(0.01, (1.07 - newGameButtonContainer.scale))
                });
            })
            .on('pointerout', () => {
                if (this.shouldProcessButtonPresses === false) {
                    return;
                }

                this.tweens.killTweensOf(newGameButtonContainer);
                this.tweens.add({
                    targets: newGameButtonContainer,
                    scale: { from: newGameButtonContainer.scale, to: 1 },
                    duration: 2000 * Math.max(0.01, (newGameButtonContainer.scale - 1))
                });
            });
        const newGameButtonText = this.add.text(0, 0, i18next.t(LocalizationId.ButtonNewGame))
            .setOrigin(0.5)
            .setStyle({ fontSize: 38 });
        newGameButtonContainer.add([newGameButtonImage, newGameButtonText])
            .setAlpha(0);

        // Quit Game Button
        const quitGameButtonContainer = this.add.container(width * 1.5, height * 0.65);
        quitGameButtonContainer.name = 'quitGameButtonContainer';
        const quitGameButtonImage = this.add.nineslice(0, 0,
            'ui-border-1', 0, 96, 0, 20, 20)
            .setSize(width * 0.3, 0)
            .setInteractive()
            .on('pointerdown', () => console.log("Quit Game"))
            .on('pointerover', () => {
                if (this.shouldProcessButtonPresses === false) {
                    return;
                }

                this.tweens.killTweensOf(quitGameButtonContainer);
                this.tweens.add({
                    targets: quitGameButtonContainer,
                    scale: { from: quitGameButtonContainer.scale, to: 1.07 },
                    duration: 2000 * Math.max(0.01, (1.07 - quitGameButtonContainer.scale))
                });
            })
            .on('pointerout', () => {
                if (this.shouldProcessButtonPresses === false) {
                    return;
                }

                this.tweens.killTweensOf(quitGameButtonContainer);
                this.tweens.add({
                    targets: quitGameButtonContainer,
                    scale: { from: quitGameButtonContainer.scale, to: 1 },
                    duration: 2000 * Math.max(0.01, (quitGameButtonContainer.scale - 1))
                });
            });
        const quitGameButtonText = this.add.text(0, 0, i18next.t(LocalizationId.ButtonQuitGame))
            .setOrigin(0.5)
            .setStyle({ fontSize: 38 });
        quitGameButtonContainer.add([quitGameButtonImage, quitGameButtonText])
            .setAlpha(0);

        const versionText: GameObjects.Text = this.add.text(0, height, 'Game version 0.0.3', StyleConfig.gameVersionStyle)
            .setOrigin(0, 0)
            .setAlpha(0);
        versionText.setPosition(versionText.height * 0.5, height - versionText.height * 1.5);
        this.tweens.add({ targets: versionText, alpha: 1, delay: 1000 });

        // Other  functionality
        this.buttonsEntranceTweens([quitGameButtonContainer, newGameButtonContainer], width * 0.87);
    }

    /** 
     * Buttons' entrance from the left side. 
     *
     * @param targets Targets to tween: the buttons.
     * @param position Where to tween buttons on x-position.
     */
    private buttonsEntranceTweens(targets: GameObjects.Container[], position: number): void {
        this.add.tween({
            targets: targets,
            x: position,
            ease: 'cubic.out',
            duration: 1000,
            onComplete: () => { this.shouldProcessButtonPresses = true; },
            delay: 500,
        });
        this.add.tween({
            targets: targets,
            alpha: { from: 0, to: 1 },
            ease: 'cubic.in',
            duration: 1000,
            delay: 500
        });
    }

    /** When a new game is loaded the buttons slide away during transition. */
    private buttonsExitTween(): void {
        this.children.list.filter(x => x instanceof Phaser.GameObjects.Container)
            .forEach(element => this.add.tween({
                targets: element,
                x: element.x + 200,
                ease: 'cubic.out',
                duration: 500,
            }))
    }

    /** 
     * Starts a new game through Character Creation screen and initiates 
     * visual effects.
     */
    private onStartNewGameButtonClicked(): void {
        console.log(this.onStartNewGameButtonClicked.name);

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

        this.time.delayedCall(550, () => this.scene.start('CharacterCreation'));

        this.buttonsExitTween();
    }
}
