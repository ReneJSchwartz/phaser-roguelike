import { AncestryType } from "../enums/ancestry-type";

/** 
 * Ancestry holds information about a particular ancestry such as Half-Orc.
 * Is used in char creation and later in-game. 
 */
export class Ancestry {
    /** Type of the ancestry which defines the ancestry.  */
    public type: AncestryType;
    /** Name of the ancestry. I.e. Half-elf. */
    public name: string;
    /** Description which can be shown in info box. */
    public description: string;
    /** Description which can be shown in-game. I.e. in character screen etc. */
    public ingameDescription: string;
    /** Perks that are affliated and granted with the ancestry. */
    public perks: string;

    /**
     * Creates an Ancestry.
     * 
     * @param name E.g. Human.
     * @param description Full description that appears in info box. 
     * @param type e.g. AncestryType.Dwarf.
     */
    constructor(name: string, description: string, type: AncestryType) {
        this.name = name;
        this.description = description;
        this.type = type;
    }
}