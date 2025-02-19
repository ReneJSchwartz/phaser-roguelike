/** 
 * Ancestry holds information about a particular ancestry such as Half-Orc.
 * Is used in char creation and later in-game. 
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
        `Humans are adaptive folk well spread across continents that usually undergo an extensive education. They are fast learners.

Humans in general don’t have any apparent strengths or weaknesses but individuals can excel in various ways. They prosper because of their differences. What sets you apart?

At least one Attribute point in Kno or Dex or Spi is required to play as a human.`);
    /** Catfolk also have Perks Nine Lives and Darkvision, Keen Senses etc. */
    public static catfolk: Ancestry = new Ancestry('Catfolk',
        `Catfolk are nimble bipedal predators that speak funnily but scratch mightily. Some are more cat-like and others resemble tigers or panthers.
        
Catfolk avoid death as well as they avoid hits and they have excellent senses. Gain access to Perks 'Nine Lives' and 'Keen Senses'. These great cats make good mages as well due to their connection with the nature.
    
To play as one put at least one attribute point to Dex and another to Dex or Str.`);
    public static houseElf: Ancestry = new Ancestry('House-elf',
        `House-elves have many names. They are small, helpful but stubborn and very magical folk. Their natural abilities include turning invisible or into an animal. You gain those Perks.

For some reason they don't like clothes. They rather go in rags or even naked if they are hairy enough. 

To play as one put one point into Spi and another point into Spi/Dex/Kno.`);
    public static dwarf: Ancestry = new Ancestry('Dwarf', `Dwarves are hardy mountain or hill-dwellers, skilled craftsmen and knowledgeable.

Dwarves have two poison resistance perks as well as darkvision and 

To play as one put one point into Con and another point into Con/Str/Spi/Kno.`);

    public static gnome: Ancestry = new Ancestry('Gnome', `Gnomes are small and intelligent. They can be for example tinkerers, researchers or jewelers.
    
To play as one put one point into Kno and another point into Kno/Con/Dex.`);

    public static random: Ancestry = new Ancestry('Random', '');
}
