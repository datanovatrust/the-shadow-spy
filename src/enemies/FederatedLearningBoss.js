// src/enemies/FederatedLearningBoss.js

import { Minion } from '../enemies/Minion.js'; // Import the Minion class

export class FederatedLearningBoss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'fl_boss');

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.health = 300;
        this.maxHealth = 300;
        this.isShielded = true; // Starts shielded
        this.behaviors = []; // Current behaviors
        this.projectiles = scene.physics.add.group(); // Boss projectiles

        // Set properties
        this.setCollideWorldBounds(true);
        this.body.setSize(64, 64);

        // Initialize data collected from minions
        this.aggregatedData = 0;

        // Boss initial attack event (will be configured in setBehaviors)
        this.attackEvent = null;

        // Initialize behaviors
        this.setBehaviors(['summonMinions']);
    }

    setBehaviors(behaviors) {
        // Clear existing attack event
        if (this.attackEvent) {
            this.attackEvent.remove(false);
        }

        this.behaviors = behaviors;

        // Update shield status based on behaviors
        if (this.behaviors.includes('summonMinions')) {
            this.isShielded = true;
        } else {
            this.isShielded = false;
        }

        // Set up attack event based on behaviors
        this.attackEvent = this.scene.time.addEvent({
            delay: 2000,
            callback: this.performAttack,
            callbackScope: this,
            loop: true,
        });
    }

    performAttack() {
        if (this.behaviors.includes('summonMinions')) {
            this.spawnMinions();
        }
        if (this.behaviors.includes('shootProjectiles')) {
            this.shootProjectiles();
        }
        if (this.behaviors.includes('laserBeam')) {
            this.fireLaserBeam();
        }
    }

    shootProjectiles() {
        // Boss shoots projectiles towards the player
        const angle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            this.scene.player.x,
            this.scene.player.y
        );
        const speed = 300;

        const projectile = this.projectiles.create(
            this.x,
            this.y,
            'boss_projectile'
        );
        this.scene.physics.velocityFromRotation(
            angle,
            speed,
            projectile.body.velocity
        );

        projectile.setCollideWorldBounds(true);
        projectile.body.setAllowGravity(false);

        // Add collision detection with the player in the scene
        this.scene.physics.add.overlap(
            this.scene.player,
            projectile,
            this.scene.handleBossProjectileCollision,
            null,
            this.scene
        );
    }

    spawnMinions() {
        // Boss spawns minions to collect data
        const minionCount = 2; // Number of minions to spawn
        for (let i = 0; i < minionCount; i++) {
            const offsetX = Phaser.Math.Between(-50, 50);
            const minion = new Minion(
                this.scene,
                this.x + offsetX,
                this.y
            );

            // Add to minions group
            this.scene.minions.add(minion);

            // Collision between minion and platforms
            this.scene.physics.add.collider(minion, this.scene.platforms);

            // Ensure minion can interact with the player and projectiles
            this.scene.physics.add.overlap(
                this.scene.player,
                minion,
                this.scene.handlePlayerMinionCollision,
                null,
                this.scene
            );
            this.scene.physics.add.overlap(
                this.scene.player.weapon,
                minion,
                this.scene.handleWeaponMinionCollision,
                null,
                this.scene
            );
            this.scene.physics.add.overlap(
                this.scene.player.projectiles,
                minion,
                this.scene.handleProjectileMinionCollision,
                null,
                this.scene
            );
        }
    }

    aggregateUpdate(data) {
        // Increase aggregated data
        this.aggregatedData += data;

        // Adapt boss behaviors based on aggregated data
        this.adaptBehavior();
    }

    adaptBehavior() {
        // Adjust boss behaviors based on aggregated data
        if (
            this.aggregatedData >= 10 &&
            !this.behaviors.includes('shootProjectiles')
        ) {
            this.behaviors.push('shootProjectiles');
            this.displayBossMessage(
                'The boss has learned to shoot projectiles!'
            );
        }
        if (
            this.aggregatedData >= 20 &&
            !this.behaviors.includes('laserBeam')
        ) {
            this.behaviors.push('laserBeam');
            this.displayBossMessage('The boss has learned the laser beam!');
        }
    }

    displayBossMessage(message) {
        const bossMessage = this.scene.add
            .text(this.x, this.y - 50, message, {
                fontSize: '16px',
                fill: '#ff0000',
                backgroundColor: '#000000',
                padding: { x: 5, y: 2 },
            })
            .setOrigin(0.5);

        this.scene.time.delayedCall(2000, () => {
            bossMessage.destroy();
        });
    }

    fireLaserBeam() {
        // Boss fires a powerful laser beam towards the player
        const laserDuration = 2000; // Duration of the laser in milliseconds

        // Visual effect for charging
        const chargingEffect = this.scene.add.sprite(
            this.x,
            this.y,
            'laser_charge_frame1'
        );
        chargingEffect.play('laser_charge_anim');

        // Adjust depth to ensure the charging effect is visible above other elements
        chargingEffect.setDepth(1);

        this.scene.time.delayedCall(1000, () => {
            chargingEffect.destroy();

            // Create laser beam
            const laser = this.scene.add
                .rectangle(this.x, this.y, 800, 10, 0xff0000)
                .setOrigin(0.5);
            this.scene.physics.add.existing(laser);
            laser.body.setAllowGravity(false);
            laser.body.setImmovable(true);

            // Adjust depth to ensure the laser beam is above other elements
            laser.setDepth(1);

            // Collision with player
            this.scene.physics.add.overlap(
                this.scene.player,
                laser,
                () => {
                    if (!this.scene.player.isInvincible) {
                        this.scene.player.takeHit({ x: -200, y: 0 });
                        this.scene.player.isInvincible = true;
                        this.scene.player.setTint(0xff0000);
                        this.scene.time.delayedCall(1000, () => {
                            this.scene.player.isInvincible = false;
                            this.scene.player.clearTint();
                        });
                        this.scene.updateHealthDisplay();
                    }
                },
                null,
                this
            );

            // Laser beam duration
            this.scene.time.delayedCall(laserDuration, () => {
                laser.destroy();
            });
        });
    }

    update(time, delta) {
        // Boss movement logic
        // For added challenge, the boss can move towards or away from the player
        if (this.behaviors.includes('move')) {
            this.scene.physics.moveToObject(this, this.scene.player, 50);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
        });
        // Check for phase update
        this.scene.updateBossPhase();
    }
}
