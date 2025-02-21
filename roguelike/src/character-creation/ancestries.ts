/** Compact way to store and compare ancestries. */
export enum AncestryType {
    Catfolk,
    Dwarf,
    Gnome,
    Human,
    HouseElf,
    Random
}

/** 
 * Ancestry holds information about a particular ancestry such as Half-Orc.
 * Is used in char creation and later in-game. 
 */
export class Ancestry {
    public type: AncestryType;
    public name: string;
    public description: string;
    public ingameDescription: string;
    public perks: string;

    /**
     * Creates an Ancestry.
     * 
     * @param name E.g. Human.
     * @param description Full description that appears in info box. 
     * @param type e.g. AncestryType.Dwarf.
     */
    constructor(name: string, description: string, type: AncestryType) {
        this.name = name;
        this.description = description;
        this.type = type;
    }
}

/** Contains data about available ancestries for character creation. */
export class Ancestries {
    public static human: Ancestry = new Ancestry('Human',
        `Humans are adaptive folk well spread across continents that have a medium lifespan but are fast learners. You learn Perks at a faster rate.

Humans in general don’t have any apparent strengths or weaknesses but individuals can excel in various ways. They prosper because of their differences. What sets you apart?

There's no Attribute Point requirements to play a human.`,
        AncestryType.Human);

    /** Catfolk also have Perks Nine Lives and Darkvision, Keen Senses etc. */
    public static catfolk: Ancestry = new Ancestry('Catfolk',
        `Catfolk are nimble bipedal predators that speak funnily but scratch mightily. Some are more cat-like and others resemble tigers or panthers.

Catfolk have excellent senses and they have a bonus for avoiding hits. These great cats make good mages as well due to their connection with the nature.
    
To play as one put at least one attribute point to Dex and another to Dex or Str.`,
        AncestryType.Catfolk);

    public static houseElf: Ancestry = new Ancestry('House-elf',
        `House-elves have many names. They are small, helpful but stubborn and very magical folk. Once a day House-elves can turn invisible.

For clothes they prefer cool hats and rags or just relying on their hairy bodies.

To play as one put one point into Spi and another point into Spi/Dex/Kno.`,
        AncestryType.HouseElf);

    public static dwarf: Ancestry = new Ancestry('Dwarf', `Dwarves are hardy mountain or hill-dwellers, skilled craftsmen and knowledgeable.

Dwarves have two poison resistance Perks as well as darkvision, they are proficient with battle axe/hammer and many kinds of crafting. 

To play as one put one point into Con and another point into Con/Str/Spi/Kno.`,
        AncestryType.Dwarf);

    public static gnome: Ancestry = new Ancestry('Gnome', `Gnomes are long-living small, curious, fun-loving and intelligent. They can be for example tinkerers, researchers or jewelers.
    
You have darkvision, some magic is less effective on you. You are proficient in adding affixes to items.
    
To play as one put one point into Kno and another point into Kno/Con/Dex.`,
        AncestryType.Gnome);

    public static random: Ancestry = new Ancestry('Random', '', AncestryType.Random);
}
