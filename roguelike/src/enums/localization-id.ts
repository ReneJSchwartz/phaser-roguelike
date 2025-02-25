/** 
 * Localization IDs to be used with i18next localization plugin.
 * These are keys that will fetch a value with certain language.
 * Made as string enum to have compact and changeable way to 
 * use translations. Changing enum order or deleting them 
 * is possible.
 */
export enum LocalizationId {
    // In Preloader screen
    LoadingPrefix = "Loading",
    // In Press Any Key screen
    PressAnyKey = "Press any key",
    // In main Menu
    GameTitle = "Game Title",
    ButtonNewGame = "New Game",
    ButtonQuitGame = "Quit Game",
    // In Character Creation screen
    CharacterCreationTitle = "Character Creation",
    Ancestry = "Ancestry",
    Stats = "Stats",
    InfoStats = "Info Stats"
}
