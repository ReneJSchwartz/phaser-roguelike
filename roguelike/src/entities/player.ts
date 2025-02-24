import { Attributes } from "../character-creation/attributes";
import { AncestryType } from "../enums/ancestry-type";

/** 
 * The main player script that holds data about the player but PlayerController
 * will be a separate script. 
 * 
 * Stub until game logic has been designed & diagrammed.
 */
export class Player {
    /** Ancestry as a string presentation. */
    private ancestryName: string = 'Human';
    /** Ancestry as enum. */
    private ancestryType: AncestryType = AncestryType.Human;
    private name: string = 'John Doe';
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

    /** Sets player's ancestry. */
    public setAncestry(ancestryType: AncestryType, ancestryName: string): void {
        /* eslint-disable-next-line prefer-rest-params -- Don't think this rule applies here. */
        console.log(Player.name, this.setAncestry.name, ...arguments);
        
        this.ancestryName = ancestryName;
        this.ancestryType = ancestryType;
    }

    /** Sets max hitpoints for the player. Does not heal the player. */
    public setMaxHitPoints(amount: number): void {
        /* eslint-disable-next-line prefer-rest-params -- Don't think this rule applies here. */
        console.log(Player.name, this.setMaxHitPoints.name, ...arguments);

        this.maxHitPoints = amount;
    }

    /** Sets player's attributes. */
    public setAttributes(attributes: Attributes) {
        /* eslint-disable-next-line prefer-rest-params -- Don't think this rule applies here. */
        console.log(Player.name, this.setAttributes.name, ...arguments);

        this.attributes = attributes;
    }

    /** Sets player's name. */
    public setName(name: string) {
        /* eslint-disable-next-line prefer-rest-params -- Don't think this rule applies here. */
        console.log(Player.name, this.setName.name, ...arguments);

        this.name = name;
    }
}
