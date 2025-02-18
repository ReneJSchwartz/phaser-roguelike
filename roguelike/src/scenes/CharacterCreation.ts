import { Scene, GameObjects } from 'phaser';
import { Game } from './Game';
import { ScreenBackgroundColor } from './ScreenBackgroundColor';

/** 
 * Character creation view.
 * In this single page view (PC) you pick your Ancestry, Background, Stats and 
 * probably spells. You can also see what will be in your inventory and info
 * about the currently selected items through an info panel that is always on.
 * The player also selects or randomizes their name.
 */
export class CharacterCreation extends Scene {
    /** 
     * Text gameobject of the title. Subject to bring in alpha tween at the 
     * beginning of the scene.
     */
    private screenTitle: GameObjects.Text;
    /** Game name placeholder. The game is a roguelike game. */
    private readonly screenName: string = 'Character Creation';
    /** A simple way to prevent buttons from firing multiple times. */
    private shouldProcessButtonPresses: boolean = true;

    constructor() {
        super('CharacterCreation');
    }

    create() {
        const { width, height } = this.scale;

        this.screenTitle = this.add.text(width * 0.5, height * 0.05,
            this.screenName, {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6, align: 'center'
        })
            .setOrigin(0.5)
            .setAlpha(0);

        // Different selection sections in the screen are in their containers
        // for movement and filtering
        const ancestrySectionContainer = this.add.container(width * 0.05, height * 0.15);
        const ancestryBg = this.add.image(0,0, '')
            .setScale(10, 10)
            .setOrigin(0, 0)
            .setAlpha(0.5);
        const ancestrySectionTitle = this.add.text(0, 0, 'Ancestry')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 });
        const ancestryOptions = this.add.text(0, 40, '> Human\n  Catfolk')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 28 });
        ancestrySectionContainer.add([ancestryBg, ancestrySectionTitle, ancestryOptions])
            .setAlpha(0);


        this.tweens.add({
            targets: this.children.list,
            alpha: 1,
        });
    }

    /** Loads a new game and initiates visual effects. */
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

        this.time.delayedCall(550, () => this.scene.start(Game.name));
    }
}
