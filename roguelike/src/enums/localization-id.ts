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
    ButtonStartGame = "Start Game",
    ButtonRandomizeAll = "Randomize All",
    ButtonBackToMenu = "Back To Menu",
    // Ancestries
    Ancestry = "Ancestry",
    Human = "Human",
    // These descriptions are in info panel in character creation screen.
    HumanDesc = "Human description",
    Catfolk = "Catfolk",
    CatfolkDesc = "Catfolk description",
    HouseElf = "House-elf",
    HouseElfDesc = "House-elf description",
    Dwarf = "Dwarf",
    DwarfDesc = "Dwarf description",
    Gnome = "Gnome",
    GnomeDesc = "Gnome description",
    CharacterCreationTitle = "Character Creation",
    Name = "Name",
    Attributes = "Attributes",
    AttributesDesc = "Attributes description",
    AttributesXRemaining = "Attributes (5 remaining)",
    Stats = "Stats",
    // long description about stats
    InfoStats = "Info Stats",

}
