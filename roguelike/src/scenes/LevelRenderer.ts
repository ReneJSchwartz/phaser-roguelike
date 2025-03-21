import { GameObjects, Scene } from "phaser";
import { Level } from "../dungeon-utils/level";
import { EntityConfig } from "../interfaces/entity-config";
import { GameplayUi } from "./GameplayUi";
import { Player } from "../entities/entities";

/** 
 * Renders parts of the level what will become visible to the player.
 * 
 * Does most of its job at the beginning of level where it spawns gameobjects
 * which can act independently.
 */
export class LevelRenderer extends Scene {
    // Level grid construction.
    /** Level grid cell's width. Each cell houses an ASCII character. */
    private cellWidth: number = 0;
    /** Level grid cell's height. Each cell houses an ASCII character. */
    private cellHeight: number = 0;
    /** Where the level/map edge should be drawn measured from left. */
    private gridStartX: number = 0;
    /** Where the level/map edge should be drawn measured from top. */
    private gridStartY: number = 0;
    /** Instance as access pattern for singletonish LevelRenderer. */
    public static Instance: LevelRenderer;

    /** 
     * Style and other info for spawned entities that can be used when 
     * spawning the entities. Important things are color, possible bg color,
     * placement info, and description. 
     * EntityConfig can be extended to have custom spawn rules.
     */
    private entitySpawnConfigs: Map<string, EntityConfig> = new Map<string, EntityConfig>([
        ['@', { textStyle: {}, description: "That's me!" }],
        // Environment
        ['.', { textStyle: { color: "#51553DFF" }, description: 'Ground' }],
        ['#', { textStyle: { color: "#cccccc", backgroundColor: "#424242FF" }, description: 'Stone wall' }],
        ['=', { textStyle: { color: "#FFFFFFFF", backgroundColor: "#644A22FF" }, description: 'Wooden door' }],
        ['~', { textStyle: { color: "#ffffff", backgroundColor: "#644A22FF" }, description: 'Writing' }],
        ['ȹ', { textStyle: { color: "#00AA5BFF", padding: { bottom: 20 } }, description: 'Tree' }],
        ['^', { textStyle: { color: "#ffffff", backgroundColor: '#41473FFF' }, description: 'Ascend' }],
        ['⚘', { textStyle: { color: "#40CE2EFF", }, description: 'Flower' }],
        ['⚶', { textStyle: { color: "#397E00FF", }, description: 'Tree' }],
        [':', { textStyle: { color: "#224B01FF", }, description: 'Rock paving' }],
        // Enemies
        ['W', { textStyle: { color: "#ff8000", }, description: 'Wurm' }],
        ['i', { textStyle: { color: "#ff8000", }, description: 'Imp' }],
        ['T', { textStyle: { color: "#ff8000", }, description: 'Troll' }],
        ['C', { textStyle: { color: "#ff8000", }, description: 'Centipede' }],
        ['h', { textStyle: { color: "#ff8000", }, description: 'Hobgoblin' }],
    ]);

    /** Creates class instance. */
    constructor() {
        super('LevelRenderer');
        LevelRenderer.Instance = this;
    }

    /** 
     * Configures level grid parameters and optionally can show the grid 
     * if needed for debugging purposes.
     */
    create() {
        console.log(LevelRenderer.name, 'create');
        const { width, height } = this.scale;
        this.cellWidth = width * 0.02;
        this.cellHeight = width * 0.028;
        this.gridStartX = width * 0.5 - 4.5 * this.cellWidth;
        this.gridStartY = height * 0.077;

        const showGrid: boolean = false;
        if (showGrid) {
            this.add.grid(
                this.gridStartX - this.cellWidth * 0.25,
                this.gridStartY - this.cellHeight * 0.5,
                this.cellWidth * 10,
                this.cellHeight * 10,
                this.cellWidth,
                this.cellHeight,
                0xffffff,
                0.2,
                0xffffff,
                1
            )
                .setOrigin(0);
        }
    }

    /** Spawns everything else but monsters and player. */
    public spawnMapEntities(): void {
        // Old entities are destroyed at this point
        for (let i = 0; i < Level.dungeonBaseLayer.length; i++) {
            const row = Level.dungeonBaseLayer[i];

            for (let j = 0; j < row.length; j++) {
                const char = this.add.text(
                    this.gridX(j),
                    this.gridY(i),
                    row[j],
                    { fontSize: 52, ...this.entitySpawnConfigs.get(row[j])?.textStyle }
                )
                    .setOrigin(0.5, 0.5)
                    .setInteractive()
                    .on('pointerover', () => {
                        GameplayUi.Instance.updateYouSeeText(
                            this.entitySpawnConfigs.get(row[j])?.description ?? '');
                    })
                    .on('pointerout', () => {
                        // Prevents 'Wall' desc. from lingering if cursor exits
                        // the play area where wall is the outermost char.
                        GameplayUi.Instance.updateYouSeeText('');
                    });
                Level.baseLayerTexts.set(`${i},${j}`, char);
            }
        }
        this.spawnPlayer();
        this.spawnMonsters();
    }

    /** Spawns player to field. */
    private spawnPlayer(): void {
        const x = Player.Instance.x;
        const y = Player.Instance.y;
        const char: GameObjects.Text = this.add.text(
            this.gridX(x), this.gridY(y), '@',
            { fontSize: 52, ...this.entitySpawnConfigs.get('@')?.textStyle }
        )
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerover', () => {
                GameplayUi.Instance.updateYouSeeText(
                    this.entitySpawnConfigs.get('@')?.description ?? '');
            });

        Player.Instance.charText = char;
        Level.baseLayerTexts.get(`${Player.Instance.y},${Player.Instance.x}`)?.setAlpha(0);
    }

    /** Spawns monsters to field. */
    private spawnMonsters(): void {
        Level.dungeonMonsters.forEach((m) => {
            const char: GameObjects.Text = this.add.text(
                this.gridX(m.x), this.gridY(m.y), m.character,
                { fontSize: 52, ...this.entitySpawnConfigs.get(m.character)?.textStyle }
            )
                .setOrigin(0.5, 0.5)
                .setInteractive()
                .on('pointerover', () => {
                    GameplayUi.Instance.updateYouSeeText(
                        this.entitySpawnConfigs.get(m.character)?.description ?? '');
                });

            m.charText = char;
            Level.baseLayerTexts.get(`${m.y},${m.x}`)?.setAlpha(0);
        })
    }

    /** 
     * Returns tile's x or y coordinate from grid/tile coordinate.
     * 
     * @param horizontalTileNumber How many tiles from left edge the char is at.
     * @returns Where to place a grid cell's char on screen's x-position.
     */
    public gridX(horizontalTileNumber: number): number {
        return this.gridStartX + horizontalTileNumber * this.cellWidth
    }

    /** 
     * Returns tile's x or y coordinate from grid/tile coordinate.
     * 
     * @param verticalTileNumber How many tiles from top edge the char is at.
     * @returns Where to place a grid cell's char on screen's x-position.
     */
    public gridY(verticalTileNumber: number): number {
        return this.gridStartY + verticalTileNumber * this.cellHeight
    }

    /** 
     * Can be used to redraw the things that were hidden 
     * because previous tile owner/entity appeared to the tile.
     * 
     * @param x Horizontal tile.
     * @param y Vertical tile.
     */
    public entityLeaveTile(x: number, y: number): void {
        Level.baseLayerTexts.get(`${y},${x}`)?.setAlpha(1);
    }
}
