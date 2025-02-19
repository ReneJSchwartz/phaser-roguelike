import { Scene, GameObjects, Actions } from 'phaser';
import { Game } from './Game';
import { ScreenBackgroundColor } from './ScreenBackgroundColor';
import { Ancestries, Ancestry } from '../character-creation/ancestries';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'

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

    private rexUI: RexUIPlugin;

    constructor() {
        super('CharacterCreation');
    }

    create() {
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
        const ancestrySectionContainer = this.add.container(width * 0.04, height * 0.10);
        const ancestryBoxOutline = this.add.rectangle(0, 0, width * 0.15, height * 0.26)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff);
        const ancestrySectionTitle = this.add.text(padding, padding, 'Ancestry')
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

        // Info box provides info on what is currently selected.
        const infoBoxSectionContainer = this.add.container(width * 0.70, height * 0.1)
            .setAlpha(0);
        const infoBoxBg = this.add.rectangle(0, 0, width * 0.26, height * 0.8)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff);
        this.infoBoxTitle = this.add.text(padding, padding, 'Info - Human')
            .setOrigin(0, 0)
            .setStyle({ fontSize: 32 });
        this.infoBoxContent = this.add.text(padding, em * 2.5, Ancestries.catfolk.description)
            .setOrigin(0, 0)
            .setStyle({ fontSize: 28, wordWrap: { width: width * 0.245 } });
        infoBoxSectionContainer.add([infoBoxBg, this.infoBoxTitle, this.infoBoxContent]);

        this.tweens.add({
            targets: this.children.list,
            alpha: 1
        });

        this.selectAncestry(selectableAncestries[0], ancestriesTexts, 0);
    }

    /** Populates info box and possibly controls attribute selection requirements. */
    private selectAncestry(ancestry: Ancestry, options: GameObjects.Text[], index: number): void {
        console.log(ancestry.name);
        if (ancestry.name === 'Random') {
            const selectableAncestries: Ancestry[] = [Ancestries.human, Ancestries.catfolk, Ancestries.houseElf, Ancestries.dwarf, Ancestries.gnome, Ancestries.random];
            const randInt: number = Phaser.Math.Between(0, selectableAncestries.length - 2); 
            this.selectAncestry(selectableAncestries[randInt], options, randInt);
            return;
        }


        this.infoBoxTitle.text = 'Info - ' + ancestry.name;
        this.infoBoxContent.text = ancestry.description;

        // Visually show that the new ancestry is selected and the old ones are not.
        for (let i = 0; i < options.length; i++) {
            options[i].setColor(i === index ? '#fff' : '#666');
        }
    }


    /** Loads a new game and initiates visual effects. */
    private onStartNewGameButtonClicked(): void {
        console.log(this.onStartNewGameButtonClicked.name);

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
