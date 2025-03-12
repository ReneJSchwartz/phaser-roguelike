import { Ancestries } from "./character-creation/ancestries";
import { Level } from "./dungeon-utils/level";
import { LevelGenerator } from "./dungeon-utils/level-generator";
import { Player } from "./entities/entities";
import { GameplayUi } from "./scenes/GameplayUi";
import { LevelRenderer } from "./scenes/LevelRenderer";

/** 
 * Processes general game logic with the help of other classes.
 * */
export class GameManager {
    /** Seed that the gameplay uses. */
    private gameSeed: number = Phaser.Math.RND.integer();
    /** Instance as access pattern for singletonish GameManager. */
    public static Instance: GameManager;

    /** Sets up singleton and sets up other game systems like Player. */
    constructor() {
        GameManager.Instance = this;
        new Player();
        new Ancestries();
        new LevelGenerator();
    }

    /** Starts game after making a character. */
    public startGame(): void {
        console.log('Game started on GameManager.');
        Level.currentFloor = -1;
        LevelGenerator.generate7drlDungeonRoom();
        LevelRenderer.Instance.spawnMapEntities();
    }

    /** 
     * When in dungeon the player can go up a level from a '^' char.
     * Placeholder: made for the 7-day roguelike challenge jam. 
     */
    public ascendFloor(): void {
        Level.currentFloor++;
        LevelGenerator.generate7drlDungeonRoom();
        LevelRenderer.Instance.spawnMapEntities();
        Level.baseLayerTexts.get(`${Player.Instance.y},${Player.Instance.x}`)?.setAlpha(0);
        GameplayUi.Instance.updateYouSeeText('');
    }

    /** 
     * Possible in areas accessible from world map.
     * Going out of bounds there brings player back to world map. 
     */
    public goOutsideArea(): void {
        // during jam going outside a dungeon area / town is not possible.
        // could check if level.WordMapLeavable is true
        GameplayUi.Instance.addMovementWarningToLog(`Can't go back to world map.`);
    }
}
