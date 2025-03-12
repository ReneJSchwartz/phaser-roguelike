import { Foe } from "./foe";

/** Contains different foes and helper functions. */
export abstract class Foes {

    public static generateFoe(): Foe {
        const foe = new Foe(0, 0);
        // Possible enemies: Wurm, imp, troll, centipede, hobgoblin
        foe.character = 'WiTCh'.charAt(Phaser.Math.Between(0, 'WiTCh'.length - 1));
        switch (foe.character) {
            // Wurm
            case 'W':
                console.log("Randomized a Wurm foe.");
                foe.maxHitPoints = foe.currentHitPoints = Phaser.Math.Between(15, 25);
                return foe;
            // Imp
            case 'i':
                console.log("Randomized an imp foe.");
                foe.maxHitPoints = foe.currentHitPoints = Phaser.Math.Between(6, 12);
                return foe;
            // Troll
            case 'T':
                console.log("Randomized a Troll foe.");
                foe.maxHitPoints = foe.currentHitPoints = Phaser.Math.Between(15, 25);
                return foe;
            // Centipede
            case 'C':
                console.log("Randomized a Centipede foe.");
                foe.maxHitPoints = foe.currentHitPoints = Phaser.Math.Between(15, 20);
                return foe;
            // Hobgoblin
            case 'h':
                console.log("Randomized a hobgoblin foe.");
                foe.maxHitPoints = foe.currentHitPoints = Phaser.Math.Between(8, 12);
                return foe;
            default:
                console.error('Error. Randomized a missing foe!');
                break;
        }
        return foe;
    }

}