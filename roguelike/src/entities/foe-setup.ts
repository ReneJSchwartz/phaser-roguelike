import { Foe } from "./entities";

/** Contains different foes and helper functions. */
export abstract class FoeSetup {

    public static generateFoe(): Foe {
        const foe = new Foe(0, 0);
        // Possible enemies: Wurm, imp, Troll, Centipede, hobgoblin
        foe.character = 'WiTCh'.charAt(Phaser.Math.Between(0, 'WiTCh'.length - 1));
        switch (foe.character) {
            // Wurm
            case 'W':
                foe.maxHitPoints = foe.currentHitPoints = Phaser.Math.Between(15, 25);
                return foe;
            // Imp
            case 'i':
                foe.maxHitPoints = foe.currentHitPoints = Phaser.Math.Between(6, 12);
                return foe;
            // Troll
            case 'T':
                foe.maxHitPoints = foe.currentHitPoints = Phaser.Math.Between(15, 25);
                return foe;
            // Centipede
            case 'C':
                foe.maxHitPoints = foe.currentHitPoints = Phaser.Math.Between(15, 20);
                return foe;
            // Hobgoblin
            case 'h':
                foe.maxHitPoints = foe.currentHitPoints = Phaser.Math.Between(8, 12);
                return foe;
            default:
                console.error('Error. Randomized a missing foe!');
                break;
        }
        return foe;
    }

}