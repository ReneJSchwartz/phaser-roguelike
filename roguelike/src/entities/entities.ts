// Contains Entity base class, Player and Foe in same module/file
// to avoid error (Cannot access 'Entity' before initialization).

import { GameObjects } from "phaser";
import { LevelRenderer } from "../scenes/LevelRenderer";
import { Level } from "../dungeon-utils/level";

/** Base class for player and enemies. */
export abstract class Entity {
    /** 
     * Maximum hit points. 
     * Increases by 5 for every con for the player.
     */
    public maxHitPoints: number = 25;
    /** 
     * Current hit points. 
     * Regenerates on their own on player.
     */
    public currentHitPoints: number = this.maxHitPoints;

    // Representation in the field.
    /** This moves in the level and represents the character, @. */
    public charText: GameObjects.Text;
    /** Position on level grid. */
    // public positionXY: number[] = [];
    /** Current horizontal tile. */
    public x: number;
    /** Current vertical tile. */
    public y: number;
    public oldX: number;
    public oldY: number;
    public character: string = '@';

    constructor(x: number, y: number) {
        this.x = x, this.y = y;
    }

    /** 
     * When a player attacks a monster or monster attacks a player
     * decrease some hit points based on weapon and die if they reach 0. 
     */
    public takeDamage(amount: number): void {
        this.currentHitPoints -= amount;
        if (this.currentHitPoints <= 0) {
            this.charText?.setAlpha(0);
            LevelRenderer.Instance.entityLeaveTile(this.x, this.y);
            const deleted = Level.dungeonMonsters.delete(`${this.x},${this.y}`);
            if (!deleted) {
                console.log('did not delete monster');
            }
        }
    }

    /** Sets ASCII's position position. */
    public setPosition(x: number, y: number, alsoSetLocation: boolean = true): void {
        this.x = x;
        this.y = y;
        if (alsoSetLocation) {
            /** Setting location. */
            // console.log('also setting location of text');
            this.charText.setPosition(LevelRenderer.Instance.gridX(this.x), LevelRenderer.Instance.gridY(this.y))
            Level.baseLayerTexts.get(`${this.oldY},${this.oldX}`)?.setAlpha(1);
            Level.baseLayerTexts.get(`${this.y},${this.x}`)?.setAlpha(0);
        }
    }
}

import { Attributes } from "../character-creation/attributes";
import { AncestryType } from "../enums/ancestry-type";
import { GameplayUi } from "../scenes/GameplayUi";
import { GameManager } from "../game-manager";

/** 
 * The main player script that holds data about the player and 
 * commands related to the player (movement, attacks...).
 */
export class Player extends Entity {
    // Outcomes of character creation + HP, MP
    /** Ancestry as a string presentation. */
    private ancestryName: string = 'Human';
    /** Ancestry as enum. */
    private ancestryType: AncestryType = AncestryType.Human;
    /** Name of the player. */
    private name: string = 'John Doe';
    /** Attributes/stat points are between 0 and 3 (Avg/Good/Great/Divine). */
    private attributes: Attributes;
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

    /** Sets up the Instance. */
    constructor() {
        super(42, 42);
        Player.Instance = this;
    }

    // Movement
    /** 
     * Moves player right if possible or attacks what is there. 
     * Called from Game scene's input handling. 
     */
    public moveRight(): void {
        // if not on grid do nothing
        if (this.x >= Level.levelHeight) {
            GameManager.Instance.goOutsideArea();
        }
        else if (Level.isUpstairsAt(this.x + 1, this.y)) {
            // proceed to next level
            this.oldX = this.x;
            this.oldY = this.y;
            this.setPosition(++this.x, this.y);
            GameManager.Instance.ascendFloor()
        }
        // see whats on right
        else if (Level.isUntravellableAt(this.x + 1, this.y)) {
            // not ok to move
            GameplayUi.Instance.addMovementWarningToLog(`Bump.`);
        }
        else if (Level.isMonsterAt(this.x + 1, this.y)) {
            // not ok to move, attack monster instead
            this.attackMonster(this.x + 1, this.y);
        }
        else {
            // ok to move
            this.oldX = this.x;
            this.oldY = this.y;
            this.setPosition(++this.x, this.y);
        }
    }

    /** Moves player left if possible or attacks what is there. */
    public moveLeft(): void {
        if (this.x <= 0) {
            GameManager.Instance.goOutsideArea();
        }
        else if (Level.isUpstairsAt(this.x - 1, this.y)) {
            this.oldX = this.x;
            this.oldY = this.y;
            this.setPosition(--this.x, this.y);
            GameManager.Instance.ascendFloor()
        }
        else if (Level.isUntravellableAt(this.x - 1, this.y)) {
            GameplayUi.Instance.addMovementWarningToLog(`Bump.`);
        }
        else if (Level.isMonsterAt(this.x - 1, this.y)) {
            this.attackMonster(this.x - 1, this.y);
        }
        else {
            this.oldX = this.x;
            this.oldY = this.y;
            this.setPosition(--this.x, this.y);
        }
    }

    /** Moves player upwards if possible or attacks what is there. */
    public moveUp(): void {
        if (this.y <= 0) {
            GameManager.Instance.goOutsideArea();
        }
        else if (Level.isUpstairsAt(this.x, this.y - 1)) {
            this.oldX = this.x;
            this.oldY = this.y;
            this.setPosition(this.x, --this.y);
            GameManager.Instance.ascendFloor()
        }
        else if (Level.isUntravellableAt(this.x, this.y - 1)) {
            GameplayUi.Instance.addMovementWarningToLog(`Bump.`);
        }
        else if (Level.isMonsterAt(this.x, this.y - 1)) {
            this.attackMonster(this.x, this.y - 1);
        }
        else {
            this.oldX = this.x;
            this.oldY = this.y;
            this.setPosition(this.x, --this.y);
        }
    }

    /** Moves player downwards if possible or attacks what is there. */
    public moveDown(): void {
        if (this.y >= Level.levelHeight) {
            GameManager.Instance.goOutsideArea();
        }
        else if (Level.isUpstairsAt(this.x, this.y + 1)) {
            this.oldX = this.x;
            this.oldY = this.y;
            this.setPosition(this.x, ++this.y);
            GameManager.Instance.ascendFloor()
        }
        else if (Level.isUntravellableAt(this.x, this.y + 1)) {
            GameplayUi.Instance.addMovementWarningToLog(`Bump.`);
        }
        else if (Level.isMonsterAt(this.x, this.y + 1)) {
            this.attackMonster(this.x, this.y + 1);
        }
        else {
            this.oldX = this.x;
            this.oldY = this.y;
            this.setPosition(this.x, ++this.y);
        }
    }

    // Attacking
    /**
     * Attacks a monster at location.
     * 
     * @param x Horizontal tile.
     * @param y Vertical tile.
     */
    private attackMonster(x: number, y: number) {
        const monster = Level.dungeonMonsters.get(`${x},${y}`);
        // console.log(monster?.currentHitPoints);
        monster!.takeDamage(5);
    }

    // Character creation
    /** 
     * Sets player's ancestry and ancestry name.
     * 
     * @param ancestryType Type of player's ancestry.
     * @param ancestryName Name of player's ancestry. 
     */
    public setAncestry(ancestryType: AncestryType, ancestryName: string): void {
        /* eslint-disable-next-line prefer-rest-params -- Don't think this rule applies here. */
        console.log(Player.name, this.setAncestry.name, ...arguments);

        this.ancestryName = ancestryName;
        this.ancestryType = ancestryType;
    }

    /** 
     * Sets or rather initializes max hitpoints for the player.
     * Does not heal the player.
     * 
     * @param amount Max hit points to set. I.e. 35.
     */
    public setMaxHitPoints(amount: number): void {
        /* eslint-disable-next-line prefer-rest-params -- Don't think this rule applies here. */
        console.log(Player.name, this.setMaxHitPoints.name, ...arguments);

        this.maxHitPoints = amount;
    }

    /** 
     * Sets player's attributes.
     *
     * @param attributes Attributes to assign to player. 
     */
    public setAttributes(attributes: Attributes) {
        /* eslint-disable-next-line prefer-rest-params -- Don't think this rule applies here. */
        console.log(Player.name, this.setAttributes.name, ...arguments);

        this.attributes = attributes;
    }

    /** 
     * Sets player's name.
     * 
     * @param name Name to give to player.
     */
    public setName(name: string) {
        /* eslint-disable-next-line prefer-rest-params -- Don't think this rule applies here. */
        console.log(Player.name, this.setName.name, ...arguments);

        this.name = name;
    }
}

/** Enemy class. Enemies share some functionality with the player. */
export class Foe extends Entity {
    /** 
     * When foes are created their position can also be saved. Position can 
     * also be saved at a later time (which is how the sausage is made atm).
     */
    constructor(x: number, y: number) {
        super(x, y);
    }
}