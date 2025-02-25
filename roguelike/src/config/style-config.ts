/** Stores colors & layout configuration numbers or text or other styles. */
export abstract class StyleConfig {
    // Scene based styles
    // Preloader (has a loading bar)

    // Press Any Key
    /** The prompt at the bottom at the screen that says to press any key. */
    public static pressAnyKeyPromptStyle: Phaser.Types.GameObjects.Text.TextStyle = {
        fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        stroke: '#000000', strokeThickness: 8, align: 'center'
    };

    // Main Menu
    /** Style for Main Menu's game title. */
    public static gameTitleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
        fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
        stroke: '#000000', strokeThickness: 2, align: 'center'
    };

    /** Game version shows a text such as Rrogue v0.0.2 */
    public static gameVersionStyle: Phaser.Types.GameObjects.Text.TextStyle = {
        fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
        stroke: '#000000', strokeThickness: 6, align: 'center'
    };

    // Character Creation
    /** For the title at the top of the Character Creation screen. */
    public static characterCreationTitleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
        fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        stroke: '#000000', strokeThickness: 6, align: 'center'
    };

    // Color Palette
    // Colors can come in 3 strengths. The main color is the light one since 
    // our background is so dark. The dark variation can be used for 
    // disable buttons and the bright one if we're trying to guide 
    // players attention to somewhere.
    // Turns out colours don't work very well on this style of game
    // that also tries to poorly emulate a old terminal and/or simplistic 
    // shape drawing library.

    private static lightBlue: string = '#4b70f5';
    private static attentionBlue: string = '#3dc2ec';
    private static darkBLue: string = '#4A358DFF';

    // General UI styles

    /** 
     * Color of buttons that are clickable. Might need to change these
     * to TextStyles for additional effects. 
     */
    public static buttonColorEnabled: string = '#ffffff';
    /** Color of buttons that are not clickable. */
    public static buttonColorDisabled: string = '#999';
    /** Used for buttons we want the user to notice and click. */
    public static buttonColorEnabledAndGrabAttention: string = '#ffffff';

    public static buttonShadowEnabled: Phaser.Types.GameObjects.Text.TextShadow = {
        offsetX: 1, offsetY: 1,
        color: StyleConfig.lightBlue,
        stroke: true
    };

    public static buttonShadowDisabled: Phaser.Types.GameObjects.Text.TextShadow = {
        stroke: false, fill: false
    };

    public static buttonShadowEnabledAndGrabAttention: Phaser.Types.GameObjects.Text.TextShadow = {
        offsetX: 1, offsetY: 1,
        color: StyleConfig.lightBlue,
        stroke: true, fill: true
    };
}