import { Scene, GameObjects } from 'phaser';
import { Game } from './Game';
import { ScreenBackgroundColor } from './ScreenBackgroundColor';
import { Ancestries } from '../character-creation/ancestries';
import { Ancestry } from '../character-creation/ancestry';
import { AncestryType } from '../enums/ancestry-type';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import { MainMenu } from './MainMenu';
import { Player } from '../entities/player';
import { Attributes } from '../character-creation/attributes';
import { Attribute } from '../enums/attribute';
import { StyleConfig } from '../config/style-config';

/** 
 * Character creation view.
 * 
 * Design: In this horizontal style single page view (PC layout) you pick your 
 * Ancestry, Name, and Attributes. More things to be picked have been designed. 
 * You also see info about the currently selected items through an info panel
 * that is always on.
 * 
 * The view has unicode dies for randomization but otherwise buttons are just 
 * regular text. The player can proceed after their attribute points pass 
 * a ancestry requirements check.
 */
export class CharacterCreation extends Scene {
    /** View title is at top middle of the screen. */
    private readonly screenName: string = 'Character Creation';
    /** A simple way to prevent buttons from firing multiple times. */
    private shouldProcessButtonPresses: boolean = true;
    // Info box.
    /** Used to represent info about something in the screen. */
    private infoBoxContent: GameObjects.Text;
    /** Infobox title needs to be synced with @see infoBoxContent. */
    private infoBoxTitle: GameObjects.Text;
    // Ancestries
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
    // Attributes, Str Dex Con
    private attributesSectionTitle: GameObjects.Text;
    /** Player distributes 5 attribute points. */
    private selectedAttributes: Attributes = new Attributes();
    // Stats, HP MP AC
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
    /** Six sided unicode die faces from 1 to 6 accessable by 1-6 index. */
    private d6Faces: string[] = 'd⚀⚁⚂⚃⚄⚅'.split('');
    /** UI components: for example badly documented layout groups or a text field. */
    private rexUI: RexUIPlugin;
    // Attributes selection
    /** Amount of available attribute points that have not yet been placed. */
    private remainingAttributePoints: number = 5;
    /** 
     * Numbers inside attribute circles. The number is between 0 and 3. 
     * The indexes correspond to Attribute enum values. 
     */
    private attributeAmounts: GameObjects.Text[] = [];
    /** Attribute circles. */
    private attributeCircles: GameObjects.Arc[] = [];
    // Bottom row buttons
    /** 
     * Start game button needs to be only enabled when user has a valid 
     * character meaning one that has correctly set up attribute points.
     */
    private startGameButton: GameObjects.Text;



    constructor() {
        super('CharacterCreation');
    }

    /** 
     * Makes UI elements to the screen and controls how they work
     * by placing proper input listener callbacks. 
     * These are title, outlined containers, and some buttons.
     * Also fades the view in. 
     */
    create() {
        this.shouldProcessButtonPresses = true;

        const { width, height } = this.scale;

        // Layout paddings & sizing tools
        /** Font y-size. Used to make paddings for text or other elements. */
        const em: number = 28;
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
        this.add.text(width * 0.5, height * 0.05, this.screenName, StyleConfig.characterCreationTitleStyle)
            .setOrigin(0.5)

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
            Ancestries.gnome];
        this.ancestriesTexts = [];
        for (let index = 0; index < selectableAncestries.length; index++) {
            const t = this.add.text(textPadding, em * 2 + index * em,
                // Add extra space, later some kind of ui indicator arrow 
                // might move there (for consoles, arrow keys & space/enter).
                '  ' + selectableAncestries[index].name)
                .setOrigin(0, 0)
                .setStyle({ fontSize: 28 })
                .setInteractive()
                .on('pointerdown', () => this.selectAncestry(selectableAncestries[index], this.ancestriesTexts, index));
            this.ancestriesTexts.push(t);
            // Button onClick callbacks are not callable by reference to the button in Phaser.
            const func = () => { this.selectAncestry(selectableAncestries[index], this.ancestriesTexts, index) }
            this.selectAncestryCallbacks.push(func);
            ancestrySectionContainer.add(t);
        }
        const ancestrySectionRandomizeDieButton = this.createD6Button(containerWidth - 1.9 * em, textPadding,
            () => this.selectAncestry(Ancestries.random, this.ancestriesTexts, selectableAncestries.length - 1));
        ancestrySectionContainer.add([ancestryBoxOutline, ancestrySectionTitle, ancestrySectionRandomizeDieButton])

        // X starting point comes from old container's width + starting point.
        x += containerWidth + containerPadding;
        // New container's width.
        containerWidth = width * 0.42;

        // Next section can be for backgrounds or inventory or spells or starting equipment
        const nextSectionContainer: GameObjects.Container = this.add.container(x, y);
        const nextSectionOutline: GameObjects.Rectangle = this.add.rectangle(0, 0, containerWidth, containerHeight)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff);
        const nextSectionTitle: GameObjects.Text = this.add.text(textPadding, textPadding, 'Name')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 });
        // Name input field.
        // Editable text is done using rexui text edit.
        const nameMaxLength: number = 10;
        const nextSectionNameInputField: GameObjects.Text = this.add.text(textPadding, textPadding + em * 2, 'John')
            .setStyle({ fontSize: em, width: em * 10, backgroundColor: '#333', align: 'center', fixedWidth: em * 7 })
            .setInteractive()
            .on('pointerdown', () => {
                const currentName: string = nextSectionNameInputField.text;
                this.rexUI.edit(
                    nextSectionNameInputField,
                    // Passing config arguments causes unexpected behaviour 
                    // and the documentation is poor so it's better to not 
                    // use advanced features at the moment.
                    {},
                    // On close callback
                    () => {
                        // In the case that the name was left empty, reuse last name.
                        if (nextSectionNameInputField.text.length === 0) {
                            nextSectionNameInputField.text = currentName;
                        }
                        else {
                            nextSectionNameInputField.text = nextSectionNameInputField.text.substring(0, nameMaxLength);
                            Player.Instance.setName(nextSectionNameInputField.text);
                        }
                    });
            });
        const nextSectionRandomizeDieButton: GameObjects.Text = this.createD6Button(
            nextSectionNameInputField.x + nextSectionNameInputField.width + em * 0.5,
            nextSectionNameInputField.y * 0.9,
            () => {
                const randNames: string[] = ['Adam', 'Suzy', 'Hiro'];
                nextSectionNameInputField.text = randNames[Phaser.Math.Between(0, randNames.length - 1)];
                Player.Instance.setName(nextSectionNameInputField.text);
            });
        nextSectionContainer.add([
            nextSectionOutline,
            nextSectionTitle,
            nextSectionNameInputField,
            nextSectionRandomizeDieButton]);

        x += containerWidth + containerPadding;
        // Info box takes the remaining space on the right side.
        containerWidth = width - x - screenEdgesLRPadding;

        // Info box provides info on what is currently selected (e.g. Ancestry description).
        const infoBoxSectionContainer: GameObjects.Container = this.add.container(x, y);
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
        infoBoxSectionContainer.add([
            infoBoxOutline,
            this.infoBoxTitle,
            this.infoBoxContent]);

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
        this.attributesSectionTitle = this.add.text(textPadding, textPadding, 'Attributes (5 remaining)')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 });
        // Randomization happens by clicking a die.
        const attributesSectionRandomizeDieButton: GameObjects.Text = this.createD6Button(containerWidth - 1.9 * em, textPadding,
            () => this.onRandomizeAttributesClicked());
        attributesSectionContainer.add([
            attributesSectionOutline,
            this.attributesSectionTitle,
            attributesSectionRandomizeDieButton]);

        // Attribute circles, numbers and legend
        // Clicking these will increase the attribute amount or reset it back to 0.
        const attributeNames: string[] = ['Str', 'Dex', 'Con', 'Spi', 'Kno'];
        const attributesXOffset: number = width * 0.11;
        const allAttributesContainer: GameObjects.Container = this.add.container(em * 4, em * 5.5);

        for (let i = 0; i < 5; i++) {
            const singleAttributeContainer: GameObjects.Container = this.add.container(i * attributesXOffset, 0);
            const attributeCircle: GameObjects.Arc = this.add.circle(0, 0, height * 0.07, 0x000000, 1)
                .setStrokeStyle(2, 0xffffff)
                .setInteractive()
                .on('pointerdown', () => {
                    console.log('attributeCircle ' + Attribute[i] + ' pressed');
                    this.increaseAttribute(i as Attribute);
                });
            const attributeName: GameObjects.Text = this.add.text(0, 0, attributeNames[i])
                .setOrigin(0)
                .setStyle({ fontSize: 42 })
                .setInteractive()
                .on('pointerdown', () => console.log('attributeName ' + Attribute[i] + ' pressed'));
            attributeName.setPosition(attributeCircle.x - attributeName.width * 0.5, attributeCircle.y + width * 0.05);
            const attributeAmount: GameObjects.Text = this.add.text(0, 0, '0', { fontSize: 56 })
                .setOrigin(0)
            attributeAmount.setPosition(attributeCircle.x - attributeAmount.width * 0.5, attributeCircle.y - attributeAmount.height * 0.5);
            singleAttributeContainer.add([attributeCircle, attributeName, attributeAmount]);
            allAttributesContainer.add(singleAttributeContainer);

            this.attributeAmounts.push(attributeAmount);
            this.attributeCircles.push(attributeCircle);
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
                    `HP - Hit points. Your character will die. And running out of these will cause it. Constitution increases HP and its recharge rate and helps in Con saves.\n
MP - Mana points. Spells use 5 or 10 or 15 mana. Scrolls are single use and use no mana. After that you have a chance to learn the used scroll spell. Spirit increases MP and its recharge rate.\n
AC - Armor class. Enemies need to roll this on 20 sided die to hit you. Armor can then reduce the damage (min 1).`);
            });
        this.updateStatsSectionStats();
        statsSectionContainer.add([statsSectionOutline, this.statsSectionText]);

        // Bottom of the screen buttons

        // Layout is not subject to sections/containers but is rather free form.
        x = width * 0.06;
        y = height * 0.91;

        // Bottom text buttons for starting the game, randomizing everything or going back to menu.

        this.startGameButton = this.add.text(x, y, 'Start Game')
            .setOrigin(0)
            .setStyle({ fontSize: 32 })
            .setInteractive()
            .on('pointerdown', () => this.onFinishCharacterCreationAndStartNewGameButtonClicked());

        x += width * 0.18;

        // randomizeEverythingButton: GameObjects.Text
        this.add.text(x, y, 'Randomize All')
            .setOrigin(0)
            .setStyle({ fontSize: 32 })
            .setInteractive()
            .on('pointerdown', () => this.onRandomizeEverythingButtonClicked());

        x += width * 0.20;

        // backToMenuButton: GameObjects.Text
        this.add.text(x, y, 'Back To Menu')
            .setOrigin(0)
            .setStyle({ fontSize: 32 })
            .setInteractive()
            .on('pointerdown', () => { this.onBackToMenuButtonClicked(); });

        // Other functionality

        // On start screen fades into view.
        // Set alphas to 0 to prevent flashing on fade in.
        this.children.list.filter(x => x instanceof GameObjects.Container
            || x instanceof GameObjects.Text)
            .forEach(x => x.setAlpha(0));

        // Then bring everything into view.
        this.tweens.add({
            targets: this.children.list,
            alpha: 1,
        });

        // Selects first ancestry from the list at start (human).
        this.selectAncestry(selectableAncestries[0], this.ancestriesTexts, 0);
        Player.Instance.setAttributes(this.selectedAttributes);

        // Start Game button is not clickable as no attributes are set.
        // If view begins with a randomized char this can be omitted.
        this.setStartGameButtonInteractivity(false);
    } //create

    /** 
     * Pressing attribute circle increases attribute.
     * Attributes that go over 3 loop back to 0.
     * 
     * @param attribute What attribute to increase?
     */
    private increaseAttribute(attribute: Attribute): void {
        console.log(CharacterCreation.name + ' increaseAttribute: '
            + Attribute[attribute]);

        const curAttributeNum: number = Number(this.attributeAmounts[attribute].text);

        // Edge case for returning 1-3 points when all points are used
        if (this.remainingAttributePoints === 0 || curAttributeNum === 3) {
            this.attributeAmounts[attribute].text = '0';
            this.remainingAttributePoints += curAttributeNum;
            this.selectedAttributes.setAttribute(attribute as Attribute, 0);
            this.setStartGameButtonInteractivity(Attributes.isValidAttributesForAncestry(
                this.selectedAncestry, this.selectedAttributes));
            this.updateRemainingAttributePointsText();

            return;
        }

        const newAttributeNum: number = curAttributeNum + 1;
        this.remainingAttributePoints--;
        this.selectedAttributes.setAttribute(attribute as Attribute, newAttributeNum);
        this.attributeAmounts[attribute].text = newAttributeNum.toString();
        this.updateRemainingAttributePointsText();
        this.setStartGameButtonInteractivity(Attributes.isValidAttributesForAncestry(
            this.selectedAncestry, this.selectedAttributes));
    }

    /** A d6 button component for use in randomizing character creation selections. */
    private createD6Button(x: number, y: number, lambda: { (): void }): GameObjects.Text {
        const dieButton: GameObjects.Text = this.add.text(x, y,
            this.d6Faces[Phaser.Math.Between(1, 6)])
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

    /** 
     * Updates stats (HP, MP, AC) on the bottom part of the screen. 
     * Takes class bonuses into consideration.
     */
    private updateStatsSectionStats(): void {
        this.currentHitPoints = this.baseHitPoints
            + this.selectedAttributes.constitution * this.hitPointsFromOneCon
            + (this.selectedAncestry === AncestryType.Dwarf ? 5 : 0);

        this.currentMana = this.baseMana
            + this.selectedAttributes.spirit * this.manaFromOneSpi;

        this.currentAc = this.baseAc + this.selectedAttributes.dexterity
            + (this.selectedAncestry === AncestryType.Catfolk ? 2 : 0);

        this.statsSectionText.text = `Stats:    HP: ${this.currentHitPoints}    MP: ${this.currentMana.toString().padEnd(2, ' ')}    AC: ${this.currentAc}`;
    }

    /** Randomize attributes while honoring ancestry requirements. */
    private onRandomizeAttributesClicked(): void {
        console.log(this.onRandomizeAttributesClicked.name);

        /** Attributes in array form for indexing & counting purposes. */
        const attributes: number[] = [1, 1, 1, 1, 1];
        const iStr: number = 0;
        const iDex: number = 1;
        const iCon: number = 2;
        const iSpi: number = 3;
        const iKno: number = 4;

        /** 
         * A way to try to increase some attribute if the attribute
         * is not high enough when this algo tries to finish.
         * Does not always succeed but does not need to either.
         */
        let overwriteTo: boolean = false;
        /** 
         * If increasing a primary attribute with {@see overwriteTo} this is
         * the stat it tries to increase which corresponds to an attribute.
         */
        let statToIncrease: number = 0;

        // Main loop of the randomization algo which tries to stop at 50, 55,
        // and so on randomizations.
        for (let i = 0; i < 300; i++) {
            // Attribute to take from
            const from: number = Phaser.Math.Between(0, 4);
            // Attribute to increase, might be overwritten
            let to: number = (from + Phaser.Math.Between(0, 3)) % 5;

            // If trying to wrap up the randomization & increase a primary 
            // attribute to is overwritten. Works most of the time, 3 or 4 
            // times out of 5.
            if (overwriteTo) {
                overwriteTo = false;
                to = statToIncrease;
            }

            // Check if swap or reverse swap is valid.
            if (attributes[to] < 3 && attributes[from] > 0) {
                attributes[to]++;
                attributes[from]--;
            }
            else if (attributes[from] < 3 && attributes[to] > 0) {
                attributes[from]++;
                attributes[to]--;
            }

            // As seen here the current iteration does not always do anything,
            // but across many iterations it does its job.

            // Try to exit after some randomizations have been done
            // but validate the results.
            if (i >= 50 && i % 5 == 0) {
                console.log('Checking if passes attribute requirements.');
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

                    const combined = attributes[iCon] + attributes[iStr]
                        + attributes[iSpi] + attributes[iKno];

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
                    const combined = attributes[iKno] + attributes[iCon]
                        + attributes[iDex];

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
                    const combined = attributes[iSpi] + attributes[iDex]
                        + attributes[iKno];

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
        for (let i = 0; i < attributes.length; i++) {
            this.attributeAmounts[i].text = attributes[i].toString();
        }

        this.remainingAttributePoints = 0;
        this.updateRemainingAttributePointsText();

        this.updateStatsSectionStats();

        // At this point the only valid character requirement,
        // valid attribute points are guaranteed.
        this.setStartGameButtonInteractivity(true);

        console.log(this.selectedAttributes);
    } //onRandomizeAttributesClicked

    /** Updates the text: 'Attributes (n remaining)' where n is between 0-5. */
    private updateRemainingAttributePointsText(): void {
        this.attributesSectionTitle.text = `Attributes (${this.remainingAttributePoints} remaining)`;
    }

    /** 
     * Start game button is only usable when attribute points are correctly 
     * set. Otherwise it is is unresponsive and looks that way.
     * 
     * @param interactive Should the button accept input and should it look such.
     */
    private setStartGameButtonInteractivity(interactive: boolean): void {
        if (interactive) {
            this.startGameButton.setInteractive();
            this.startGameButton.setStyle({ ... this.startGameButton.style, color: StyleConfig.buttonColorEnabled });
        }
        else {
            this.startGameButton.disableInteractive();
            this.startGameButton.setStyle({ ... this.startGameButton.style, color: StyleConfig.buttonColorDisabled });
        }
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

        this.updateStatsSectionStats();
        Player.Instance.setAncestry(ancestry.type, ancestry.name);
    }

    // Bottom row button methods START GAME, RANDOMIZE EVERYTHING, BACK TO MENU

    /** Randomizes ancestry, attribute points and other things in the screen if any such as name. */
    private onRandomizeEverythingButtonClicked(): void {
        console.log(CharacterCreation.name, this.onRandomizeEverythingButtonClicked.name);

        this.selectAncestryCallbacks[Phaser.Math.Between(0, this.ancestriesTexts.length - 2)].call(this);

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

        this.time.delayedCall(550, () => this.scene.start('Game'));
    }
}
