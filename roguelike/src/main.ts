import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Game, Types } from "phaser";
import { PressAnyKey } from './scenes/PressAnyKey';
import { ScreenBackgroundColor } from './scenes/ScreenBackgroundColor';
import { CharacterCreation } from './scenes/CharacterCreation';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import { GameplayUi } from './scenes/GameplayUi';
import { LevelRenderer } from './scenes/LevelRenderer';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    parent: 'game-container',
    dom: {
        createContainer: true
    },
    plugins: {
		scene: [
			{
				key: 'rexUI',
				plugin: RexUIPlugin,
				mapping: 'rexUI'
			}
		]
    },
    backgroundColor: '#000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        ScreenBackgroundColor,
        Preloader,
        PressAnyKey,
        MainMenu,
        CharacterCreation,
        MainGame,
        GameplayUi,
        LevelRenderer,
        GameOver
    ]
};

export default new Game(config);
