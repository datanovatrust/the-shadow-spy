// src/scenes/SecureMultipartyBossFightScene.js

import { Player } from '../characters/Player.js';
import { SecureMultipartyBoss } from '../enemies/SecureMultipartyBoss.js';

export class SecureMultipartyBossFightScene extends Phaser.Scene {
    constructor() {
        super('SecureMultipartyBossFightScene');
    }

    init(data) {
        this.playerData = data.playerData || {};
    }

    create() {
        // Set world bounds
        this.physics.world.setBounds(0, 0, 800, 600);
    
        // Add background
        this.add.image(400, 300, 'smc_boss_background');
    
        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'he_platform').refreshBody(); // Ground platform
    
        // Additional platforms
        this.platforms.create(200, 400, 'he_platform');
        this.platforms.create(600, 400, 'he_platform');
        this.platforms.create(400, 250, 'he_platform');
    
        // Create the player with existing data
        this.player = new Player(this, 100, 450);
        Object.assign(this.player, this.playerData);
        this.player.scene = this;
    
        // Add collider between player and platforms
        this.physics.add.collider(this.player, this.platforms);
    
        // Initialize Boss Messages BEFORE creating the boss
        this.bossMessageText = this.add.text(400, 50, '', {
            fontSize: '24px',
            fill: '#FFD700',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 },
        });
        this.bossMessageText.setOrigin(0.5);
        this.bossMessageText.setAlpha(0);
    
        // Game status message
        this.statusMessageText = this.add.text(400, 20, '', {
            fontSize: '16px',
            fill: '#FFFFFF',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
        });
        this.statusMessageText.setOrigin(0.5);
        this.statusMessageText.setAlpha(0);
        this.statusMessageText.setScrollFactor(0);
    
        // Initialize Boss Health Bar BEFORE creating the boss
        this.bossHealthBar = this.add.graphics();
    
        // Create the Secure Multiparty Computation boss
        this.createBoss();
    
        // Create HUD
        this.createHUD();
    
        // Create friendlies
        this.createFriendlies();
    
        // Create packages group
        this.packages = this.physics.add.group();
    
        // Spawn packages periodically
        this.time.addEvent({
            delay: 5000,
            callback: this.spawnPackage,
            callbackScope: this,
            loop: true,
        });
    
        // Collisions and overlaps
        this.physics.add.overlap(
            this.player,
            this.packages,
            this.collectPackage,
            null,
            this
        );
    
        this.physics.add.overlap(
            this.player,
            this.friendlies,
            this.deliverPackage,
            null,
            this
        );
    
        // Collision between boss projectiles and player
        this.physics.add.overlap(
            this.player,
            this.boss.projectiles,
            this.handleBossProjectileCollision,
            null,
            this
        );
    
        // Collision between player and boss
        this.physics.add.collider(
            this.player,
            this.boss,
            this.handlePlayerBossCollision,
            null,
            this
        );
    
        // Collision between player's weapon and boss
        this.physics.add.overlap(
            this.player.weapon,
            this.boss,
            this.handleWeaponBossCollision,
            null,
            this
        );
    
        // Collision between player's projectiles and boss
        this.physics.add.overlap(
            this.player.projectiles,
            this.boss,
            this.handleProjectileBossCollision,
            null,
            this
        );
    
        // Initialize package count
        this.deliveredPackages = 0;
    
        // Input for menu
        this.input.keyboard.on('keydown-M', () => {
            this.scene.pause('SecureMultipartyBossFightScene');
            if (this.scene.isActive('MenuScene')) {
                this.scene.bringToTop('MenuScene');
            } else {
                this.scene.launch('MenuScene');
            }
        });
    
        // Add package icon above player
        this.packageIcon = this.add.image(this.player.x, this.player.y - 40, 'smc_package');
        this.packageIcon.setVisible(false);
    }

    createBoss() {
        this.boss = new SecureMultipartyBoss(this, 600, 300);

        // Collision between boss and platforms
        this.physics.add.collider(this.boss, this.platforms);

        // Update boss health bar
        this.updateBossHealthBar();
    }

    createFriendlies() {
        this.friendlies = this.physics.add.group({
            collideWorldBounds: true,
            immovable: false, // Allow movement
        });

        const positions = [
            {
                x: 150,
                y: 500,
                patrolPoints: [
                    { x: 100, y: 500 },
                    { x: 200, y: 500 },
                    { x: 200, y: 400 },
                    { x: 100, y: 400 },
                ],
            },
            {
                x: 650,
                y: 500,
                patrolPoints: [
                    { x: 600, y: 500 },
                    { x: 700, y: 500 },
                    { x: 700, y: 400 },
                    { x: 600, y: 400 },
                ],
            },
            {
                x: 150,
                y: 100,
                patrolPoints: [
                    { x: 100, y: 100 },
                    { x: 200, y: 100 },
                    { x: 200, y: 250 },
                    { x: 100, y: 250 },
                ],
            },
            {
                x: 650,
                y: 100,
                patrolPoints: [
                    { x: 600, y: 100 },
                    { x: 700, y: 100 },
                    { x: 700, y: 250 },
                    { x: 600, y: 250 },
                ],
            },
        ];

        positions.forEach((pos, index) => {
            const friendly = this.friendlies.create(
                pos.x,
                pos.y,
                `smc_friendly${index + 1}`
            );
            friendly.packageReceived = false;
            friendly.body.allowGravity = true;

            // Add patrol points and movement logic
            friendly.patrolPoints = pos.patrolPoints;
            friendly.currentPatrolIndex = 0;

            // Update method for movement
            friendly.update = function () {
                const patrolTarget = this.patrolPoints[this.currentPatrolIndex];
                const dx = patrolTarget.x - this.x;
                const dy = patrolTarget.y - this.y;

                const distance = Phaser.Math.Distance.Between(this.x, this.y, patrolTarget.x, patrolTarget.y);

                if (distance < 5) {
                    // Switch to the next patrol point
                    this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
                } else {
                    const speed = 50;
                    const directionX = Math.sign(dx);
                    this.setVelocityX(directionX * speed);
                    this.flipX = directionX < 0;

                    // Jump if needed
                    if (dy < -5 && this.body.blocked.down) {
                        // Need to go up, so jump
                        this.setVelocityY(-200);
                    }
                }
            };
        });

        // Collision between friendlies and platforms
        this.physics.add.collider(this.friendlies, this.platforms);
    }

    spawnPackage() {
        const x = Phaser.Math.Between(100, 700);
        const y = 0;

        const packageSprite = this.packages.create(x, y, 'smc_package');
        packageSprite.setBounce(0.5);
        packageSprite.setCollideWorldBounds(true);

        // Collision with platforms
        this.physics.add.collider(packageSprite, this.platforms);
    }

    // Updated collectPackage method
    collectPackage(player, packageSprite) {
        if (player.hasPackage) return;

        packageSprite.destroy();
        player.hasPackage = true;
        player.setTexture('player_with_package');
        this.packageIcon.setVisible(true);
        this.showMessage('Package collected!');
        this.updateHUD();
    }

    // Updated deliverPackage method
    deliverPackage(player, friendly) {
        if (player.hasPackage && !friendly.packageReceived) {
            player.hasPackage = false;
            player.setTexture('player');
            friendly.packageReceived = true;
            this.packageIcon.setVisible(false);
            friendly.setTint(0x00ff00);
            this.showMessage('Package delivered!');
            this.deliveredPackages++;
            this.updateHUD();

            // Check if all friendlies have received a package
            const allFriendliesHavePackage = this.friendlies
                .getChildren()
                .every((f) => f.packageReceived);

            if (allFriendliesHavePackage && this.boss.active) {
                // Initiate combined attack after a delay
                this.time.delayedCall(1000, () => {
                    this.friendliesAttack();
                });
            }
        } else if (!player.hasPackage && this.statusMessageText.alpha === 0) {
            this.showMessage('You have no package to deliver!');
        } else if (friendly.packageReceived && this.statusMessageText.alpha === 0) {
            this.showMessage('This friendly already has a package!');
        }
    }

    friendliesAttack() {
        // Fire beams from each friendly to the boss
        this.friendlies.getChildren().forEach((friendly) => {
            this.firePowerfulBeam(friendly);
            friendly.packageReceived = false; // They spend the package
            friendly.clearTint();
        });

        // Apply massive damage to the boss
        const damage = 500; // Adjusted damage
        this.boss.takeDamage(damage);
        this.updateBossHealthBar();

        if (this.boss.health <= 0 && this.boss.active) {
            this.bossDefeated();
        }
    }

    firePowerfulBeam(friendly) {
        // Create a beam from friendly to boss
        const beam = this.add.graphics();
        beam.lineStyle(5, 0xffd700, 1); // Gold color beam
        beam.moveTo(friendly.x, friendly.y);
        beam.lineTo(this.boss.x, this.boss.y);
        beam.strokePath();

        // Animate the beam
        this.tweens.add({
            targets: beam,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                beam.destroy();
            }
        });
    }

    // New showMessage method
    showMessage(text) {
        // Clear any existing tweens on the status message
        this.tweens.killTweensOf(this.statusMessageText);
        
        // Set and show the new message
        this.statusMessageText.setText(text);
        this.statusMessageText.setAlpha(1);

        // Fade out
        this.tweens.add({
            targets: this.statusMessageText,
            alpha: 0,
            duration: 2000,
            ease: 'Linear'
        });
    }

    prepareFriendlyAttack(friendly) {
        // Visual indication
        friendly.setTint(0x00ff00);

        // Delay before attacking
        this.time.delayedCall(1000, () => {
            this.fireAtBoss(friendly);
            friendly.packageReceived = false;
            friendly.clearTint();
        });
    }

    fireAtBoss(friendly) {
        const projectile = this.physics.add.sprite(
            friendly.x,
            friendly.y,
            'projectile'
        );
        this.physics.moveToObject(projectile, this.boss, 300);
        projectile.body.allowGravity = false;

        this.physics.add.overlap(
            projectile,
            this.boss,
            (proj, boss) => {
                proj.destroy();
                boss.takeDamage(100); // Adjust damage as needed
                this.updateBossHealthBar();

                if (boss.health <= 0 && this.boss.active) {
                    this.bossDefeated();
                }
            },
            null,
            this
        );
    }

    handleBossProjectileCollision(player, projectile) {
        projectile.destroy();
        if (player.isInvincible) {
            return;
        }
        player.takeHit({ x: (player.x - projectile.x) * 2, y: -100 });
        player.isInvincible = true;
        player.setTint(0xff0000);
        this.time.delayedCall(1000, () => {
            player.isInvincible = false;
            player.clearTint();
        });
        this.updateHealthDisplay();
    }

    handlePlayerBossCollision(player, boss) {
        if (player.isInvincible) {
            return;
        }
        player.takeHit({ x: (player.x - boss.x) * 2, y: -200 });
        player.isInvincible = true;
        player.setTint(0xff0000);
        this.time.delayedCall(1000, () => {
            player.isInvincible = false;
            player.clearTint();
        });
        this.updateHealthDisplay();
    }

    handleWeaponBossCollision(weapon, boss) {
        if (this.player.isAttacking) {
            const damage = this.player.attackPower;
            boss.takeDamage(damage);
            this.updateBossHealthBar();

            if (boss.health <= 0 && this.boss.active) {
                this.bossDefeated();
            }
        }
    }

    handleProjectileBossCollision(boss, projectile) {
        const damage = this.player.attackPower;
        boss.takeDamage(damage);
        projectile.destroy();
        this.updateBossHealthBar();

        if (boss.health <= 0 && this.boss.active) {
            this.bossDefeated();
        }
    }

    bossDefeated() {
        // Stop boss actions
        if (this.boss.attackEvent) {
            this.boss.attackEvent.remove(false);
        }
        if (this.boss.moveEvent) {
            this.boss.moveEvent.remove(false);
        }
        if (this.boss.spawnMinionEvent) {
            this.boss.spawnMinionEvent.remove(false);
        }

        // Play defeat animation or effects
        this.boss.setTint(0xff0000);
        this.boss.setVelocity(0, 0);
        this.boss.body.enable = false;
        this.boss.active = false;

        // Instead of complex particles, create a simple explosion effect
        const graphics = this.add.graphics();
        graphics.fillStyle(0xff0000, 1);
        graphics.fillCircle(this.boss.x, this.boss.y, 50);

        // Animate the explosion
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            scale: 2,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                graphics.destroy();
            }
        });

        // Screen shake effect
        this.cameras.main.shake(500, 0.02);

        // Flash effect
        this.cameras.main.flash(500, 255, 255, 255);

        // Sound effect
        // this.sound.play('boss_explosion_sound');

        // Destroy boss sprite after a delay
        this.time.delayedCall(1000, () => {
            this.boss.destroy();
        });

        // Destroy any remaining minions
        if (this.boss.minions) {
            this.boss.minions.clear(true, true);
        }

        // Show victory text after delay
        this.time.delayedCall(1500, () => {
            const victoryText = this.add.text(
                400,
                300,
                'You Defeated the Secure Multiparty Boss!',
                {
                    fontSize: '32px',
                    fill: '#00ff00',
                }
            );
            victoryText.setOrigin(0.5);

            // Transition to the next scene or end game after additional delay
            this.time.delayedCall(3000, () => {
                // Proceed to the next level or show credits
                this.scene.start('NextScene', {
                    playerData: this.player.getData(),
                });
            });
        });
    }

    createHUD() {
        // Package count display
        this.packageText = this.add.text(16, 16, 'Packages Delivered: 0', {
            fontSize: '16px',
            fill: '#fff',
        });
        this.packageText.setScrollFactor(0);

        // Player HUD
        this.healthHearts = [];
        this.updateHealthDisplay();

        // Remove Boss Health Bar initialization here
        // this.bossHealthBar = this.add.graphics();
        // this.updateBossHealthBar();

        // PET HUD
        this.petHUD = [];
        const petKeys = ['DP', 'FL', 'HE', 'PE'];
        petKeys.forEach((key, index) => {
            const slot = this.add
                .image(16 + index * 50, 100, 'hud_petSlot')
                .setScrollFactor(0);

            const petIconKey = `petSkill_${this.getPetKeyName(key)}`;
            const petIcon = this.add
                .image(16 + index * 50, 100, petIconKey)
                .setScrollFactor(0);
            petIcon.setVisible(false);

            const keyText = this.add
                .text(16 + index * 50 - 10, 120, `${index + 1}`, {
                    fontSize: '16px',
                    fill: '#fff',
                })
                .setScrollFactor(0);

            this.petHUD.push({ slot, petIcon, keyText, key });
        });

        this.updatePetHUD();
    }

    getPetKeyName(key) {
        switch (key) {
            case 'DP':
                return 'differentialPrivacy';
            case 'FL':
                return 'federatedLearning';
            case 'HE':
                return 'homomorphicEncryption';
            case 'PE':
                return 'polymorphicEncryption';
            default:
                return '';
        }
    }

    updatePetHUD() {
        this.petHUD.forEach((pet) => {
            if (this.player.petSkills[pet.key]) {
                pet.petIcon.setVisible(true);

                if (this.player.activePetEffects[pet.key]) {
                    pet.petIcon.setTint(0x00ff00);
                } else if (this.player.petCooldowns[pet.key] > 0) {
                    pet.petIcon.setTint(0xff0000); // Red tint for cooldown
                } else {
                    pet.petIcon.clearTint();
                }
            }
        });
    }

    bossMessage(message) {
        this.bossMessageText.setText(message);
        this.bossMessageText.setAlpha(1);

        this.tweens.add({
            targets: this.bossMessageText,
            alpha: 0,
            duration: 3000,
            ease: 'Linear',
        });
    }

    updateHUD() {
        this.packageText.setText(
            `Packages Delivered: ${this.deliveredPackages}`
        );
    }

    updateHealthDisplay() {
        this.healthHearts.forEach((heart) => heart.destroy());
        this.healthHearts = [];

        for (let i = 0; i < this.player.health; i++) {
            const heart = this.add
                .image(30 + i * 30, 30, 'heart')
                .setScrollFactor(0);
            this.healthHearts.push(heart);
        }
    }

    updateBossHealthBar() {
        const healthPercentage = Phaser.Math.Clamp(
            this.boss.health / this.boss.maxHealth,
            0,
            1
        );
        this.bossHealthBar.clear();
        this.bossHealthBar.fillStyle(0x000000);
        this.bossHealthBar.fillRect(250, 20, 300, 20);
        this.bossHealthBar.fillStyle(0xff0000);
        this.bossHealthBar.fillRect(250, 20, 300 * healthPercentage, 20);
    }

    update(time, delta) {
        // Update player
        if (this.player && this.player.active) {
            this.player.update();
        }

        // Update boss
        if (this.boss && this.boss.active) {
            this.boss.update(time, delta);
        }

        // Update minions
        if (this.boss.minions) {
            this.boss.minions.getChildren().forEach((minion) => {
                if (minion.active) {
                    minion.update();
                }
            });
        }

        // Update friendlies
        this.friendlies.getChildren().forEach((friendly) => {
            if (friendly.active) {
                friendly.update();
            }
        });

        // Update package icon position
        this.packageIcon.setPosition(this.player.x, this.player.y - 40);
        this.packageIcon.setVisible(this.player.hasPackage);

        // Update PET HUD
        this.updatePetHUD();
    }
}
