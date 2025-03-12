/**
 * Duplicated in player due to TS error @see Player. 
 * Could be refactored to interface & utility functions.
 * Make sure the code is the same on both.
 */

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
            if (deleted) {
                console.log('monster deleted at : ' + `${this.x},${this.y}`)
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