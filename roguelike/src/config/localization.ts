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
                    }
                }
            }
        });
    }
}