import Phaser from 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, public x: number, public y: number, targetX: number, targetY: number) {
        super(scene, x, y, 'fireball'); // 'fireball' = clé de l'image préchargée

        scene.physics.world.enable(this);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.1);
        this.setCollideWorldBounds(false);

        // Calcul de la direction
        const direction = new Phaser.Math.Vector2(targetX - x, targetY - y).normalize();

        const speed = 3000;
        this.setVelocity(direction.x * speed, direction.y * speed);
    }
    destroy() {
        console.info('destroy')
    }

}
