/** 
 * Ancestry is a data model about a particular ancestry such as Half-Orc.
 * Is used in char creation and possibly later in-game. 
 */
export class Ancestry {
    public name: string;
    public description: string;
    public perks: string;

    /**
     * Creates an Ancestry.
     * 
     * @param name E.g. Human.
     * @param description Full description that appears in info box. 
     */
    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}

/** Contains data about available ancestries for character creation. */
export class Ancestries {
    public static human: Ancestry = new Ancestry('Human',
        `Humans are adaptive folk well spread across continents that usually undergo an extensive education.

Humans in general don’t have any apparent strengths or weaknesses but individuals can excel in various ways. They prosper because of their differences. What sets you apart?

At least one Attribute point in one of these stats is required to play as a human: Kno, Dex, Spi`);
    /** Catfolk also have Perks Nine Lives and Darkvision, Keen Senses etc. */
    public static catfolk: Ancestry = new Ancestry('Catfolk', 
        `Catfolk are nimble bipedal combatants that speak funny but scratch mightily. Some are more cat-like and others resemble tigers or panthers.
        
They seem to avoid death as well as they avoid hits. They have excellent senses. In their silent deadly hunt they have been said to have mastered the Predator technique.
    
To play as one put at least one attribute point to Dex and another to Dex or Str.`)
    // ['Dwarf', 'Catfolk', 'House-elf']);

}
