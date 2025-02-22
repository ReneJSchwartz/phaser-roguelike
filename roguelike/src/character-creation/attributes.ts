import { AncestryType } from "../enums/ancestry-type";
import { Attribute } from "../enums/attribute";

/** 
 * Attributes holds how much of each attribute a creature has.
 * Documentation about attributes can be found in GDD.
 */
export class Attributes {
    public strength: number = 0;
    public dexterity: number = 0;
    public constitution: number = 0;
    public spirit: number = 0;
    public knowledge: number = 0;

    constructor() {

    }

    /** Helper function to save array of numbers as attributes. */
    public saveIntArrayAsAttributes(attributes: number[]): void {
        this.strength = attributes[0];
        this.dexterity = attributes[1];
        this.constitution = attributes[2];
        this.spirit = attributes[3];
        this.knowledge = attributes[4];
    }

    /** 
     * Helper function to save certain attribute amount.
     * 
     * @param attribute What attribute to raise/lower.
     * @param amount Target amount.
     */
    public setAttribute(attribute: Attribute, amount: number): void {
        switch (attribute) {
            case Attribute.Strength:
                this.strength = amount;
                break;
            case Attribute.Dexterity:
                this.dexterity = amount;
                break;
            case Attribute.Constitution:
                this.constitution = amount;
                break;
            case Attribute.Spirit:
                this.spirit = amount;
                break;
            case Attribute.Knowledge:
                this.knowledge = amount;
                break;
            default:
                break;
        }
    }

    /** 
     * Tells whether the stats are sufficient for ancestry.
     * For example catfolk needs 1 con and 1 con/str.
     * 
     * @param ancestry Player's ancestry.
     * @param attributes These are compared to ancestry requirements.
     * @returns Whether the character is legal to play; fullfills reqs.
     */
    public static isValidAttributesForAncestry(ancestry: AncestryType, attributes: Attributes): boolean {
        if (attributes.strength + attributes.dexterity
            + attributes.constitution + attributes.spirit
            + attributes.knowledge < 5) {
            return false;
        }

        switch (ancestry) {
            case AncestryType.Catfolk:
                return attributes.dexterity > 0
                    && attributes.strength + attributes.dexterity >= 2;
            case AncestryType.Dwarf:
                return attributes.constitution > 0
                    && attributes.constitution + attributes.strength
                    + attributes.spirit + attributes.knowledge >= 2;
            case AncestryType.Gnome:
                return attributes.knowledge > 0
                    && attributes.knowledge + attributes.constitution
                    + attributes.dexterity >= 2;
            case AncestryType.HouseElf:
                return attributes.spirit > 0
                    && attributes.spirit + attributes.knowledge
                    + attributes.knowledge >= 2;
            case AncestryType.Human:
                return attributes.strength + attributes.dexterity +
                    attributes.constitution + attributes.spirit
                    + attributes.knowledge === 5;
            default:
                return false;
        }
    }
}
