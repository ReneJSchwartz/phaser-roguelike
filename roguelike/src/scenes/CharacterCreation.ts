import { Scene, GameObjects, Actions } from 'phaser';
import { Game } from './Game';
import { ScreenBackgroundColor } from './ScreenBackgroundColor';
import { Ancestries, Ancestry } from '../character-creation/ancestries';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import { MainMenu } from './MainMenu';

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
    /** Saved so that randomization can pick a different new random ancestry every time. */
    private lastChosenAncestryIndex: number = 42;
    /** Has UI components for example for layout groups or a text field. */
    private rexUI: RexUIPlugin;

    constructor() {
        super('CharacterCreation');
    }

    create() {
        this.shouldProcessButtonPresses = true;

        const { width, height } = this.scale;
        /** Font y-size. */
        const em: number = 28
        /** Padding for text from section borders. */
        const padding: number = em * 0.5;

        // View title
        this.add.text(width * 0.5, height * 0.05,
            this.screenName, {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6, align: 'center'
        })
            .setOrigin(0.5)
            .setAlpha(0);

        // Different containerized selection sections in the screen

        // Ancestry is the first thing on top left
        const ancestrySectionContainer: GameObjects.Container = this.add.container(width * 0.04, height * 0.10);
        const ancestryBoxOutline: GameObjects.Rectangle = this.add.rectangle(0, 0, width * 0.15, height * 0.26)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff);
        const ancestrySectionTitle: GameObjects.Text = this.add.text(padding, padding, 'Ancestry')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 });
        // Make ancestries list.
        const selectableAncestries: Ancestry[] = [Ancestries.human, Ancestries.catfolk, Ancestries.houseElf, Ancestries.dwarf, Ancestries.gnome, Ancestries.random];
        const ancestriesTexts: GameObjects.Text[] = [];
        for (let index = 0; index < selectableAncestries.length; index++) {
            const t = this.add.text(padding, em * 2 + index * em, '  ' + selectableAncestries[index].name)
                .setOrigin(0, 0)
                .setStyle({ fontSize: 28 })
                .setInteractive()
                .on('pointerdown', () => this.selectAncestry(selectableAncestries[index], ancestriesTexts, index));
            ancestriesTexts.push(t);
            ancestrySectionContainer.add(t);
        }
        ancestrySectionContainer.add([ancestryBoxOutline, ancestrySectionTitle])
            .setAlpha(0);

        // Next section can be for backgrounds or inventory or spells or starting equipment
        const nextSectionContainer: GameObjects.Container = this.add.container(width * 0.21, height * 0.10);
        const nextSectionOutline: GameObjects.Rectangle = this.add.rectangle(0, 0, width * 0.42, height * 0.26)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff);
        const nextSectionTitle: GameObjects.Text = this.add.text(padding, padding, 'Coming soon!')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 });
        nextSectionContainer.add([nextSectionOutline, nextSectionTitle])
            .setAlpha(0);

        // Attribute points section.
        const attributesSectionContainer: GameObjects.Container = this.add.container(width * 0.04, height * 0.395);
        const attributesSectionOutline: GameObjects.Rectangle = this.add.rectangle(0, 0, width * 0.59, height * 0.35)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff);
        const attributesSectionTitle = this.add.text(padding, padding, 'Attributes (5 remaining)')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 });
        const attributesSectionRandomizeText = this.add.text(width * 0.35, padding, '[Randomize]')
            .setOrigin(0)
            .setStyle({ fontSize: 28 })
            .setInteractive()
            .on('pointerdown', () => { console.log('test');/* randomizeAttributePoints(); */ });
        attributesSectionContainer.add([attributesSectionOutline, attributesSectionTitle, attributesSectionRandomizeText])
            .setAlpha(0);

        // Info box provides info on what is currently selected.
        const infoBoxSectionContainer: GameObjects.Container = this.add.container(width * 0.65, height * 0.1)
            .setAlpha(0);
        const infoBoxOutline: GameObjects.Rectangle = this.add.rectangle(0, 0, width * 0.31, height * 0.8)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff);
        this.infoBoxTitle = this.add.text(padding, padding, 'Info - Human')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 });
        this.infoBoxContent = this.add.text(padding, em * 2.5, Ancestries.catfolk.description)
            .setOrigin(0, 0)
            .setStyle({ fontSize: 28, wordWrap: { width: width * 0.3 } });
        infoBoxSectionContainer.add([infoBoxOutline, this.infoBoxTitle, this.infoBoxContent]);

        // Bottom text buttons for starting the game, randomizing everything or going back to menu.
        const startGameButton: GameObjects.Text = this.add.text(width * 0.04, height * 0.93, 'Start Game')
            .setOrigin(0)
            .setStyle({ fontSize: 32 })
            .setInteractive()
            .on('pointerdown', () => { this.onFinishCharacterCreationAndStartNewGameButtonClicked(); });

        const randomizeEverythingButton: GameObjects.Text = this.add.text(width * 0.22, height * 0.93, 'Randomize Everything')
            .setOrigin(0)
            .setStyle({ fontSize: 32 })
            .setInteractive()
            .on('pointerdown', () => { this.onRandomizeEverythingButtonClicked(); });

        const backToMenuButton: GameObjects.Text = this.add.text(width * 0.52, height * 0.93, 'Back To Menu')
            .setOrigin(0)
            .setStyle({ fontSize: 32 })
            .setInteractive()
            .on('pointerdown', () => { this.onBackToMenuButtonClicked(); });

        this.tweens.add({
            targets: this.children.list,
            alpha: 1
        });

        this.selectAncestry(selectableAncestries[0], ancestriesTexts, 0);
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

            let randInt: number;// = Phaser.Math.Between(0, selectableAncestries.length - 2);
            do {
                randInt = Phaser.Math.Between(0, selectableAncestries.length - 2);
            } while (randInt === this.lastChosenAncestryIndex)

            this.selectAncestry(selectableAncestries[randInt], options, randInt);
            return;
        }

        this.lastChosenAncestryIndex = index;
        this.infoBoxTitle.text = 'Info - ' + ancestry.name;
        this.infoBoxContent.text = ancestry.description;

        // Visually show that the new ancestry is selected and the old ones are not.
        for (let i = 0; i < options.length; i++) {
            options[i].setColor(i === index ? '#fff' : '#666');
        }
    }

    /** Randomizes ancestry, attribute points and other things in the screen if any such as name. */
    private onRandomizeEverythingButtonClicked(): void {
        console.log(this.onRandomizeEverythingButtonClicked.name);

        // todo reroll ancestry

        // todo randomize attributes
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
