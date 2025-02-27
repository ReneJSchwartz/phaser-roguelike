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
                        [LocalizationId.Human]:
                            "Human",
                        [LocalizationId.HumanDesc]:
                            `Humans are adaptive folk well spread across continents that have a medium lifespan but are fast learners. You learn Perks at a faster rate.\n
Humans in general don't have any apparent strengths or weaknesses but individuals can excel in various ways. They prosper because of their differences. What sets you apart?\n
There's no Attribute Point requirements to play a human.`,
                        [LocalizationId.Catfolk]:
                            "Catfolk",
                        [LocalizationId.CatfolkDesc]:
                            `Catfolk are nimble bipedal predators that speak funnily but scratch mightily. Some are more cat-like and others resemble tigers or panthers.\n
Catfolk have excellent senses and they have a bonus for avoiding hits. These great cats make good mages as well due to their connection with the nature.\n
To play as one put at least one attribute point to Dex and another to Dex or Str.`,
                        [LocalizationId.HouseElf]:
                            "House-elf",
                        [LocalizationId.HouseElfDesc]:
                            `House-elves have many names. They are small, helpful but stubborn and very magical folk. Once a day House-elves can turn invisible.\n
For clothes they prefer cool hats and rags or just relying on their hairy bodies.\n
To play as one put one point into Spi and another point into Spi/Dex/Kno.`,
                        [LocalizationId.Dwarf]:
                            "Dwarf",
                        [LocalizationId.DwarfDesc]:
                            `Dwarves are hardy mountain or hill-dwellers, skilled craftsmen and knowledgeable.\n
Dwarves have two poison resistance Perks as well as darkvision, they are proficient with battle axe/hammer and many kinds of crafting.\n
To play as one put one point into Con and another point into Con/Str/Spi/Kno.`,
                        [LocalizationId.Gnome]:
                            "Gnome",
                        [LocalizationId.GnomeDesc]:
                            `Gnomes are long-living small, curious, fun-loving and intelligent. They can be for example tinkerers, researchers or jewelers.\n
You have darkvision, some magic is less effective on you. You are proficient in adding affixes to items.\n
To play as one put one point into Kno and another point into Kno/Con/Dex.`,
                        [LocalizationId.Name]:
                            "Name",
                        [LocalizationId.ButtonStartGame]:
                            "Start Game",
                        [LocalizationId.ButtonRandomizeAll]:
                            "Randomize All",
                        [LocalizationId.ButtonBackToMenu]:
                            "Back To Menu",
                        [LocalizationId.Attributes]:
                            "Attributes",
                        [LocalizationId.AttributesDesc]:
                            `Attributes increase your effectiveness.\n
Strength adds damage to hits and helps you wear armor and carry items.\n
Dexterity helps you both land a hit and avoid hits.\n
Constitution increases your health and helps you regain it and protects you from some ill effects.\n
Spirit is your magical connection to the world. It aids you in spellcasting.\n
Knowledge measures your knowledge, expertise in techniques and your learning ability.`,
                        [LocalizationId.AttributesXRemaining]:
                            "Attributes ({numAttributes} remaining)",
                        [LocalizationId.Stats]:
                            "Stats",
                        [LocalizationId.InfoStats]:
                            `HP - Hit points.Your character will die.And running out of these will cause it.Constitution increases HP and its recharge rate and helps in Con saves.\n
MP - Mana points.Spells use 5 or 10 or 15 mana.Scrolls are single use and use no mana.After that you have a chance to learn the used scroll spell.Spirit increases MP and its recharge rate.\n
AC - Armor class.Enemies need to roll this on 20 sided die to hit you.Armor can then reduce the damage(min 1).`
                    }
                }
            }
        });
    }
}