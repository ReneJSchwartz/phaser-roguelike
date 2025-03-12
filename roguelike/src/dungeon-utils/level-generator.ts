import { FoeSetup } from "../entities/foe-setup";
import { Player } from "../entities/entities";
import { GameplayUi } from "../scenes/GameplayUi";
import { Level } from "./level";
import { LevelRenderer } from "./level-renderer";

/** 
 * Used to make ASCII roguelike levels that fit the game. 
 * For now this is largely a placeholder until more sophisticated
 * algorithms are written and designed.
 * 
 * Levels consist of base/ground layer which doesn't change on it's own
 * and items and monsters and temporary environmental effects that are placed 
 * on top of that the base layer. For pathfinding, attacks, and movement checks
 * a combined map can be made (which is what is visible for the player).
 * 
 * Monsters, player, items and temporary environmental effects are gameobjects 
 * which are not saved to 2D grid but they are rather a collection of 
 * gameobjects in hash map. Enemies take 1 space and multiple
 * enemies can't be in the same space. Environmental effects are directly over
 * base layer and then comes items and then enemies. 
 * 
 * This script makes the maps and enemy/item collections and sends them forward
 * to @see LevelRenderer and/or other systems to be processed.
 * 
 * Level coordinates begin from x0, y0 at top left corner. Coordinante is 
 * accessed by searching levelbase[y][x] (string array), or by querying maps
 * with key x,y.
 * */
export class LevelGenerator {
    /** 
     * Placeholder.
     * Will generate a level based on seed and RNG.
     */
    public generateLevel(): string[][] {
        return this.spawnRoomTest();
    }

    /** Placeholder. Used to test the room spawning. */
    private spawnRoomTest(): string[][] {
        const retVal: string[][] = [[]];
        retVal[0] = "#######".split('');
        retVal.push("#B....#".split(''));
        retVal.push("#...###".split(''));
        retVal.push("#.....#".split(''));
        retVal.push("###A..#".split(''));
        retVal.push("#######".split(''));
        return retVal;
    }

    /** 
     * Makes a new room on the only dungeon in 7-day roguelike jam. 
     * The room shape is pre-generated.
     */
    public static generate7drlDungeonRoom(): string[] {
        LevelGenerator.levelCleanup();

        const floor = Level.currentFloor;

        const room: string[] = [];
        let playerSpawnX: number = 0;
        let playerSpawnY: number = 0;
        const stairSpawnPositionsXY: number[][] = [[8, 2], [2, 1], [1, 7], [7, 8]]
        if (floor === -1) {
            // Yard leading up to the tower.
            // In smaller scale.
            room.push("..........");
            room.push("...####.⚶.");
            room.push("..######..");
            room.push("..######..");
            room.push("..⚘#^=#⚘..");
            room.push("....::....");
            room.push("..ȹ.::.ȹ..");
            room.push("....::....");
            room.push("..ȹ.::.ȹ.#");
            room.push("....::....");

            playerSpawnX = 5;
            playerSpawnY = 8;
        }
        else if (floor === 0) {
            room.push("  ######  ");
            room.push(" #......# ");
            room.push("#.......^#");
            room.push("#........#");
            room.push("#........#");
            room.push("#........#");
            room.push("#........#");
            room.push("#........#");
            room.push("⚘#......#⚘");
            room.push(" ⚘##==##⚘ ");

            playerSpawnX = 4;
            playerSpawnY = 8;

            GameplayUi.Instance.addToLogText('The doors slam shut.')
        }
        else if (floor > 0) {
            room.push("  ######  ");
            room.push(" #......# ");
            room.push("#........#");
            room.push("#........#");
            room.push("#........#");
            room.push("#........#");
            room.push("#........#");
            room.push("#........#");
            room.push(" #......# ");
            room.push("  ######  ");
            // Insert rotating stairs upwards
            let stairRow = room[stairSpawnPositionsXY[floor % 4][1]];
            stairRow = stairRow.slice(0, stairSpawnPositionsXY[floor % 4][0])
                + '^' + stairRow.slice(stairSpawnPositionsXY[floor % 4][0] + 1);
            room[stairSpawnPositionsXY[floor % 4][1]] = stairRow;

            playerSpawnX = Player.Instance.x;
            playerSpawnY = Player.Instance.y;
        }
        Player.Instance.setPosition(playerSpawnX, playerSpawnY, false);

        // generate monsters
        for (let y = 0; y < room.length; y++) {
            for (let x = 0; x < room[y].length; x++) {
                // don't spawn monster to player's starting tile
                if (y === playerSpawnY && x === playerSpawnX) {
                    continue;
                }

                if (room[y][x] === '.' && Phaser.Math.Between(1, 100) <= 5) {
                    let foe = FoeSetup.generateFoe();
                    foe.x = x;
                    foe.y = y;
                    Level.dungeonMonsters.set(`${x},${y}`, foe);
                }
            }
        }

        Level.dungeonBaseLayer = room;

        return room;
    }

    /** Needs to be done to flush the level and monsters before making new ones. */
    private static levelCleanup(): void {
        Level.destroyItemsMonstersAndBaseLayerTexts();
        Player.Instance.charText?.destroy();
    }
}
