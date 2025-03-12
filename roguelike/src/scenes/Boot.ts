import { Scene } from 'phaser';
import { Preloader } from './Preloader';

/** 
 * First scene of the game. 
 * A lite preloader for the actual {@link Preloader} scene if you will.
 */
export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {

    }

    create() {
        this.cameras.main.setBackgroundColor(0x302d2d);

        this.scene.start('Preloader');
        this.scene.launch('ScreenBackgroundColor');
    }
}
