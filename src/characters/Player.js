// src/characters/Player.js

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    // Add the player to the scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Player properties
    this.epsilon = 0;
    this.health = 5; // Starting health
    this.attackPower = 1;
    this.direction = 'right';
    this.isAttacking = false;
    this.petSkills = {};
    this.activePetEffects = {};
    this.petCooldowns = {
      DP: 0,
      FL: 0,
      HE: 0,
      PE: 0,
    };

    // Weapon Level
    this.weaponLevel = 1;

    // Enable collision with world bounds
    this.setCollideWorldBounds(true);

    // Adjust player size for better collision (adjust as needed)
    this.setSize(32, 48).setOffset(0, 0);

    // Input keys
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.attackKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    ); // Attack key assigned to 'SPACE'
    this.jumpKey = this.cursors.up; // Up arrow for jumping

    // PET activation keys
    this.petKeys = {
      DP: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      FL: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      HE: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
      PE: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
    };

    // Weapon
    this.weapon = scene.add.sprite(this.x, this.y, 'attackAnimation');
    this.weapon.setVisible(false);
    this.weapon.active = false;

    // Initialize physics for the weapon
    scene.physics.add.existing(this.weapon);
    this.weapon.body.allowGravity = false;
    this.weapon.body.setSize(32, 32);
    this.weapon.body.setCircle(16);
    this.weapon.body.setOffset(0, 0);
    this.weapon.body.checkCollision.none = true;

    // Projectile Group
    this.projectiles = scene.physics.add.group();

    // Jump variables
    this.jumpCount = 0;
    this.canDoubleJump = true;
  }

  update() {
    const speed = 160;

    // Apply Polymorphic Encryption effect
    if (this.activePetEffects.PE) {
      // Make the player semi-transparent
      this.setAlpha(0.5);
    } else {
      this.setAlpha(1);
    }

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.setVelocityX(-speed);
      this.direction = 'left';
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(speed);
      this.direction = 'right';
    } else {
      this.setVelocityX(0);
    }

    // Reset jump count when the player lands
    if (this.body.blocked.down) {
      this.jumpCount = 0;
      this.canDoubleJump = true;
    }

    // Jumping
    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
      if (this.body.blocked.down) {
        // First jump
        this.setVelocityY(-330);
        this.jumpCount++;
      } else if (this.canDoubleJump && this.jumpCount < 2) {
        // Double jump
        this.setVelocityY(-330);
        this.jumpCount++;
        this.canDoubleJump = false;
      }
    }

    // Attacking
    if (
      Phaser.Input.Keyboard.JustDown(this.attackKey) &&
      !this.isAttacking
    ) {
      this.attack();
    }

    // Update weapon position
    if (this.isAttacking) {
      this.weapon.x =
        this.x + (this.direction === 'left' ? -20 : 20);
      this.weapon.y = this.y;
    }

    // Reduce PET cooldowns
    for (const skill in this.petCooldowns) {
      if (this.petCooldowns[skill] > 0) {
        this.petCooldowns[skill] -= this.scene.game.loop.delta;
        if (this.petCooldowns[skill] < 0) {
          this.petCooldowns[skill] = 0;
        }
      }
    }

    // PET activation
    for (const skill in this.petKeys) {
      if (
        Phaser.Input.Keyboard.JustDown(this.petKeys[skill]) &&
        this.petSkills[skill]
      ) {
        this.activatePetSkill(skill);
      }
    }
  }

  attack() {
    this.isAttacking = true;
    this.weapon.setVisible(true);
    this.weapon.active = true;
    this.weapon.body.checkCollision.none = false;

    // Set weapon position
    this.weapon.x =
      this.x + (this.direction === 'left' ? -20 : 20);
    this.weapon.y = this.y;

    // Set up the overlap dynamically
    this.weaponOverlap = this.scene.physics.add.overlap(
      this.weapon,
      this.scene.activeEnemies,
      this.scene.handleWeaponEnemyCollision,
      null,
      this.scene
    );

    // Fire projectile
    this.fireProjectile();

    // Hide weapon after a short duration
    this.scene.time.addEvent({
      delay: 200, // Weapon active for 200ms
      callback: () => {
        this.weapon.setVisible(false);
        this.isAttacking = false;
        this.weapon.active = false;
        this.weapon.body.checkCollision.none = true;

        // Remove the overlap
        this.scene.physics.world.removeCollider(this.weaponOverlap);
      },
    });
  }

  fireProjectile() {
    const projectile = this.projectiles.create(
      this.x,
      this.y,
      'projectile'
    );
    projectile.setScale(0.5 + 0.1 * this.weaponLevel);
    projectile.body.allowGravity = false;
    projectile.body.setCircle(8 + 2 * this.weaponLevel);
    projectile.damage = this.attackPower;
    projectile.active = true;

    const velocity = this.direction === 'left' ? -300 : 300;
    projectile.setVelocityX(velocity);

    // Set up overlap for this projectile
    projectile.overlap = this.scene.physics.add.overlap(
      projectile,
      this.scene.activeEnemies,
      this.scene.handleProjectileEnemyCollision,
      null,
      this.scene
    );

    // Store the timer event for later cancellation
    projectile.timerEvent = this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (projectile && projectile.body) {
          projectile.active = false;
          projectile.body.checkCollision.none = true;

          // Remove overlap collider
          if (projectile.overlap) {
            this.scene.physics.world.removeCollider(projectile.overlap);
            projectile.overlap = null;
          }

          projectile.destroy();
        }
      },
    });
  }

  addPetSkill(skill) {
    this.petSkills[skill] = true;
    this.scene.updatePetHUD();
  }

  activatePetSkill(skill) {
    if (this.activePetEffects[skill] || this.petCooldowns[skill] > 0) {
      // Skill is already active or on cooldown
      return;
    }

    switch (skill) {
      case 'DP':
        // Temporarily reduce epsilon gain
        this.activePetEffects.DP = true;
        this.scene.time.addEvent({
          delay: 10000, // Effect lasts 10 seconds
          callback: () => {
            this.activePetEffects.DP = false;
            this.scene.updatePetHUD();
          },
        });
        break;
      case 'FL':
        // Summon AI helper
        this.activePetEffects.FL = true;
        this.spawnAIHelpers(5);
        break;
      case 'HE':
        // Area-of-effect attack
        this.activePetEffects.HE = true;
        this.scene.homomorphicEncryptionBlast(this.x, this.y);
        this.activePetEffects.HE = false; // Immediate effect
        break;
      case 'PE':
        // Become invisible to enemies
        this.activePetEffects.PE = true;
        this.scene.time.addEvent({
          delay: 10000, // Effect lasts 10 seconds
          callback: () => {
            this.activePetEffects.PE = false;
            this.scene.updatePetHUD();
          },
        });
        break;
    }

    // Set cooldown
    const cooldownDuration = 15000; // 15 seconds cooldown
    this.petCooldowns[skill] = cooldownDuration;

    // Update PET HUD to show active effect
    this.scene.updatePetHUD();
  }

  homomorphicEncryptionBlast() {
    const x = this.x;
    const y = this.y;
    const radius = 200;

    // Access the current scene's activeEnemies group
    const enemies = this.scene.activeEnemies;

    enemies.children.iterate((enemy) => {
      if (!enemy || !enemy.active) {
        return; // Skip if enemy is undefined or inactive
      }
      const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
      if (distance <= radius) {
        enemy.takeDamage(3, {
          x: (enemy.x - x) * 2,
          y: -100,
        });
        if (enemy.health <= 0) {
          enemy.destroy();
        }
      }
    });

    // Visual effect for the blast
    const blast = this.scene.add.circle(x, y, radius, 0x00ff00, 0.3);
    this.scene.tweens.add({
      targets: blast,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        blast.destroy();
      },
    });
  }

  spawnAIHelpers(count) {
    for (let i = 0; i < count; i++) {
      const helper = this.scene.physics.add.sprite(
        this.x + Phaser.Math.Between(-50, 50),
        this.y - 50, // Spawn slightly above the player
        'ai_helper'
      );
      helper.setTint(0x32cd32); // Green tint to distinguish
      helper.body.allowGravity = true;
      helper.setCollideWorldBounds(true);
      helper.health = 5; // Increased health
      helper.speed = 150; // Increased speed
      helper.jumpStrength = -400; // Increased jump height
      helper.attackCooldown = 0; // Initialize attack cooldown
  
      // Ensure aiHelpers group exists
      if (!this.scene.aiHelpers) {
        this.scene.aiHelpers = this.scene.physics.add.group({
          collideWorldBounds: true,
        });
      }
      this.scene.aiHelpers.add(helper);
  
      // Ensure physics body size matches the sprite
      helper.body.setSize(helper.width, helper.height);
      helper.body.setOffset(0, 0);
  
      // Define the attack method for the helper
      helper.attack = () => {
        if (this.scene.time.now > helper.attackCooldown) {
          // Create a projectile
          const projectile = this.scene.physics.add.sprite(helper.x, helper.y, 'ai_projectile');
          projectile.body.allowGravity = false;
          projectile.setVelocityX(helper.flipX ? -300 : 300);
  
          // Overlap with target
          this.scene.physics.add.overlap(projectile, helper.target, (proj, targ) => {
            targ.takeDamage(1);
            proj.destroy();
          });
  
          // Set cooldown
          helper.attackCooldown = this.scene.time.now + 1000; // 1-second cooldown
        }
      };
  
      // AI helper behavior
      helper.update = () => {
        let target = null;
  
        // Target acquisition
        if (this.scene.boss && this.scene.boss.active) {
          target = this.scene.boss;
        } else if (this.scene.activeEnemies && this.scene.activeEnemies.getChildren().length > 0) {
          // Prioritize enemies attacking the player
          const enemies = this.scene.activeEnemies.getChildren();
          const attackingEnemies = enemies.filter(enemy => enemy.isAttackingPlayer);
          if (attackingEnemies.length > 0) {
            // Find the closest attacking enemy
            target = attackingEnemies.reduce((closest, enemy) => {
              const distance = Phaser.Math.Distance.Between(helper.x, helper.y, enemy.x, enemy.y);
              if (!closest || distance < closest.distance) {
                return { enemy, distance };
              }
              return closest;
            }, null)?.enemy;
          } else {
            // Find the closest enemy
            target = enemies.reduce((closest, enemy) => {
              const distance = Phaser.Math.Distance.Between(helper.x, helper.y, enemy.x, enemy.y);
              if (!closest || distance < closest.distance) {
                return { enemy, distance };
              }
              return closest;
            }, null)?.enemy;
          }
        }
  
        helper.target = target; // Store the target for use in attack
  
        if (target) {
          // Calculate direction towards target
          const directionX = target.x < helper.x ? -1 : 1;
          helper.setVelocityX(directionX * helper.speed);
          helper.setFlipX(directionX < 0);
  
          // Vertical movement
          const deltaY = target.y - helper.y;
          if (deltaY < -20 && helper.body.blocked.down) {
            // Target is above, attempt to jump
            helper.setVelocityY(helper.jumpStrength);
          }
  
          // Jump over obstacles
          if ((helper.body.blocked.right && directionX > 0) || (helper.body.blocked.left && directionX < 0)) {
            if (helper.body.blocked.down) {
              helper.setVelocityY(helper.jumpStrength);
            }
          }
  
          // Attack if within range
          const distanceToTarget = Phaser.Math.Distance.Between(helper.x, helper.y, target.x, target.y);
          if (distanceToTarget < 300) {
            helper.attack();
          }
        } else {
          // No target found, idle
          helper.setVelocityX(0);
        }
  
        // Play run animation if moving
        if (helper.body.velocity.x !== 0) {
          helper.anims.play('helper_run', true);
        } else {
          helper.anims.stop();
          helper.setFrame(0);
        }
      };
  
      // Helper takes damage from enemy projectiles
      if (this.scene.enemyProjectiles) {
        this.scene.physics.add.overlap(
          helper,
          this.scene.enemyProjectiles,
          (helper, projectile) => {
            projectile.destroy();
            helper.health -= 1;
            helper.setTint(0xff0000);
            this.scene.time.delayedCall(200, () => {
              helper.clearTint();
            });
            if (helper.health <= 0) {
              helper.destroy();
            }
          }
        );
      }
  
      // Helper collides with enemies
      if (this.scene.activeEnemies) {
        this.scene.physics.add.overlap(
          helper,
          this.scene.activeEnemies,
          (helper, enemy) => {
            enemy.takeDamage(1, { x: 0, y: -100 });
            if (enemy.health <= 0) {
              enemy.destroy();
            }
          }
        );
      }
  
      // Helper collides with boss
      if (this.scene.boss && this.scene.boss.active) {
        this.scene.physics.add.overlap(
          helper,
          this.scene.boss,
          (helper, boss) => {
            boss.takeDamage(1);
            boss.setVelocityX((boss.x - helper.x) * 2);
            boss.setTint(0xff0000);
            this.scene.time.delayedCall(200, () => {
              boss.clearTint();
            });
            if (boss.health <= 0) {
              this.scene.bossDefeated();
            }
          }
        );
      }
    }
  
    // Remove helpers after some time
    this.scene.time.addEvent({
      delay: 10000, // Helpers last 10 seconds
      callback: () => {
        if (this.scene.aiHelpers) {
          this.scene.aiHelpers.clear(true, true);
        }
        this.activePetEffects.FL = false;
        this.scene.updatePetHUD();
      },
    });
  }

  upgradeWeapon(improvementFactor = 1) {
    // Upgrade weapon based on improvementFactor
    const upgradeAmount = Math.ceil(improvementFactor * 2); // Adjust scaling as needed
    this.weaponLevel += upgradeAmount;
    this.attackPower += upgradeAmount;

    this.scene.showMessage(
      `Weapon upgraded to Level ${this.weaponLevel}!`,
      this.x,
      this.y - 50
    );
  }

  takeHit(knockback) {
    // Apply knockback
    this.setVelocityX(knockback.x);
    this.setVelocityY(knockback.y);

    // Reduce health
    this.health -= 1;
    this.scene.updateHealthDisplay();

    // Check for game over
    if (this.health <= 0) {
      this.scene.gameOver();
    }
  }

  getData() {
    return {
      epsilon: this.epsilon,
      health: this.health,
      attackPower: this.attackPower,
      direction: this.direction,
      weaponLevel: this.weaponLevel,
      petSkills: { ...this.petSkills },
      activePetEffects: { ...this.activePetEffects },
      petCooldowns: { ...this.petCooldowns },
      // Add any other properties that need to be preserved
    };
  }
}
