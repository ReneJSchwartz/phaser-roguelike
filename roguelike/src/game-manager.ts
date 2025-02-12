import { LevelGenerator } from "./dungeon-utils/level-generator";

/** 
 * Processes general game logic with the help of other classes.
 * */
export class GameManager {
    private levelGen: LevelGenerator;
    private gameSeed: number = Phaser.Math.RND.integer();
    // todo add couple random number generators for level generation
    // and other functionality like combat

    startGame(): void {
        console.log('Game started on GameManager.');
        this.levelGen = new LevelGenerator();
        console.log('level:\n' + this.levelGen.generateLevel().join('\n'));
    }
}
