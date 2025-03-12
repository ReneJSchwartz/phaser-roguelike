import { GameObjects } from "phaser";
import { Entity } from "../entities/entity";

/** Map as in Level. Stores info about what's on the map. */
export class Level {
    /** Consists of walls, floors, stairs and persistent decorations. */
    public static dungeonBaseLayer: string[];
    /** 
     * Used to access floor tiles so they can be hidden when something is 
     * over them. And vice versa. 
     */
    public static baseLayerTexts: Map<string, GameObjects.Text> = new Map<string, GameObjects.Text>();
    /** Stores which items are on the floor. */
    public static dungeonItems: Map<string, Entity> = new Map<string, Entity>();
    /** Stores where monsters are. */
    public static dungeonMonsters: Map<string, Entity> = new Map<string, Entity>();
    /** This is what is shown in the screen console style. */
    public dungeonPresentationLayer: string[] = [];
    /** Zero-indexed (9 = 10). How many tiles wide. */
    public static readonly levelWidth: number = 9;
    /** Zero-indexed (9 = 10). How many tiles tall. */
    public static readonly levelHeight: number = 9;
    /** Current floor of a dungeon. */
    public static currentFloor: number = -1;

    constructor() {

    }

    /** Destroys visible characters from hash maps so new ones can be spawned. */
    public static destroyItemsMonstersAndBaseLayerTexts(): void {
        this.baseLayerTexts.forEach(element => {
            element.destroy();
        });
        this.baseLayerTexts.clear();

        this.dungeonItems.forEach(element => {
            element.charText.destroy();
        });
        this.dungeonItems.clear();

        this.dungeonMonsters.forEach(element => {
            element.charText?.destroy();
        });
        this.dungeonMonsters = new Map<string, Entity>();
    }

    public static isUpstairsAt(x: number, y: number): boolean {
        return Level.dungeonBaseLayer[y][x] === '^';
    }

    /** Tile contains monster? */
    public static isMonsterAt(x: number, y: number): boolean {
        return this.dungeonMonsters.has(`${x},${y}`);
    }

    /** 
     * Tile contains wall or other untravellable? 
     * Does not include monsters as that's a separate check. 
     */
    public static isUntravellableAt(x: number, y: number): boolean {
        return "#ȹ⚶=".includes(Level.dungeonBaseLayer[y][x]);
    }

    private static getCharAt(x: number, y: number): string {
        if (Level.dungeonMonsters.get(x + ',' + y)) {
            console.log('monster at tile');
            return Level.dungeonMonsters.get(x + ',' + y)?.character ?? '?';
        }

        return "#";
    }
}