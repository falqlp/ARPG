import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    scene: [GameScene],
    parent: 'phaser-container',
};
