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
}
