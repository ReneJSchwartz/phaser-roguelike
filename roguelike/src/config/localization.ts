import i18next from "i18next";
import ICU from "i18next-icu";
import { LocalizationId } from "../enums/localization-id";

/** 
 * Used to set localization keys and values. Used localization library 
 * is i18next. Get a localization by providing a {@see LocalizationId} 
 * like this: i18next.t(LocalizationId.GameTitle).
 */
export class Localization {
    /** Inits the localization plugin with translations. */
    constructor() {
        i18next.use(ICU).init({
            lng: "en",
            fallbackLng: "en",
            resources: {
                en: {
                    translation: {
                        [LocalizationId.LoadingPrefix]:
                            "Loading  ",
                        [LocalizationId.PressAnyKey]:
                            "Press Any Key To Continue",
                        [LocalizationId.GameTitle]:
                            "Rrogue",
                        [LocalizationId.ButtonNewGame]:
                            "New Game",
                        [LocalizationId.ButtonQuitGame]:
                            "Quit Game",
                        [LocalizationId.CharacterCreationTitle]:
                            "Character Creation",
                        [LocalizationId.Ancestry]:
                            "Ancestry",
                        [LocalizationId.Stats]:
                            "Stats",
                        [LocalizationId.InfoStats]:
                            `HP - Hit points. Your character will die. And running out of these will cause it. Constitution increases HP and its recharge rate and helps in Con saves.\n
MP - Mana points. Spells use 5 or 10 or 15 mana. Scrolls are single use and use no mana. After that you have a chance to learn the used scroll spell. Spirit increases MP and its recharge rate.\n
AC - Armor class. Enemies need to roll this on 20 sided die to hit you. Armor can then reduce the damage (min 1).`
                    }
                }
            }
        });
    }
}