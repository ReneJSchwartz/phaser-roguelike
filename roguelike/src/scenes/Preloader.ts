import { GameObjects, Scene } from 'phaser';
import { PressAnyKey } from './PressAnyKey';
import i18next from 'i18next';
import { LocalizationId } from '../enums/localization-id';
import { Localization } from '../config/localization';

/** 
 * Preloads assets to global persistent cache to be used later.
 * Then loads next scene @see PressAnyKey.
 */
export class Preloader extends Scene {

    /** Shows player the progress of loading (e.g. Loading 42 %). */
    private loadingText: GameObjects.Text;
    /** 
     * Linger a bit before changing to next scene when 100 % of assets 
     * have been loaded. In Milliseconds. 
     * */
    private readonly fullyLoadedLingerTimeMs: number = 600;

    constructor() {
        super('Preloader');
    }

    init() {
        // This is the first screen to use localization.
        new Localization();

        const { width, height } = this.scale;

        // Outline of progress bar.
        this.add.rectangle(width / 2, height / 2, 468, 32)
            .setStrokeStyle(1, 0xffffff);
        // Progress bar fill.
        const bar = this.add.rectangle(width / 2 - 468 / 2 + 4, height / 2, 4, 28, 0xffffff);


        this.loadingText = this.add.text(width / 2, height / 2, 'Loading', {
            fontFamily: 'Arial Black', fontSize: 22,
            color: '#ffffff', stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5);

        // Advance bar & text
        const loadingPrefix: string = i18next.t(LocalizationId.LoadingPrefix);
        this.load.on('progress', (progress: number) => {
            // Min width + remaining as percentage of remaining width
            bar.width = 4 + (460 * progress);
            this.loadingText.text = loadingPrefix + (progress * 100) + " %";
        });
    }

    preload() {
        // Due to low amount of assets these will be kept in memory for now.

        this.load.setPath('assets');
        this.load.image('logo', 'logo.png');

        // UI & Main Menu
        this.load.image('ui-border-1', 'panel-border-009.png');
    }

    create() {
        // TODO Camera fade between scenes.

        this.time.delayedCall(this.fullyLoadedLingerTimeMs, () => {
            this.scene.start(PressAnyKey.name)
        });
    }
}
