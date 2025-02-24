import { Scene } from 'phaser';
import { MainMenu } from './MainMenu';
import { ScreenBackgroundColor } from './ScreenBackgroundColor';
import { StyleConfig } from '../config/style-config';
import i18next from 'i18next';
import { LocalizationId } from '../enums/localization-id';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- It is used. */
import { Localization } from '../config/localization';

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

    /** Adds prompt and input listener for loading menu scene. */
    create() {
        const { width, height } = this.scale;

        /** Grab prompt text from localization plugin {@link Localization}. */
        this.pressAnyKeyToContinueText = this.add.text(
            width / 2, height * 0.9, i18next.t(LocalizationId.PressAnyKey),
            StyleConfig.pressAnyKeyPromptStyle)
            .setOrigin(0.5);

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