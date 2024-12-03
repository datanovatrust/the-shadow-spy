// src/enemies/SecureMultipartyBoss.js

export class SecureMultipartyBoss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'smc_boss');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.health = 1500; // Increased health
        this.maxHealth = 1500;

        // Boss properties
        this.setCollideWorldBounds(true);
        this.body.setSize(120, 120);
        this.body.allowGravity = false;

        // Boss movement properties
        this.speed = 100;
        this.movePoints = [
            { x: 600, y: 300 },
            { x: 200, y: 300 },
            { x: 400, y: 100 },
            { x: 400, y: 500 },
        ];
        this.currentMovePoint = 0;

        // Boss phases
        this.currentPhase = 1;

        // Boss attacks
        this.projectiles = scene.physics.add.group();

        // Initialize minions group to prevent errors
        this.minions = scene.physics.add.group();

        // Start the boss behavior
        this.startPhase(this.currentPhase);
    }

    startPhase(phase) {
        // Clean up previous phase events
        if (this.attackEvent) {
            this.attackEvent.remove(false);
        }
        if (this.moveEvent) {
            this.moveEvent.remove(false);
        }
        if (this.spawnMinionEvent) {
            this.spawnMinionEvent.remove(false);
        }

        switch (phase) {
            case 1:
                this.phaseOne();
                break;
            case 2:
                this.phaseTwo();
                break;
            case 3:
                this.phaseThree();
                break;
            default:
                break;
        }
    }

    phaseOne() {
        // Phase 1: Basic attacks and movement
        this.attackEvent = this.scene.time.addEvent({
            delay: 2000,
            callback: this.fireAtPlayer,
            callbackScope: this,
            loop: true,
        });

        // Start moving
        this.moveEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.moveToNextPoint,
            callbackScope: this,
            loop: true,
        });

        this.scene.bossMessage('Phase 1: Initialization');
    }

    phaseTwo() {
        // Phase 2: Increased attack frequency and minions
        this.attackEvent = this.scene.time.addEvent({
            delay: 1500,
            callback: this.fireAtPlayer,
            callbackScope: this,
            loop: true,
        });

        // Spawn minions
        this.spawnMinionEvent = this.scene.time.addEvent({
            delay: 5000,
            callback: this.spawnMinion,
            callbackScope: this,
            loop: true,
        });

        this.scene.bossMessage('Phase 2: Distributed Attack');
    }

    phaseThree() {
        // Phase 3: Aggressive attacks and faster movement
        this.attackEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.fireAtPlayer,
            callbackScope: this,
            loop: true,
        });

        // More aggressive movement
        this.speed = 150;

        this.scene.bossMessage('Phase 3: Final Computation');
    }

    moveToNextPoint() {
        if (!this.active) return;

        this.currentMovePoint = (this.currentMovePoint + 1) % this.movePoints.length;
        const target = this.movePoints[this.currentMovePoint];

        this.scene.physics.moveTo(this, target.x, target.y, this.speed);
    }

    fireAtPlayer() {
        if (!this.active) return;

        const projectile = this.projectiles.create(this.x, this.y, 'boss_projectile');
        this.scene.physics.moveToObject(projectile, this.scene.player, 200);
        projectile.body.allowGravity = false;

        this.scene.physics.add.overlap(
            projectile,
            this.scene.player,
            (player, proj) => {
                proj.destroy();
                if (player.isInvincible) return;
                player.takeHit({ x: (player.x - proj.x) * 2, y: -100 });
                player.isInvincible = true;
                player.setTint(0xff0000);
                this.scene.time.delayedCall(1000, () => {
                    player.isInvincible = false;
                    player.clearTint();
                });
                this.scene.updateHealthDisplay();
            },
            null,
            this.scene
        );
    }

    spawnMinion() {
        if (!this.active) return;

        const minion = this.minions.create(this.x, this.y, 'he_minion');
        minion.setCollideWorldBounds(true);
        minion.body.allowGravity = true;
        minion.health = 3;

        // Collision between minion and platforms
        this.scene.physics.add.collider(minion, this.scene.platforms);

        // Minion behavior
        minion.update = function () {
            if (!this.active || !this.scene.player) return;

            const speed = 100;
            const player = this.scene.player;

            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const angle = Math.atan2(dy, dx);

            this.setVelocityX(Math.cos(angle) * speed);

            if (dy < -50 && this.body.blocked.down) {
                this.setVelocityY(-300);
            }

            this.flipX = dx < 0;
        };

        this.scene.events.on('update', minion.update, minion);

        // Collision with player
        this.scene.physics.add.overlap(
            this.scene.player,
            minion,
            (player, minion) => {
                if (player.isInvincible) return;
                player.takeHit({ x: (player.x - minion.x) * 2, y: -100 });
                player.isInvincible = true;
                player.setTint(0xff0000);
                this.scene.time.delayedCall(1000, () => {
                    player.isInvincible = false;
                    player.clearTint();
                });
                minion.destroy();
            },
            null,
            this.scene
        );

        // Collision with player's weapon
        this.scene.physics.add.overlap(
            this.scene.player.weapon,
            minion,
            (weapon, minion) => {
                if (this.scene.player.isAttacking) {
                    minion.health -= this.scene.player.attackPower;
                    if (minion.health <= 0) {
                        minion.destroy();
                    }
                }
            },
            null,
            this.scene
        );

        // Collision with player's projectiles
        this.scene.physics.add.overlap(
            this.scene.player.projectiles,
            minion,
            (projectile, minion) => {
                minion.health -= this.scene.player.attackPower;
                projectile.destroy();
                if (minion.health <= 0) {
                    minion.destroy();
                }
            },
            null,
            this.scene
        );

        minion.on('destroy', () => {
            this.scene.events.off('update', minion.update, minion);
        });
    }

    takeDamage(amount) {
        this.health -= amount;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
        });

        const healthPercentage = this.health / this.maxHealth;
        if (healthPercentage <= 0.66 && this.currentPhase === 1) {
            this.currentPhase = 2;
            this.startPhase(this.currentPhase);
        } else if (healthPercentage <= 0.33 && this.currentPhase === 2) {
            this.currentPhase = 3;
            this.startPhase(this.currentPhase);
        }
    }

    update() {
        if (!this.active) return;

        // If reached target point, stop moving
        const target = this.movePoints[this.currentMovePoint];
        const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
        if (distance < 10) {
            this.setVelocity(0, 0);
        }
    }

    destroy(fromScene) {
        // Clean up events
        if (this.attackEvent) {
            this.attackEvent.remove(false);
        }
        if (this.moveEvent) {
            this.moveEvent.remove(false);
        }
        if (this.spawnMinionEvent) {
            this.spawnMinionEvent.remove(false);
        }

        // Clean up projectiles
        this.projectiles.clear(true, true);

        // Clean up minions
        if (this.minions) {
            this.minions.clear(true, true);
        }

        super.destroy(fromScene);
    }
}
