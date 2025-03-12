import { Game, Scene } from 'phaser';
import { GameManager } from '../game-manager';
import { GameObjects } from 'phaser';
import { Shaders } from '../shaders';

/** 
 * Shows adventure log and other UI elements when playing.
 */
export class GameplayUi extends Scene {
    /** Tells what's under the cursor. Located near the map. */
    private youSeeUnderCursorText: GameObjects.Text;
    /** Log text is a wrapping text box that shows only latest 6 or so lines. */
    private logText: GameObjects.Text;
    /** 
     * Log content as string. Helps in making sure the log text isn't too long 
     * as regular text wrap does not work as we'd like as it wraps showing 
     * the beginning and we want to show just the end part. 
     */
    private rawLog: string = '';
    /** How often movement warning can be shown in log. Prevents spamming. */
    private movementWarningDelayMs: number = 1000;
    /** If we're on log's movement Warning cooldown. If false warning can be shown. */
    private onMovementWarningCooldown: boolean = false;
    /** Instance as access pattern for singletonish GameplayUi. */
    public static Instance: GameplayUi;

    /** Creates class instance. */
    constructor() {
        super('GameplayUi');
        GameplayUi.Instance = this;
    }

    /** 
     * Create UI to be drawn over the screen
     * This is everything but the level/map.
     */
    create() {
        const { width, height } = this.scale;

        // const outlines: GameObjects.Text
        this.add.text(0, 0,
            `*---Character---*                *---Inventory---*
|               |                |               |
|               |                |               |
|               |                |               |
|               |                |               |
|               |                |               |
|               |                |               |
|               |                |               |
|               |                |               |
|               |                |               |
|               |                |               |
|               *----------------*---------------*
|               |                                |
|               |                                |
|               |                                |
|               |                                |
|               |                                |
|               |                                |
*---------------*--------------------------------*`, {
            color: '#aaaaaa', fontSize: 53
        })

        // Scanline shader is not to everyone's taste, if placed here the 
        // outlines are affected. If placed further the text placement is compromised.
        // const baseShader = new Phaser.Display.BaseShader('Scanlines', Shaders.fragScanlines);
        // this.add.shader(baseShader, 0, 0, width * 1, height * 1).setOrigin(0, 0);

        // Centered circle for placement help.
        // this.add.circle(width * 0.5, height * 0.55, 10, 0xffffff, 1)

        this.logText = this.add.text(width * 0.34, height * 0.64,
            `gets replaced by addLogText(string)`,
            { fontSize: 42, color: '#eeeeee', wordWrap: { width: 1050 } })
            .setMaxLines(7);

        // Empty at first since nothing is selected.
        this.youSeeUnderCursorText = this.add.text(width * 0.5, height * 0.03, '', {
            fontSize: 36, color: '#ffffff', align: 'center'
        })
            .setOrigin(0.5);

        this.addToLogText("You have arrived at your trial. Those who reach the top will become as light as upper plane beings. Wonder if that's true.")
    }

    /** 
     * Updates description text that is shown when user hovers over a symbol.
     * 
     * @param text Text to show. I.e. 'Rick Astley' when hovering over R.
     */
    public updateYouSeeText(text: string): void {
        this.youSeeUnderCursorText.text = text;
        if (text.length === 0) {
            this.youSeeUnderCursorText.text = '';
        }
    }

    /** 
     * Adds a line to the log and displays the latest log messages 
     * that fill the log area. 
     * 
     * @param textToAdd What text to add to log? Space is inserted automatically.
     * */
    public addToLogText(textToAdd: string): void {
        this.rawLog += textToAdd + ' ';
        let latestEntries = this.rawLog.substring(this.rawLog.length - 275);
        if (latestEntries[0] == latestEntries[0].toLowerCase()) {
            latestEntries = latestEntries.substring(latestEntries.indexOf('.') + 2);
        }
        this.logText.text = latestEntries;
    }

    /** 
     * Prevents movement warning spam in log. 
     * 
     * @param warning Text to show if not on warning cooldown.  
     */
    public addMovementWarningToLog(warning: string): void {
        if (this.onMovementWarningCooldown) {
            return;
        }
        this.onMovementWarningCooldown = true;
        this.time.delayedCall(this.movementWarningDelayMs, () => this.onMovementWarningCooldown = false);
        this.addToLogText(warning);
    }
}