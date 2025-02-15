import { Scene } from 'phaser';
import { MainMenu } from './MainMenu';
import { ScreenBackgroundColor } from './ScreenBackgroundColor';

/**
 * Press any key screen that accepts input from mouse of keyboard to progress
 * to the next screen as a way to satisfy console requirements.
 * Note: needs to accept more input types in the future so it really accepts 
 * "any" key.
 */
export class PressAnyKey extends Scene {
    private pressAnyKeyToContinueText: Phaser.GameObjects.Text;

    constructor() {
        super('PressAnyKey');
    }

    create() {
        const { width, height } = this.scale;

        this.pressAnyKeyToContinueText = this.add.text(
            width / 2, height * 0.9, 'Press Any Key To Continue', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.loadMainMenu();
        });

        this.input.keyboard!.once('keydown', () => {
            this.loadMainMenu();
        }, this);
    }

    /** 
     * Loads main menu with delay and starts some transition effect
     * along with hiding the text that's visible on the screen. 
     * */
    private loadMainMenu(): void {
        ScreenBackgroundColor.instance.briefWhiteFlash();

        this.tweens.add({
            targets: this.pressAnyKeyToContinueText,
            alpha: 0,
            duration: 250,
        })

        this.time.delayedCall(550, () => this.scene.start(MainMenu.name));
    }
}