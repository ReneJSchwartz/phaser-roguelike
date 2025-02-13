import { Scene } from 'phaser';
import { Preloader } from './Preloader';
import { ScreenBackgroundColor } from './ScreenBackgroundColor';

/** 
 * First scene of the game. 
 * A lite preloader for the actual @see Preloader scene if you will.
 *  */
export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {

    }

    create() {
        this.cameras.main.setBackgroundColor(0x302d2d);

        this.scene.start(Preloader.name);
        this.scene.launch(ScreenBackgroundColor.name);
    }
}
