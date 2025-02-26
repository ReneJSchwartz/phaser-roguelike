import i18next from "i18next";
import { AncestryType } from "../enums/ancestry-type";
import { Ancestry } from "./ancestry";
import { LocalizationId } from "../enums/localization-id";

/** Contains data about available ancestries for character creation. */
export class Ancestries {
    /** Humans learn faster. */
    public static human: Ancestry;
    /** 
     * Catfolk gain 2 AC and they also have Perks Nine Lives and Darkvision,
     * Keen Senses etc.
     */
    public static catfolk: Ancestry;
    /** House elves can turn invisible. */
    public static houseElf: Ancestry;
    /** Dwarves gain 5 extra hp and poison resistances. */
    public static dwarf: Ancestry;
    /** Gnomes gain bonuses to some crafting. */
    public static gnome: Ancestry;
    /** Can be used to pick a random ancestry. */
    public static random: Ancestry = new Ancestry('Random', '', AncestryType.Random);

    constructor() {
        Ancestries.human = new Ancestry(
            i18next.t(LocalizationId.Human),
            i18next.t(LocalizationId.HumanDesc),
            AncestryType.Human);

        Ancestries.catfolk = new Ancestry(
            i18next.t(LocalizationId.Catfolk),
            i18next.t(LocalizationId.CatfolkDesc),
            AncestryType.Catfolk);

        Ancestries.houseElf = new Ancestry(
            i18next.t(LocalizationId.HouseElf),
            i18next.t(LocalizationId.HouseElfDesc),
            AncestryType.HouseElf);

        Ancestries.dwarf = new Ancestry(
            i18next.t(LocalizationId.Dwarf),
            i18next.t(LocalizationId.DwarfDesc),
            AncestryType.Dwarf);

        Ancestries.gnome = new Ancestry(
            i18next.t(LocalizationId.Gnome),
            i18next.t(LocalizationId.GnomeDesc),
            AncestryType.Gnome);
    }
}
