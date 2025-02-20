import { LevelGenerator } from "./dungeon-utils/level-generator";
import { Player } from "./entities/player";

/** 
 * Processes general game logic with the help of other classes.
 * */
export class GameManager {
    /** Level generator. */
    private levelGen: LevelGenerator;
    /** Seed the playthrough uses. */
    private gameSeed: number = Phaser.Math.RND.integer();
    // todo add couple random number generators for level generation
    // and other functionality like combat
    public static Instance: GameManager;

    /** Sets up singleton and sets up other game systems like Player. */
    constructor() {
        GameManager.Instance = this;
        new Player();
    }

    /** Starts game after making a character. */
    public startGame(): void {
        console.log('Game started on GameManager.');
        this.levelGen = new LevelGenerator();
        console.log('level:\n' + this.levelGen.generateLevel().join('\n'));
    }
}
