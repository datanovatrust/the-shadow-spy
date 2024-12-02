// src/enemies/HomomorphicEncryptionBoss.js

export class HomomorphicEncryptionBoss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'he_boss_phase1');
    
        scene.add.existing(this);
        scene.physics.add.existing(this);
    
        this.scene = scene;
        this.health = 500;
        this.maxHealth = 500;
        this.isEncrypted = true;
        this.projectiles = scene.physics.add.group();
        this.phaseParticles = null;  // Track particle emitters
    
        // Boss properties
        this.setCollideWorldBounds(true);
        this.body.setSize(60, 60);
        this.body.allowGravity = false;
        
        // Hovering animation properties
        this.hoverY = y;
        this.hoverAmplitude = 50;
        this.hoverSpeed = 0.002;
        this.hoverTime = 0;
    
        // Movement properties
        this.speed = 100;
        this.direction = 'left';
        this.currentPlatformIndex = 0;
        
        // Define boss movement platforms/positions
        this.movePositions = [
            { x: 200, y: 200 },
            { x: 600, y: 200 },
            { x: 400, y: 300 },
            { x: 200, y: 400 },
            { x: 600, y: 400 }
        ];
    
        // Minions group and key tracking
        this.minions = scene.physics.add.group();
        this.decryptionKeysCollected = 0;
    
        // Set up periodic key spawning
        this.keySpawnTimer = scene.time.addEvent({
            delay: 15000,
            callback: this.spawnRandomKey,
            callbackScope: this,
            loop: true
        });
    
        // Initialize active messages array before starting phases
        this.activeMessages = [];
    
        // Initialize first phase
        this.currentPhase = 1;
        this.startPhase(this.currentPhase);
    }

    showPhase(phase) {
        // Clean up existing particles
        if (this.phaseParticles) {
            this.phaseParticles.destroy();
            this.phaseParticles = null;
        }
    
        // Update the boss texture
        this.setTexture(`he_boss_phase${phase}`);
        
        // Add a flash effect for the transition
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0.3, to: 1 },
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                // Only create particles if the texture exists
                if (this.scene.textures.exists('particle')) {
                    if (phase === 2) {
                        this.createPhaseParticles(0xFF10F0, 1000, 20);
                    } else if (phase === 3) {
                        this.createPhaseParticles(0x00FFFF, 1500, 30);
                    }
                } else {
                    console.warn('Particle texture missing!');
                }
            }
        });
    }

    startPhase(phase) {
        // Update the boss texture and show phase effects
        this.showPhase(phase);
        
        // Create a copy of the old platforms array
        const oldPlatforms = this.scene.platforms.getChildren().slice();
        
        // Create new platforms but make them invisible initially
        let newPlatforms;
        switch (phase) {
            case 1:
                newPlatforms = this.createPhaseOnePlatforms();
                break;
            case 2:
                newPlatforms = this.createPhaseTwoPlatforms();
                break;
            case 3:
                newPlatforms = this.createPhaseThreePlatforms();
                break;
        }

        // Make new platforms solid immediately
        newPlatforms.forEach(platform => {
            platform.setAlpha(0);
            platform.setScale(0.5);
            platform.body.enable = true;           // Make sure physics body is enabled
            platform.body.checkCollision.none = false;  // Enable collisions
            platform.refreshBody();                // Refresh the physics body
        });
        
        // Remove old platform collisions before destroying them
        oldPlatforms.forEach(platform => {
            platform.body.checkCollision.none = true;  // Disable collisions
            this.scene.tweens.add({
                targets: platform,
                alpha: 0,
                y: platform.y - 100,
                scale: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => platform.destroy()
            });
        });
        
        // Animate new platforms in
        newPlatforms.forEach(platform => {
            this.scene.tweens.add({
                targets: platform,
                alpha: 1,
                scale: 0.8,
                duration: 1200,
                ease: 'Back.easeOut',
                delay: 500,
                onUpdate: () => {
                    if (platform.active) {
                        platform.refreshBody();  // Keep physics body updated
                    }
                },
                onComplete: () => {
                    if (platform.active) {
                        platform.refreshBody();  // Final physics body update
                    }
                }
            });
        });
        
        // Start phase-specific behavior
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
        }
    }

    createPhaseOnePlatforms() {
        const platforms = [
            { x: 400, y: 500 },  // Ground platform
            { x: 200, y: 400 },  // Left platform
            { x: 600, y: 400 },  // Right platform
            { x: 400, y: 300 },  // Middle platform
            { x: 200, y: 200 },  // Upper left platform
            { x: 600, y: 200 }   // Upper right platform
        ];
    
        return platforms.map(plat => {
            const platform = this.scene.platforms.create(plat.x, plat.y, 'he_platform');
            platform.setScale(0.8);
            platform.refreshBody();
            platform.setAlpha(0);
            
            // Animate in
            this.scene.tweens.add({
                targets: platform,
                alpha: 1,
                scale: { from: 0.5, to: 0.8 },
                duration: 1200,
                ease: 'Back.easeOut',
                onComplete: () => {
                    if (platform.active) {  // Check if platform still exists
                        platform.refreshBody();
                    }
                }
            });
            
            return platform;
        });
    }
    
    createPhaseTwoPlatforms() {
        const platforms = [
            { x: 400, y: 500 },  // Ground
            { x: 150, y: 400 },  // Left
            { x: 650, y: 400 },  // Right
            { x: 400, y: 350 },  // Middle
            { x: 250, y: 250 },  // Upper left
            { x: 550, y: 250 },  // Upper right
            { x: 400, y: 200 }   // Top
        ];
    
        return platforms.map(plat => {
            const platform = this.scene.platforms.create(plat.x, plat.y, 'he_platform');
            platform.setScale(0.8);
            platform.refreshBody();
            platform.setAlpha(0);
            
            // Initial animation
            this.scene.tweens.add({
                targets: platform,
                alpha: 1,
                scale: { from: 0.5, to: 0.8 },
                duration: 1200,
                ease: 'Back.easeOut',
                onComplete: () => {
                    if (!platform.active) return;  // Skip if platform was destroyed
                    platform.refreshBody();
                    
                    // Add data flow movement
                    this.scene.tweens.add({
                        targets: platform,
                        x: platform.x + Phaser.Math.Between(-20, 20),
                        duration: 2000,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut',
                        onUpdate: () => {
                            if (platform.active) {
                                platform.refreshBody();
                            }
                        }
                    });
                }
            });
            
            return platform;
        });
    }
    
    createPhaseThreePlatforms() {
        const platforms = [
            { x: 400, y: 500 },  // Ground
            { x: 200, y: 450 },  // Lower left
            { x: 600, y: 450 },  // Lower right
            { x: 100, y: 350 },  // Mid left
            { x: 700, y: 350 },  // Mid right
            { x: 400, y: 300 },  // Middle
            { x: 250, y: 200 },  // Upper left
            { x: 550, y: 200 },  // Upper right
            { x: 400, y: 150 }   // Top
        ];
    
        return platforms.map(plat => {
            const platform = this.scene.platforms.create(plat.x, plat.y, 'he_platform');
            platform.setScale(0.8);
            platform.refreshBody();
            platform.setAlpha(0);
            
            // Initial animation
            this.scene.tweens.add({
                targets: platform,
                alpha: 1,
                scale: { from: 0.5, to: 0.8 },
                duration: 1200,
                ease: 'Back.easeOut',
                onComplete: () => {
                    if (!platform.active) return;  // Skip if platform was destroyed
                    platform.refreshBody();
                    
                    // Add glitch movement
                    this.scene.tweens.add({
                        targets: platform,
                        x: platform.x + Phaser.Math.Between(-30, 30),
                        y: platform.y + Phaser.Math.Between(-20, 20),
                        duration: 1500,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Stepped',
                        onUpdate: () => {
                            if (platform.active) {
                                platform.refreshBody();
                            }
                        }
                    });
                }
            });
            
            return platform;
        });
    }

    phaseOne() {
        this.isEncrypted = true;
        this.displayBossMessage('Phase 1: Encrypted State!');
        // Boss attacks with basic encrypted projectiles and spawns minions
        this.attackEvent = this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                this.fireEncryptedProjectile();
                this.spawnMinion();
            },
            callbackScope: this,
            loop: true,
        });
    }

    phaseTwo() {
        this.isEncrypted = true;
        this.displayBossMessage('Phase 2: Homomorphic Computations!');
        this.attackEvent = this.scene.time.addEvent({
            delay: 4000,
            callback: () => {
                this.homomorphicComputation();
                this.spawnMinion();
            },
            callbackScope: this,
            loop: true,
        });
    }

    phaseThree() {
        if (this.decryptionKeysCollected >= 3) {
            this.isEncrypted = false;
            this.displayBossMessage('Phase 3: Encryption Broken!');
        } else {
            this.displayBossMessage('Phase 3: Encryption Strengthened!');
        }
        
        this.attackEvent = this.scene.time.addEvent({
            delay: 2000,
            callback: this.aggressiveAttack,
            callbackScope: this,
            loop: true,
        });
    }

    spawnRandomKey() {
        // Only spawn if we don't have too many keys already
        const existingKeys = this.scene.decryptionKeys.getChildren().length;
        if (existingKeys < 3) {
            // Pick a random position near one of the platforms
            const platforms = this.scene.platforms.getChildren();
            if (platforms.length > 0) {
                const platform = Phaser.Utils.Array.GetRandom(platforms);
                const x = platform.x + Phaser.Math.Between(-50, 50);
                const y = platform.y - 50; // Spawn above the platform
                this.spawnDecryptionKey(x, y);
            }
        }
    }

    spawnDecryptionKey(x, y) {
        const key = this.scene.physics.add.sprite(x, y, 'decryption_key');
        key.body.allowGravity = true;
        key.body.setBounce(0.6);
        this.scene.decryptionKeys.add(key);
        
        // Add collision with platforms so keys don't fall through
        this.scene.physics.add.collider(key, this.scene.platforms);
    }

    fireEncryptedProjectile() {
        if (!this.active) return;

        const projectile = this.projectiles.create(this.x, this.y, 'encrypted_projectile');
        this.scene.physics.moveToObject(projectile, this.scene.player, 200);
        projectile.body.setAllowGravity(false);
    }

    homomorphicComputation() {
        if (!this.active) return;

        this.displayBossMessage('Performing Encrypted Computation!');
        const computationEffect = this.scene.add.circle(this.x, this.y, 100, 0x00ff00, 0.3);
        this.scene.tweens.add({
            targets: computationEffect,
            radius: 200,
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                computationEffect.destroy();
            },
        });
    }

    aggressiveAttack() {
        if (!this.active) return;

        // Rapid fire projectiles
        for (let i = 0; i < 5; i++) {
            this.scene.time.delayedCall(i * 500, this.fireEncryptedProjectile, [], this);
        }
    }

    spawnMinion() {
        const minion = this.minions.create(this.x, this.y, 'he_minion');
        minion.setCollideWorldBounds(true);
        minion.body.setSize(32, 32);
        minion.health = 3;
        
        // Add minion behavior
        minion.update = () => {
            if (!minion.active || !this.scene.player) return;
    
            // Move towards player
            const speed = 150;
            const player = this.scene.player;
            
            // Calculate direction to player
            const dx = player.x - minion.x;
            const dy = player.y - minion.y;
            const angle = Math.atan2(dy, dx);
            
            // Set velocity based on direction
            minion.setVelocityX(Math.cos(angle) * speed);
            
            // Jump if player is above and minion is on ground
            if (dy < -50 && minion.body.blocked.down) {
                minion.setVelocityY(-300);
            }
            
            // Flip sprite based on movement direction
            minion.flipX = dx < 0;
        };
    
        // Add minion to update loop
        this.scene.events.on('update', minion.update);
        
        // Clean up when minion is destroyed
        minion.on('destroy', () => {
            this.scene.events.off('update', minion.update);
        });
    }

    displayBossMessage(message) {
        // Check if a message with the same text is already being displayed
        const existingMessage = this.activeMessages.find(msgObj => msgObj.text === message);
        if (existingMessage) {
            return; // Don't display duplicate message
        }

        // Adjust message position based on the number of active messages
        const yOffset = -70 - (this.activeMessages.length * 20); // Adjust spacing as needed
        const bossMessage = this.scene.add
            .text(this.x, this.y + yOffset, message, {
                fontSize: '16px',
                fill: '#FFD700',
                backgroundColor: '#000',
                padding: { x: 5, y: 2 },
            })
            .setOrigin(0.5);

        // Add message to activeMessages with its text and display object
        this.activeMessages.push({ text: message, displayObject: bossMessage });

        this.scene.time.delayedCall(2000, () => {
            bossMessage.destroy();
            // Remove the message from the array
            const index = this.activeMessages.findIndex(msgObj => msgObj.displayObject === bossMessage);
            if (index > -1) {
                this.activeMessages.splice(index, 1);
            }
            // Reposition remaining messages
            this.repositionMessages();
        });
    }

    repositionMessages() {
        // Recalculate positions of active messages
        this.activeMessages.forEach((msgObj, index) => {
            const yOffset = -70 - (index * 20);
            msgObj.displayObject.setPosition(this.x, this.y + yOffset);
        });
    }

    takeDamage(amount) {
        if (this.isEncrypted) {
            amount *= 0.1;
            this.displayBossMessage('Attack reduced by encryption!');
        }
        this.health -= amount;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
        });

        const healthPercentage = this.health / this.maxHealth;
        if (healthPercentage <= 0.66 && this.currentPhase === 1) {
            this.currentPhase = 2;
            this.attackEvent.remove(false);
            this.startPhase(2);
        } else if (healthPercentage <= 0.33 && this.currentPhase === 2) {
            this.currentPhase = 3;
            this.attackEvent.remove(false);
            this.startPhase(3);
        }
    }

    createPhaseParticles(tint, lifespan, quantity) {
        this.phaseParticles = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            tint: tint,
            lifespan: lifespan,
            quantity: quantity,
            follow: this  // Make particles follow the boss
        });
    }

    destroy(fromScene) {
        // Clean up timers
        if (this.keySpawnTimer) {
            this.keySpawnTimer.destroy();
        }
        if (this.attackEvent) {
            this.attackEvent.destroy();
        }
    
        // Clean up particles
        if (this.phaseParticles) {
            this.phaseParticles.follow = null; // Remove follow target
            this.phaseParticles.destroy();
            this.phaseParticles = null;
        }
    
        // Clean up groups
        this.projectiles.destroy(true);
        this.minions.destroy(true);
    
        super.destroy(fromScene);
    }

    update() {
        if (!this.active) return;
    
        // Hovering motion
        this.hoverTime += this.hoverSpeed;
        const newY = this.hoverY + Math.sin(this.hoverTime) * this.hoverAmplitude;
        this.y = newY;
    
        // Platform-based movement
        const targetPos = this.movePositions[this.currentPlatformIndex];
        const distance = Phaser.Math.Distance.Between(this.x, this.y, targetPos.x, targetPos.y);
    
        if (distance < 10) {
            // Move to next position
            this.currentPlatformIndex = (this.currentPlatformIndex + 1) % this.movePositions.length;
        } else {
            // Move towards current target position
            this.scene.physics.moveTo(this, targetPos.x, targetPos.y, this.speed);
        }
    
        // Update direction for visuals
        this.direction = this.body.velocity.x < 0 ? 'left' : 'right';
        this.flipX = this.direction === 'left';
    
        // Update positions of active messages so they follow the boss
        this.activeMessages.forEach((msgObj, index) => {
            const yOffset = -70 - (index * 20);
            msgObj.displayObject.setPosition(this.x, this.y + yOffset);
        });
    
        // Update particle emitter position if it exists
        if (this.phaseParticles) {
            this.phaseParticles.setPosition(this.x, this.y);
        }
    
        // Clean up off-screen minions
        this.minions.getChildren().forEach(minion => {
            if (minion.y > 600) {
                minion.destroy();
            }
        });
    }
}
