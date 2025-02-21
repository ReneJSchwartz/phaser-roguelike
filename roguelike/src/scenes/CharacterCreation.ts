import { Scene, GameObjects } from 'phaser';
import { Game } from './Game';
import { ScreenBackgroundColor } from './ScreenBackgroundColor';
import { Ancestries, Ancestry, AncestryType } from '../character-creation/ancestries';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import { MainMenu } from './MainMenu';
import { Player } from '../entities/player';
import { Attributes } from '../character-creation/attributes';

/** 
 * Character creation view.
 * In this single page view (PC) you pick your Ancestry, Background, Stats and 
 * probably spells. You can also see what will be in your inventory and info
 * about the currently selected items through an info panel that is always on.
 * The player also selects or randomizes their name.
 */
export class CharacterCreation extends Scene {
    /** View title is at top middle of the screen. */
    private readonly screenName: string = 'Character Creation';
    /** A simple way to prevent buttons from firing multiple times. */
    private shouldProcessButtonPresses: boolean = true;
    /** Used to represent info about something in the screen. */
    private infoBoxContent: GameObjects.Text;
    /** Infobox title needs to be synced with @see infoBoxContent. */
    private infoBoxTitle: GameObjects.Text;
    /** Saved so that randomization can pick a different ancestry every time. */
    private lastChosenAncestryIndex: number = 42;
    /** Store ancestry for checking if attribute requirement is fullfilled etc. */
    private selectedAncestry: AncestryType = AncestryType.Human;
    /** 
     * Ancestries text buttons. Was used for randomization. 
     * At the moment gets the amount of ancestries which could be just a number. 
     * */
    private ancestriesTexts: GameObjects.Text[];
    /** 
     * Stores lambda callbacks that are dynamically generated through making 
     * the clickable ancestry list in Ancestries section. 
     * A button is not callable in code in Phaser.
     * 
     * @see onRandomizeEverythingButtonClicked uses it for randomization.
     */
    private selectAncestryCallbacks: { (): void }[] = [];
    /** Player distributes 5 attribute points. */
    private selectedAttributes: Attributes = new Attributes();
    /** How much health the player has with 0 constitution. */
    private baseHitPoints: number = 25;
    /** Current hit points that are calculated from base and Con. */
    private currentHitPoints: number = this.baseHitPoints;
    /** How much HP investing 1 attribute point to Con gives. */
    private hitPointsFromOneCon: number = 5;
    /** How much mana the player has with 0 Spirit. */
    private baseMana: number = 5;
    /** How much mana the player has with stat and race bonuses. */
    private currentMana: number = this.baseMana;
    /** How much MP investing 1 attribute point to Spi gives. */
    private manaFromOneSpi: number = 5;
    /** How much "armor class"/evasion  a player has before any stat bonuses. */
    private baseAc: number = 5;
    /** How much AC player has after bonuses. */
    private currentAc: number = this.baseAc;
    /** Holds HP MP AC values in UI. */
    private statsSectionText: GameObjects.Text;
    /** UI components: for example badly documented layout groups or a text field. */
    /** Six sided unicode die faces from 1 to 6 accessable by 1-6 index. */
    private d6Faces: string[] = 'd⚀⚁⚂⚃⚄⚅'.split('');
    private rexUI: RexUIPlugin;

    constructor() {
        super('CharacterCreation');
    }

    /** 
     * Makes UI elements to the screen. 
     * These are title, outlined containers, and some buttons.
     * Also fades the view in. 
     */
    create() {
        this.shouldProcessButtonPresses = true;

        const { width, height } = this.scale;
        /** Font y-size. */
        const em: number = 28
        /** Padding for text next to and inside section/container borders. */
        const textPadding: number = em * 0.5;
        /** Padding that sections have in relation to each other. */
        const containerPadding: number = width * 0.02;
        /** Left & right screen edges and sections padding amount per side. */
        const screenEdgesLRPadding: number = width * 0.04;
        /** 
         * The amount of space from the top before the containers start. View 
         * title at the top is not part of the containers and is above this.
         */
        const firstContainerTopPadding: number = height * 0.1;

        // View title
        this.add.text(width * 0.5, height * 0.05,
            this.screenName, {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6, align: 'center'
        })
            .setOrigin(0.5)
            // Each element is set to alpha 0 so they don't flash on fade in.
            .setAlpha(0);

        // Different containerized selection or other sections make up the view
        // Row 1

        // These values keep track of bottom left positions of where the containers should be placed.
        // The following values are for the most leftmost item in the row whose items start with the
        // the same y-positions.
        /** Section y-start value. The section will be drawn beneath this. */
        let y: number = firstContainerTopPadding;
        /** Section x-start value. Current section will be drawn to the right. */
        let x: number = screenEdgesLRPadding;
        /** Section width that can be added to @see x along with padding. */
        let containerWidth: number = width * 0.15;
        /** Section height that can be added to y */
        let containerHeight: number = height * 0.26;

        // Ancestry is the first thing on top left
        const ancestrySectionContainer: GameObjects.Container = this.add.container(x, y);
        const ancestryBoxOutline: GameObjects.Rectangle = this.add.rectangle(0, 0, containerWidth, containerHeight)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff);
        const ancestrySectionTitle: GameObjects.Text = this.add.text(textPadding, textPadding, 'Ancestry')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 });
        // Make ancestries list.
        const selectableAncestries: Ancestry[] = [
            Ancestries.human,
            Ancestries.catfolk,
            Ancestries.houseElf,
            Ancestries.dwarf,
            Ancestries.gnome,
            Ancestries.random];
        this.ancestriesTexts = [];
        for (let index = 0; index < selectableAncestries.length; index++) {
            const t = this.add.text(textPadding, em * 2 + index * em, '  ' + selectableAncestries[index].name)
                .setOrigin(0, 0)
                .setStyle({ fontSize: 28 })
                .setInteractive()
                .on('pointerdown', () => this.selectAncestry(selectableAncestries[index], this.ancestriesTexts, index));
            this.ancestriesTexts.push(t);
            // Button onClick callbacks are not callable by reference to the button in Phaser.
            let func = () => { this.selectAncestry(selectableAncestries[index], this.ancestriesTexts, index) }
            this.selectAncestryCallbacks.push(func);
            ancestrySectionContainer.add(t);
        }
        const ancestrySectionRandomizeDieButton = this.createD6Button(containerWidth - 1.9 * em, textPadding,
            () => this.selectAncestry(Ancestries.random, this.ancestriesTexts, selectableAncestries.length - 1));
        ancestrySectionContainer.add([ancestryBoxOutline, ancestrySectionTitle, ancestrySectionRandomizeDieButton])
            .setAlpha(0);

        // X starting point comes from old container's width + starting point.
        x += containerWidth + containerPadding;
        // New container's width.
        containerWidth = width * 0.42;

        // Next section can be for backgrounds or inventory or spells or starting equipment
        const nextSectionContainer: GameObjects.Container = this.add.container(x, y);
        const nextSectionOutline: GameObjects.Rectangle = this.add.rectangle(0, 0, containerWidth, containerHeight)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff);
        const nextSectionTitle: GameObjects.Text = this.add.text(textPadding, textPadding, 'Coming soon!')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 });
        nextSectionContainer.add([nextSectionOutline, nextSectionTitle])
            .setAlpha(0);

        x += containerWidth + containerPadding;
        // Info box takes the remaining space on the right side.
        containerWidth = width - x - screenEdgesLRPadding;

        // Info box provides info on what is currently selected (e.g. Ancestry description).
        const infoBoxSectionContainer: GameObjects.Container = this.add.container(x, y)
            .setAlpha(0);
        // Custom height as this is not "on the grid" so to speak, it is just on the first row.
        const infoBoxOutline: GameObjects.Rectangle = this.add.rectangle(0, 0, containerWidth, height * 0.8)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff);
        this.infoBoxTitle = this.add.text(textPadding, textPadding, 'Info - Human')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 });
        this.infoBoxContent = this.add.text(textPadding, em * 2.5, Ancestries.catfolk.description)
            .setOrigin(0, 0)
            .setStyle({ fontSize: 28, wordWrap: { width: width * 0.3 } });
        infoBoxSectionContainer.add([infoBoxOutline, this.infoBoxTitle, this.infoBoxContent]);

        // Row 2
        x = screenEdgesLRPadding;
        y += containerHeight + containerPadding;
        containerHeight = height * 0.35;
        containerWidth = width * 0.59;

        // Attribute points section that is lower on the screen
        const attributesSectionContainer: GameObjects.Container = this.add.container(x, y);
        const attributesSectionOutline: GameObjects.Rectangle = this.add.rectangle(0, 0, containerWidth, containerHeight)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff);
        const attributesSectionTitle = this.add.text(textPadding, textPadding, 'Attributes (5 remaining)')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 });
        // Randomization happens by clicking a die.
        const attributesSectionRandomizeDieButton = this.createD6Button(containerWidth - 1.9 * em, textPadding, () => this.onRandomizeAttributesClicked());
        attributesSectionContainer.add([attributesSectionOutline, attributesSectionTitle, attributesSectionRandomizeDieButton])
            .setAlpha(0);

        // Attributes
        // Clicking these will increase the stat amount or reset it back to 0.
        let defaultAttributes = [['Str', 1], ['Dex', 0], ['Con', 1], ['Spi', 2], ['Kno', 1]];
        let attributesXOffset = width * 0.11;
        const allAttributesContainer: GameObjects.Container = this.add.container(em * 4, em * 5.5);
        for (let i = 0; i < defaultAttributes.length; i++) {
            const singleAttributeContainer: GameObjects.Container = this.add.container(i * attributesXOffset, 0);
            const statCircle = this.add.circle(0, 0, height * 0.07, 0x000000, 1)
                .setStrokeStyle(2, 0xffffff)
            const statName = this.add.text(0, 0, String(defaultAttributes[i][0]))
                .setOrigin(0)
                .setStyle({ fontSize: 42 })
            statName.setPosition(statCircle.x - statName.width * 0.5, statCircle.y + width * 0.05);
            const statAmount = this.add.text(0, 0, String(defaultAttributes[i][1]), { fontSize: 56 })
                .setOrigin(0)
            statAmount.setPosition(statCircle.x - statAmount.width * 0.5, statCircle.y - statAmount.height * 0.5);
            singleAttributeContainer.add([statCircle, statName, statAmount]);
            allAttributesContainer.add(singleAttributeContainer);
        }
        attributesSectionContainer.add(allAttributesContainer);

        // Row 3, final stats
        x = screenEdgesLRPadding;
        y += containerHeight + containerPadding;
        containerHeight = width * 0.04;

        // Below attributes there will be final HP, MP stats
        const statsSectionContainer: GameObjects.Container = this.add.container(x, y);
        const statsSectionOutline: GameObjects.Rectangle = this.add.rectangle(0, 0, width * 0.59, containerHeight)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff);
        this.statsSectionText = this.add.text(textPadding, textPadding,
            `Stats:    HP: ${25}    MP: ${5}    AC: ${5}`)
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 })
            .setInteractive()
            .on('pointerdown', () => {
                this.showInfoOnInfoBox('Stats',
                    `HP - Hit Points. Don't let these go to zero. Constitution increases HP and its recharge rate.\n
MP - Mana Points. Spells use 5 or 10 or 15 mana. Scrolls are single use and use no mana. After that you have a chance to learn the used scroll spell. Spirit increases MP and its recharge rate.\n
AC - Armor class. Enemies need to roll this on 20 sided die to hit you. Armor can reduce the damage (min 1).`);
            });
        this.updateStatsOnStatsSection();
        statsSectionContainer.add([statsSectionOutline, this.statsSectionText])
            .setAlpha(0);


        // Bottom of the screen: not subject to sections/containers but rather free form.
        x = width * 0.06;
        y = height * 0.91;

        // Bottom text buttons for starting the game, randomizing everything or going back to menu.
        const startGameButton: GameObjects.Text = this.add.text(x, y, 'Start Game')
            .setOrigin(0)
            .setStyle({ fontSize: 32 })
            .setAlpha(0)
            .setInteractive()
            .on('pointerdown', () => { this.onFinishCharacterCreationAndStartNewGameButtonClicked(); });

        x += width * 0.18;

        const randomizeEverythingButton: GameObjects.Text = this.add.text(x, y, 'Randomize All')
            .setOrigin(0)
            .setStyle({ fontSize: 32 })
            .setAlpha(0)
            .setInteractive()
            .on('pointerdown', () => { this.onRandomizeEverythingButtonClicked(); });

        x += width * 0.20;

        const backToMenuButton: GameObjects.Text = this.add.text(x, y, 'Back To Menu')
            .setOrigin(0)
            .setStyle({ fontSize: 32 })
            .setAlpha(0)
            .setInteractive()
            .on('pointerdown', () => { this.onBackToMenuButtonClicked(); });

        // On start screen fades into view.
        this.tweens.add({
            targets: this.children.list,
            alpha: 1,
        });

        this.selectAncestry(selectableAncestries[0], this.ancestriesTexts, 0);

        Player.Instance.setAttributes(this.selectedAttributes);
    }

    /** A d6 button component for use in randomizing character creation selections. */
    private createD6Button(x: number, y: number, lambda: { (): void }): GameObjects.Text {
        const dieButton: GameObjects.Text = this.add.text(x, y, this.d6Faces[Phaser.Math.Between(1, 6)])
            .setOrigin(0)
            .setStyle({ fontSize: 48 })
            .setInteractive()
            .on('pointerdown', () => {
                lambda();
                const curFace: string = dieButton.text;
                let newFace: string;
                do {
                    newFace = this.d6Faces[Phaser.Math.Between(1, this.d6Faces.length - 1)];
                } while (curFace === newFace)
                // todo play dice sound
                dieButton.text = newFace;
            });
        return dieButton;
    }

    /** 
     * Shows text on info box.
     * 
     * @param title Title on the top. 'Info - ' will be shown before it.
     * @param content Content text below the title.
     * */
    private showInfoOnInfoBox(title: string, content: string): void {
        this.infoBoxTitle.text = 'Info - ' + title;
        this.infoBoxContent.text = content;
    }

    /** Updates stats (HP, MP, AC) on the bottom part of the screen. Takes class bonuses into consideration. */
    private updateStatsOnStatsSection(): void {
        this.currentHitPoints = this.baseHitPoints + this.selectedAttributes.constitution * this.hitPointsFromOneCon
            + (this.selectedAncestry === AncestryType.Dwarf ? 5 : 0);

        this.currentMana = this.baseMana + this.selectedAttributes.spirit * this.manaFromOneSpi;

        this.currentAc = this.baseAc + this.selectedAttributes.dexterity
            + (this.selectedAncestry === AncestryType.Catfolk ? 2 : 0);

        this.statsSectionText.text = `Stats:    HP: ${this.currentHitPoints}    MP: ${this.currentMana.toString().padEnd(2, ' ')}    AC: ${this.currentAc}`;
    }

    /** Randomize attributes while honoring ancestry requirements. */
    private onRandomizeAttributesClicked(): void {
        let attributes: number[] = [1, 1, 1, 1, 1];
        const iStr = 0;
        const iDex = 1;
        const iCon = 2;
        const iSpi = 3;
        const iKno = 4;

        let overwriteTo: boolean = false;
        let statToIncrease: number = 0;

        for (let i = 0; i < 300; i++) {
            let from = Phaser.Math.Between(0, 4);
            let to = (from + Phaser.Math.Between(0, 3)) % 5;
            if (overwriteTo) {
                overwriteTo = false;
                to = statToIncrease;
            }

            if (attributes[to] < 3 && attributes[from] > 0) {
                attributes[to]++;
                attributes[from]--;
            }
            else if (attributes[from] < 3 && attributes[to] > 0) {
                attributes[from]++;
                attributes[to]--;
            }

            if (i > 50 && i % 5 == 0) {
                console.log('checking requirements');
                if (this.selectedAncestry === AncestryType.Human) {
                    // 0 required stats so every combination is valid
                    break;
                }
                else if (this.selectedAncestry === AncestryType.Catfolk) {
                    // For catfolk we aim just to increase Dex. 
                    // This enables caster archetypes.
                    // It is also the dominant stat.

                    const combined = attributes[iDex] + attributes[iStr];

                    if (attributes[iDex] === 0) {
                        overwriteTo = true;
                        statToIncrease = iDex;
                        continue;
                    }
                    if (attributes[iDex] > 0 && combined >= 2) {
                        break;
                    }
                }
                else if (this.selectedAncestry === AncestryType.Dwarf) {
                    // For dwarves we aim just to increase Con since 
                    // it's the dominant stat and enables caster archetype.

                    const combined = attributes[iCon] + attributes[iStr] + attributes[iSpi] + attributes[iKno];

                    if (attributes[iCon] === 0) {
                        overwriteTo = true;
                        statToIncrease = iCon;
                        continue;
                    }
                    if (attributes[iCon] > 0 && combined >= 2) {
                        break;
                    }
                }
                else if (this.selectedAncestry === AncestryType.Gnome) {
                    const combined = attributes[iKno] + attributes[iCon] + attributes[iDex];

                    if (attributes[iKno] === 0) {
                        overwriteTo = true;
                        statToIncrease = iKno;
                        continue;
                    }
                    if (attributes[iKno] > 0 && combined >= 2) {
                        break;
                    }
                }
                else if (this.selectedAncestry === AncestryType.HouseElf) {
                    const combined = attributes[iSpi] + attributes[iDex] + attributes[iKno];

                    if (attributes[iSpi] === 0) {
                        overwriteTo = true;
                        statToIncrease = iSpi;
                        continue;
                    }
                    if (attributes[iKno] > 0 && combined >= 2) {
                        break;
                    }
                }
            }
        }

        this.selectedAttributes.saveIntArrayAsAttributes(attributes);
        this.updateStatsOnStatsSection();
        console.log(this.selectedAttributes);
    }

    /** 
     * Populates info box and possibly controls attribute selection requirements. '
     * 
     * @param ancestry What ancestry was chosen for the character.
     * @param options The different ancestry gameobject texts for styling purposes.
     * @param index what was the index of the chosen option. Used for styling.
     */
    private selectAncestry(ancestry: Ancestry, options: GameObjects.Text[], index: number): void {
        if (ancestry.name === 'Random') {
            const selectableAncestries: Ancestry[] = [Ancestries.human, Ancestries.catfolk, Ancestries.houseElf, Ancestries.dwarf, Ancestries.gnome, Ancestries.random];

            let randInt: number;
            do {
                randInt = Phaser.Math.Between(0, selectableAncestries.length - 2);
            } while (randInt === this.lastChosenAncestryIndex)

            this.selectAncestry(selectableAncestries[randInt], options, randInt);
            return;
        }

        this.lastChosenAncestryIndex = index;
        this.selectedAncestry = ancestry.type;
        this.infoBoxTitle.text = 'Info - ' + ancestry.name;
        this.infoBoxContent.text = ancestry.description;

        // Visually show that the new ancestry is selected and the old ones are not.
        for (let i = 0; i < options.length; i++) {
            options[i].setColor(i === index ? '#fff' : '#666');
        }

        this.updateStatsOnStatsSection();
        Player.Instance.setAncestry(ancestry.name);
    }

    // Bottom row button methods START GAME, RANDOMIZE EVERYTHING, BACK TO MENU

    /** Randomizes ancestry, attribute points and other things in the screen if any such as name. */
    private onRandomizeEverythingButtonClicked(): void {
        console.log(CharacterCreation.name, this.onRandomizeEverythingButtonClicked.name);

        this.selectAncestryCallbacks[Phaser.Math.Between(0, this.ancestriesTexts.length - 2)].call(this);

        // todo randomize attributes
        this.onRandomizeAttributesClicked();
    }

    private onBackToMenuButtonClicked(): void {
        console.log(this.onBackToMenuButtonClicked.name);

        // Guard clause against spamming buttons.
        if (this.shouldProcessButtonPresses === false) {
            return;
        }
        this.shouldProcessButtonPresses = false;

        // Visual effects for scene transition.
        ScreenBackgroundColor.instance.briefWhiteFlash();

        this.children.list.forEach(element => {
            this.tweens.add({
                targets: element,
                alpha: 0,
                duration: 250
            })
        });

        this.time.delayedCall(550, () => this.scene.start(MainMenu.name));
    }

    /** Starts a new game with the selected character settings and initiates visual effects. */
    private onFinishCharacterCreationAndStartNewGameButtonClicked(): void {
        console.log(this.onFinishCharacterCreationAndStartNewGameButtonClicked.name);

        // Guard clause against spamming buttons.
        if (this.shouldProcessButtonPresses === false) {
            return;
        }
        this.shouldProcessButtonPresses = false;

        // Visual effects for scene transition.
        ScreenBackgroundColor.instance.briefWhiteFlash();

        this.children.list.forEach(element => {
            this.tweens.add({
                targets: element,
                alpha: 0,
                duration: 250
            })
        });

        this.time.delayedCall(550, () => this.scene.start(Game.name));
    }
}
