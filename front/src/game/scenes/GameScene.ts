import Phaser from 'phaser';
import Projectile from "../object/Projectile.ts";

export default class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private velocityX = 0;
    private velocityY = 0;
// plus grand = accélère plus vite
    private maxSpeed = 200;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.spritesheet('sorcier', '/src/assets/fire-Photoroom.png', {
            frameWidth: 220,
            frameHeight: 315,
        });
        this.load.image('fireball', '/src/assets/fireball.png'); // Mets une image de boule de feu ici

    }

    create() {
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('sorcier', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('sorcier', { start: 3, end: 5 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('sorcier', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('sorcier', { start: 5, end: 8 }),
            frameRate: 5,
            repeat: -1
        });

        // Centrage
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Ajout du joueur avec physics
        this.player = this.physics.add.sprite(centerX, centerY, 'sorcier');
        this.player.setOrigin(0.5);
        this.player.setCollideWorldBounds(true); // pour ne pas sortir de l'écran

        // Initialiser les touches fléchées
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.scale.on('resize', (gameSize:{width:number; height:number}) => {
            const { width, height } = gameSize;
            this.cameras.resize(width, height);
        }, this);

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const { x, y } = this.player;

            new Projectile(this, x, y, pointer.worldX, pointer.worldY);

        });
    }

    update() {
        let targetVX = 0;
        let targetVY = 0;

        if (this.cursors.left?.isDown) {
            targetVX = -1;
        } else if (this.cursors.right?.isDown) {
            targetVX = 1;
        }

        if (this.cursors.up?.isDown) {
            targetVY = -1;
        } else if (this.cursors.down?.isDown) {
            targetVY = 1;
        }

// Créer un vecteur direction
        const target = new Phaser.Math.Vector2(targetVX, targetVY);

// Normaliser pour éviter que la diagonale soit plus rapide
        if (target.length() > 0) {
            target.normalize().scale(this.maxSpeed);
        }

// Interpolation fluide de la vitesse vers la cible
        this.velocityX = Phaser.Math.Linear(this.velocityX, target.x, 0.1);
        this.velocityY = Phaser.Math.Linear(this.velocityY, target.y, 0.1);

        if (Math.abs(this.velocityX) < 1) {
            this.velocityX = 0;
        }
        if (Math.abs(this.velocityY) < 1) {
            this.velocityY = 0;
        }

// Appliquer la vélocité
        this.player.setVelocity(this.velocityX, this.velocityY);

        // Jouer une animation selon la direction
        if (this.velocityX > 0) {
            this.player.anims.play('walk-right', true);
        } else if (this.velocityX < 0) {
            this.player.anims.play('walk-left', true);
        } else if (this.velocityY > 0) {
            this.player.anims.play('walk-down', true);
        } else if (this.velocityY < 0) {
            this.player.anims.play('walk-up', true);
        } else {
            this.player.anims.stop();
        }
    }

}
