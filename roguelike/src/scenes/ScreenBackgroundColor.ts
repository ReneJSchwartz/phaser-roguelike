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
     * RGBA value between 0-255.
     */
    private redLevel: number = 11;
    /** 
     * When taking 10 % or more damage out of remaining health pool 
     * flash the screen red. RGBA value between 0-255.
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
     */
    private baseDurationMs: number = 2000;
    /**
     * The tween that animates the pulsing background color. Tween can be 
     * controlled with this reference and it also controls itself.
     */
    private bgColorTween: Phaser.Tweens.Tween;
    /**
     * Lazy singletonish access pattern for accessing
     * ScreenBackgroundColor. Could be maybe refactored away if
     * everything would be static or be made as a proper singleton.
     */
    public static instance: ScreenBackgroundColor;
    /** Background color at its whitest phase when bgColorTween is on. */
    private readonly bgColorBlack: string = '#070707';
    /** Background color at its whitest phase during briefWhiteFlash tween. */
    private readonly bgColorGray: string = '#151515';


    constructor() {
        super('ScreenBackgroundColor');
    }

    preload() {

    }

    /** Starts color changing effect. */
    create() {
        ScreenBackgroundColor.instance = this;
        this.startBreathingTween();
    }

    /** 
     * A background light effect that simulates changing very dim light
     * level and resembles breathing but is not very smooth and might annoy
     * users, placeholder? Important game elements have their own
     * backgrounds. Can be used to set the mood based on hp.
     * Goes to a yellowish tint. 
     * Might need restarting from time tot time.     
     * 
     * RGB 0-255
     * 
     */
    private startBreathingTween(): void {
        // Normal bg color of breathing.
        this.cameras.main.setBackgroundColor(this.bgColorBlack);
        this.bgColorTween = this.tweens.add({
            targets: this.cameras.main.backgroundColor,
            alpha: 0,
            red: this.redLevel,
            duration: this.baseDurationMs,
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                this.bgColorTween.timeScale = this.timeScale;
                this.bgColorTween.updateTo('red', this.redLevel);
            }
        });
    }

    /**
     * Get hit effect, when hit for 10 % of remaining hp or more.
     * Flashes screen background red. Can also be used as a fun screen
     * transition for major menus and such.
     */
    public redHitFlash(): void {
        this.bgColorTween?.destroy();
        this.cameras.main.setBackgroundColor(`rgba(${this.hitFlashRedLevel},11,9,1)`);

        this.tweens.add({
            targets: this.cameras.main.backgroundColor,
            alpha: 0,
            duration: 1000,
            onComplete: () => { this.startBreathingTween(); }
        });
    }

    /** Lightens the screen background for a bit. Currently used in screen transitions. */
    public briefWhiteFlash(): void {
        this.bgColorTween?.destroy();
        this.cameras.main.setBackgroundColor(this.bgColorGray);

        this.tweens.add({
            targets: this.cameras.main.backgroundColor,
            alpha: 0,
            duration: 1000,
            onComplete: () => { this.startBreathingTween(); }
        });
    }
}
