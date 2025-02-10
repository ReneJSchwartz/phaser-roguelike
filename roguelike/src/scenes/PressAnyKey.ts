import { Scene, GameObjects } from 'phaser';

export class PressAnyKey extends Scene {
    constructor() {
        super('PressAnyKey');
    }

    create() {
        var screenWidth = this.cameras.main.width;
        var screenHeight = this.cameras.main.height;

        this.add.image(512, 384, 'background');
        this.add.text(screenWidth / 2, screenHeight * 0.9, 'Press Any Key To Continue', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        this.input.keyboard!.once('keydown', () => {
            this.scene.start('MainMenu')
        }, this);
    }
}