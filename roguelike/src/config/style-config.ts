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
        fontFamily: 'Arial Black', fontSize: 44, color: '#ffffff',
        stroke: '#000000', strokeThickness: 6, align: 'center'
    };

    // Character Creation
    /** For the title at the top of the Character Creation screen. */
    public static characterCreationTitleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
        fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        stroke: '#000000', strokeThickness: 6, align: 'center'
    };

    // General UI styles

    /** 
     * Color of buttons that are clickable. Might need to change these
     * to TextStyles for additional effects.
     */
    public static buttonColorEnabled: string = '#fff';
    /** Color of buttons that are not clickable. */
    public static buttonColorDisabled: string = '#666';
}