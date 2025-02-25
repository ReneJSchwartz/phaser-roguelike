import { AncestryType } from "../enums/ancestry-type";

/** 
 * Ancestry holds information about a particular ancestry such as Half-Orc.
 * Is used in char creation and later in-game. 
 */
export class Ancestry {
    public type: AncestryType;
    public name: string;
    public description: string;
    public ingameDescription: string;
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