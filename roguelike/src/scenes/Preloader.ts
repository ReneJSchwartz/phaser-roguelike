import { GameObjects, Scene } from 'phaser';

export class Preloader extends Scene {

    loadingText: GameObjects.Text;

    constructor() {
        super('Preloader');
    }

    init() {
        this.add.image(512, 384, 'background');

        // Outline of progress bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        // Progress bar fill.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        // For centering loadingText and other elements.
        var screenWidth = this.cameras.main.width;
        var screenHeight = this.cameras.main.height;

        this.loadingText = this.add.text(screenWidth / 2, screenHeight / 2, 'Loading', {
            fontFamily: 'Arial Black', fontSize: 22,
            color: '#ffffff', stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5);

        // Advance bar & text
        this.load.on('progress', (progress: number) => {
            // Min width + remaining as percentage of remaining width
            bar.width = 4 + (460 * progress);
            this.loadingText.text = "Loading  " + (progress * 100) + " %";
        });
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('logo', 'logo.png');
    }

    create() {
        // TODO Camera fade.

        // Linger a bit on 100 %.
        this.time.delayedCall(750, () => { this.scene.start('PressAnyKey') });
    }
}
