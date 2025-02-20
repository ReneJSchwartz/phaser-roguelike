import { Attributes } from "../character-creation/attributes";

/** Holds data about the player */
export class Player {
    /** Ancestry as a string. */
    private ancestry: string = 'Human';
    /** Attributes/stat points are between 0 and 3 (Avg/Good/Great/Divine). */
    private attributes: Attributes;
    /** Maximum hit points. Increases by 5 for every con. */
    private maxHitPoints: number = 25;
    /** Current hit points of the player. Regenerates on their own. */
    private currentHitPoints: number = this.maxHitPoints;
    /** Maximum mana. */
    private maxMana: number = 5;
    /** Current mana of the player. Regenerates on their own. */
    private currentMana: number = this.maxMana;
    /** 
     * Access pattern. Monsters and game systems might be interested in
     * Player and lots of CPU time saving guard clauses can be made for 
     * example in regards to distance to player entity. 
     */
    public static Instance: Player;

    /** Sets up the singleton. */
    constructor() {
        Player.Instance = this;
    }

    /** Sets player's ancestry as a string to save some memory. */
    public setAncestry(ancestry: string): void {
        console.log(Player.name, this.setAncestry.name, arguments[0]);
        this.ancestry = ancestry;
    }

    /** Sets max hitpoints for the player. */
    public setMaxHitPoints(amount: number): void {
        console.log(Player.name, this.setMaxHitPoints.name, arguments[0]);
        this.maxHitPoints = amount;
    }

    /** Sets player's attributes. */
    public setAttributes(attributes: Attributes) {
        console.log(Player.name, this.setAttributes.name, arguments[0]);
        this.attributes = attributes;
    }

}
