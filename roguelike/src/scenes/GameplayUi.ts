import { Game, Scene } from 'phaser';
import { GameManager } from '../game-manager';
import { GameObjects } from 'phaser';
import { Shaders } from '../shaders';

/** 
 * Shows adventure log and other UI elements when playing.
 */
export class GameplayUi extends Scene {
    /** Tells what's under the cursor. */
    private youSeeText: GameObjects.Text;
    /** Log text is wrapping text that shows only latest 6 lines. */
    private logText: GameObjects.Text;
    private rawLog: string = '';
    public static Instance: GameplayUi;
    private movementWarningDelayMs: number = 1000;
    private onMovementWarningCooldown: boolean = false;

    constructor() {
        super('GameplayUi');
        GameplayUi.Instance = this;
    }

    /** Create UI. */
    create() {
        const { width, height } = this.scale;

        const outlines: GameObjects.Text = this.add.text(0, 0,
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

        // const baseShader = new Phaser.Display.BaseShader('Scanlines', Shaders.fragScanlines);
        // this.add.shader(baseShader, 0, 0, width * 1, height * 1).setOrigin(0, 0);

        // Centered circle for placement help
        // this.add.circle(width * 0.5, height * 0.55, 10, 0xffffff, 1)

        this.logText = this.add.text(width * 0.34, height * 0.64,
            `gets replaced by addLogText(string)`,
            { fontSize: 42, color: '#eeeeee', wordWrap: { width: 1050 } })
            .setMaxLines(7);

        // Empty at first since nothing is selected.
        this.youSeeText = this.add.text(width * 0.5, height * 0.03, '', {
            fontSize: 36, color: '#ffffff', align: 'center'
        })
            .setOrigin(0.5);

        this.addToLogText("You have arrived at your trial. Those who reach the top will become as light as upper plane beings. Wonder if that's true.")
    }

    /** Updates description text that is shown when user hovers a symbol. */
    public updateYouSeeText(text: string): void {
        this.youSeeText.text = text;
        if (text.length === 0) {
            this.youSeeText.text = '';
        }
    }

    /** Adds a line to the log and displays the latest log messages that fill the screen. */
    public addToLogText(textToAdd: string): void {
        this.rawLog += textToAdd + ' ';
        let latestEntries = this.rawLog.substring(this.rawLog.length - 275);
        if (latestEntries[0] == latestEntries[0].toLowerCase()) {
            latestEntries = latestEntries.substring(latestEntries.indexOf('.') + 2);
        }
        this.logText.text = latestEntries;
    }

    /** Prevents warning spam. */
    public addMovementWarningToLog(warning: string): void {
        if (this.onMovementWarningCooldown) {
            return;
        }
        this.onMovementWarningCooldown = true;
        this.time.delayedCall(this.movementWarningDelayMs, () => this.onMovementWarningCooldown = false);
        this.addToLogText(warning);
    }
}