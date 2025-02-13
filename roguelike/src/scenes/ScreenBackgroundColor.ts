import { Scene } from 'phaser';

/**
 * Used to have consistent background color that animates a bit behind scene
 * elements and which can be used to have hit effects or show hp intuitively.
 * Sort of mimics breathing. And can show a taking damage effect on background.
 *  */
export class ScreenBackgroundColor extends Scene {
    /**
     * RGB value between 11 and 20 that colors the background.
     * 20 is heavily damaged when at 10 % health
     * and 11 is anything between 50-100 %.
     * Normal behaviour tries to show a faint yellow hue.
     * */
    private redLevel: number = 11;
    /** 
     * When taking 10 % or more damage out of remaining health pool 
     * flash the screen red.
     */
    private readonly hitFlashRedLevel: number = 25;
    /**
     * Between 1 and 2 normally. In combat this goes to 1.5 x speed unless
     * health is lower than 50 % after which this starts to increase to 2x
     * which happens at 10% health.
     */
    private timeScale: number = 1;
    /**
     * How often breathing pattern happens. Also the speed of the effect:
     * Calm to brisk frantic (2000 - 1500 - 1000). Though this change
     * is achieved with @see timeScale. Con stat would increase this.
     * In milliseconds.
     * */
    private baseDurationMs: number = 2000;
    /**
     * The tween that animates all this. Tween can be controlled with
     * this reference and it also controls itself when it repeats.
     */
    private tween: Phaser.Tweens.Tween;

    /**
     * Lazy singletonish access pattern for accessing
     * ScreenBackgroundColor. Could be maybe refactored away if
     * everything would be static or be made as a proper singleton.
     */
    public static instance: ScreenBackgroundColor;


    constructor() {
        super('ScreenBackgroundColor');
    }

    preload() {

    }

    /** Starts color changing effect. */
    create() {
        ScreenBackgroundColor.instance = this;
        this.cameras.main.setBackgroundColor("#070707");
        this.startTween();
    }

    /** 
     * A background light effect that simulates changing very dim light
     * level and resembles breathing but is not very smooth and might annoy
     * users, placeholder? Important game elements have their own
     * backgrounds. Can be used to set the mood based on hp.
     * Goes to a yellowish tint. 
     * Might need restarting from time tot time.     
     */
    private startTween(): void {
        console.log(this.redLevel);

        this.tween = this.tweens.add({
            targets: this.cameras.main.backgroundColor,
            red: this.redLevel,
            green: 11,
            blue: 9,
            duration: this.baseDurationMs,
            yoyo: true,
            repeat: -1,
            onRepeat: () => {
                this.tween.updateTo('red', this.redLevel);
                this.tween.timeScale = this.timeScale;
            }
        });
    }

    /**
     * Get hit effect, when hit for 10 % of remaining hp or more.
     * Flashes screen background red. Doubles as a fun screen transition
     * for user input in major menus and such (if it would work).
     */
    public redHitFlash(): void {
        const hitFlashTween = this.tweens.add({
            targets: this.cameras.main.backgroundColor,
            red: this.hitFlashRedLevel,
            green: 11,
            blue: 9,
            duration: this.baseDurationMs,
            yoyo: true,
            onStart: () => this.tween.pause,
            onComplete: () => this.tween.resume()
        });
        hitFlashTween.timeScale = 3;
    }

    /** Lightens the screen for a bit. */
    public briefWhiteLight(): void {
        const whiteLightFlash = this.tweens.add({
            targets: this.cameras.main.backgroundColor,
            red: 18,
            green: 18,
            blue: 18,
            duration: this.baseDurationMs,
            yoyo: true,
            onStart: () => this.tween.pause,
            onComplete: () => this.tween.resume()
        });
        whiteLightFlash.timeScale = 2;
    }
}
