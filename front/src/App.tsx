import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameScene from "./game/scenes/GameScene.ts";

declare global {
    interface Window {
        udp: {
            send: (message: string, port: number, host: string) => void;
            onMessage: (callback: (msg: string) => void) => void;
        };
    }
}

const App = () => {
    const phaserRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!phaserRef.current) return;
        console.info(window.innerWidth, window.innerHeight)
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: phaserRef.current,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0, x: 0 },
                    debug: true,
                },
            },
            scene: [GameScene]
        };

        new Phaser.Game(config);
    }, []);

    return <div ref={phaserRef} />;
};

export default App;

