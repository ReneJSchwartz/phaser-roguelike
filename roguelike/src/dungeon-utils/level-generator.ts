/** 
 * Used to make ASCII roguelike levels that fit the game. 
 * For now this is largely a placeholder until more sophisticated
 * algorithms are written.
 * 
 * Levels consist of base/ground layer which doesn't change on it's own
 * and items and monsters and temporary environmental effects that are placed 
 * on top of that the base layer. For pathfinding, attacks, and movement checks
 * a combined map is made (which is what is visible for the player).
 * 
 * Monsters, player, items and temporary environmental effects are gameobjects 
 * which are not saved to 2D grid but they are rather a collection of 
 * gameobjects. This will save some memory. Enemies take 1 space and multiple
 * enemies can't be in the same space. Environmental effects are directly over
 * base layer and then comes enemies. 
 * 
 * This script makes the maps and enemy/item collections and sends them forward
 * to LevelRenderer.ts (TODO) and/or other systems to be processed.
 * 
 * Level coordinates begin from x0, y0 at bottom left corner to make
 * calculations simpler. 
 * */
export class LevelGenerator {

    /** Will generate a level based on seed and RNG. */
    public generateLevel(): string[][] {
        return this.spawnRoomTest();
    }

    /** Used to test the room spawning. */
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
}
