import { Scene } from 'phaser';

/** Main adventure gamemode that is started by selecting New Game. */
export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x302d2d);

        this.add.text(512, 384, 'Insert Gameplay here.', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
    }
}
