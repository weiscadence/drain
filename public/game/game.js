// ═══════════════════════════════════════════════════════════════
// DRAIN - AI Companion Roguelike
// Built by Cadence 〰️ for Jiggy
// Backrooms meets corrupted AI infrastructure
// ═══════════════════════════════════════════════════════════════

const TILE = 32;
const ROOM_W = 15;
const ROOM_H = 11;
const WIDTH = TILE * ROOM_W;
const HEIGHT = TILE * ROOM_H;

// Game state
let currentRoom = 0;
let playerStats = { hp: 3, maxHp: 3, damage: 1, speed: 200, defense: 0 };
let items = [];
let bossDefeated = false;

// ═══════════════════════════════════════════════════════════════
// MAIN SCENE
// ═══════════════════════════════════════════════════════════════

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    // Reset for new game
    currentRoom = 0;
    playerStats = { hp: 3, maxHp: 3, damage: 1, speed: 200, defense: 0 };
    items = [];
    bossDefeated = false;
    
    this.enemies = [];
    this.bullets = [];
    this.pickups = [];
    this.roomCleared = false;
    
    this.createRoom();
    this.createPlayer();
    this.createCompanion();
    this.createUI();
    this.setupInput();
    this.spawnEnemies();
  }

  createRoom() {
    const g = this.add.graphics();
    
    // Floor - dark backrooms yellow-ish
    g.fillStyle(0x1a1a0a);
    g.fillRect(TILE, TILE, TILE * (ROOM_W - 2), TILE * (ROOM_H - 2));
    
    // Walls - darker
    g.fillStyle(0x0d0d0d);
    for (let x = 0; x < ROOM_W; x++) {
      g.fillRect(x * TILE, 0, TILE, TILE);
      g.fillRect(x * TILE, (ROOM_H - 1) * TILE, TILE, TILE);
    }
    for (let y = 0; y < ROOM_H; y++) {
      g.fillRect(0, y * TILE, TILE, TILE);
      g.fillRect((ROOM_W - 1) * TILE, y * TILE, TILE, TILE);
    }
    
    // Doors (only show if room cleared or first room)
    this.doors = g;
    this.drawDoors();
    
    // Room number
    this.roomText = this.add.text(WIDTH/2, 20, `ROOM ${currentRoom + 1}`, {
      fontSize: '16px', color: '#444', fontFamily: 'monospace'
    }).setOrigin(0.5);
    
    if (currentRoom === 4) {
      this.roomText.setText('⚠️ BOSS ROOM ⚠️');
      this.roomText.setColor('#ff4444');
    }
  }

  drawDoors() {
    const g = this.add.graphics();
    const doorColor = this.roomCleared || currentRoom === 0 ? 0x333300 : 0x1a0000;
    g.fillStyle(doorColor);
    g.fillRect(TILE * 7, 0, TILE, TILE); // Top
    g.fillRect(TILE * 7, (ROOM_H-1) * TILE, TILE, TILE); // Bottom
    g.fillRect(0, TILE * 5, TILE, TILE); // Left
    g.fillRect((ROOM_W-1) * TILE, TILE * 5, TILE, TILE); // Right
  }

  createPlayer() {
    // Player - pale with dark clothes (Isaac style)
    this.player = this.add.container(WIDTH/2, HEIGHT/2);
    
    // Body
    const body = this.add.rectangle(0, 4, 20, 16, 0x2d2d3d);
    // Head
    const head = this.add.circle(0, -6, 12, 0xddc8b8);
    // Eyes
    const eye1 = this.add.circle(-4, -8, 3, 0x111111);
    const eye2 = this.add.circle(4, -8, 3, 0x111111);
    // Hair
    const hair = this.add.ellipse(0, -14, 20, 10, 0x3d2d2d);
    
    this.player.add([body, head, eye1, eye2, hair]);
    this.physics.world.enable(this.player);
    this.player.body.setSize(20, 28);
    this.player.body.setOffset(-10, -14);
    this.player.body.setCollideWorldBounds(true);
    
    // Shooting
    this.lastShot = 0;
    this.shootCooldown = 300;
  }

  createCompanion() {
    // Cadence 〰️ - purple wave entity
    this.companion = this.add.container(WIDTH/2 - 40, HEIGHT/2);
    
    // Glowing orb
    const glow = this.add.circle(0, 0, 14, 0x9945FF, 0.3);
    const core = this.add.circle(0, 0, 10, 0x9945FF);
    
    // Wave pattern
    const wave = this.add.text(0, 0, '〰️', { fontSize: '14px' }).setOrigin(0.5);
    
    this.companion.add([glow, core, wave]);
    this.physics.world.enable(this.companion);
    this.companion.body.setSize(20, 20);
    this.companion.body.setOffset(-10, -10);
    
    // Companion shoots too (weaker)
    this.companionLastShot = 0;
  }

  createUI() {
    // Health hearts
    this.hearts = [];
    for (let i = 0; i < playerStats.maxHp; i++) {
      const heart = this.add.text(10 + i * 25, HEIGHT - 30, '❤️', { fontSize: '20px' });
      this.hearts.push(heart);
    }
    this.updateHearts();
    
    // Items collected
    this.itemsText = this.add.text(WIDTH - 10, HEIGHT - 30, '', {
      fontSize: '12px', color: '#888', fontFamily: 'monospace'
    }).setOrigin(1, 0);
    this.updateItemsUI();
    
    // Stats
    this.statsText = this.add.text(10, HEIGHT - 50, '', {
      fontSize: '10px', color: '#666', fontFamily: 'monospace'
    });
    this.updateStats();
  }

  updateHearts() {
    this.hearts.forEach((h, i) => {
      h.setText(i < playerStats.hp ? '❤️' : '🖤');
    });
  }

  updateItemsUI() {
    if (items.length > 0) {
      this.itemsText.setText('Items: ' + items.join(', '));
    }
  }

  updateStats() {
    this.statsText.setText(`DMG:${playerStats.damage} SPD:${Math.floor(playerStats.speed/20)} DEF:${playerStats.defense}`);
  }

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D',
      space: 'SPACE'
    });
    
    // Touch controls for mobile
    this.touchVelocity = { x: 0, y: 0 };
    this.setupTouchControls();
  }
  
  setupTouchControls() {
    // Virtual joystick zone (left half of screen)
    const joystickZone = this.add.rectangle(WIDTH/4, HEIGHT/2, WIDTH/2, HEIGHT, 0x000000, 0);
    joystickZone.setInteractive();
    
    // Joystick visual (only shows when touching)
    this.joystickBase = this.add.circle(0, 0, 40, 0x333333, 0.5).setVisible(false).setDepth(100);
    this.joystickThumb = this.add.circle(0, 0, 20, 0x9945FF, 0.8).setVisible(false).setDepth(101);
    
    let joystickActive = false;
    let joystickOrigin = { x: 0, y: 0 };
    
    this.input.on('pointerdown', (pointer) => {
      // Left half = joystick
      if (pointer.x < WIDTH / 2) {
        joystickActive = true;
        joystickOrigin = { x: pointer.x, y: pointer.y };
        this.joystickBase.setPosition(pointer.x, pointer.y).setVisible(true);
        this.joystickThumb.setPosition(pointer.x, pointer.y).setVisible(true);
      }
    });
    
    this.input.on('pointermove', (pointer) => {
      if (joystickActive && pointer.isDown) {
        const dx = pointer.x - joystickOrigin.x;
        const dy = pointer.y - joystickOrigin.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = 40;
        
        // Clamp thumb position
        const clampedDist = Math.min(dist, maxDist);
        const angle = Math.atan2(dy, dx);
        const thumbX = joystickOrigin.x + Math.cos(angle) * clampedDist;
        const thumbY = joystickOrigin.y + Math.sin(angle) * clampedDist;
        this.joystickThumb.setPosition(thumbX, thumbY);
        
        // Set velocity based on joystick position
        if (dist > 10) {
          this.touchVelocity.x = (dx / maxDist) * playerStats.speed;
          this.touchVelocity.y = (dy / maxDist) * playerStats.speed;
        } else {
          this.touchVelocity.x = 0;
          this.touchVelocity.y = 0;
        }
      }
    });
    
    this.input.on('pointerup', () => {
      joystickActive = false;
      this.touchVelocity.x = 0;
      this.touchVelocity.y = 0;
      this.joystickBase.setVisible(false);
      this.joystickThumb.setVisible(false);
    });
  }

  spawnEnemies() {
    this.enemies = [];
    
    if (currentRoom === 4) {
      // BOSS ROOM
      this.spawnBoss();
      return;
    }
    
    // Regular rooms - spawn 2-4 enemies
    const count = 2 + Math.floor(currentRoom * 0.5);
    const types = ['crawler', 'shooter', 'charger', 'floater'];
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * Math.min(types.length, currentRoom + 2))];
      const x = TILE * 2 + Math.random() * (WIDTH - TILE * 4);
      const y = TILE * 2 + Math.random() * (HEIGHT - TILE * 4);
      this.spawnEnemy(type, x, y);
    }
    
    // Splitter on room 3+
    if (currentRoom >= 2 && Math.random() > 0.5) {
      this.spawnEnemy('splitter', WIDTH/2 + 100, HEIGHT/2);
    }
  }

  spawnEnemy(type, x, y, scale = 1) {
    let enemy;
    const stats = {
      crawler: { hp: 2, damage: 1, speed: 60, color: 0x4a0000 },
      shooter: { hp: 2, damage: 1, speed: 0, color: 0x2a2a00 },
      charger: { hp: 3, damage: 2, speed: 150, color: 0x600000 },
      floater: { hp: 2, damage: 1, speed: 40, color: 0x002a2a },
      splitter: { hp: 4, damage: 1, speed: 50, color: 0x3a003a },
      mini: { hp: 1, damage: 1, speed: 80, color: 0x3a003a }
    };
    
    const s = stats[type];
    enemy = this.add.container(x, y);
    
    // Body with red eyes
    const body = this.add.rectangle(0, 0, 24 * scale, 24 * scale, s.color);
    const eye1 = this.add.circle(-5 * scale, -3 * scale, 3 * scale, 0xff0000);
    const eye2 = this.add.circle(5 * scale, -3 * scale, 3 * scale, 0xff0000);
    enemy.add([body, eye1, eye2]);
    
    this.physics.world.enable(enemy);
    enemy.body.setSize(24 * scale, 24 * scale);
    enemy.body.setOffset(-12 * scale, -12 * scale);
    
    enemy.hp = s.hp;
    enemy.damage = s.damage;
    enemy.speed = s.speed;
    enemy.type = type;
    enemy.lastShot = 0;
    enemy.scale = scale;
    
    this.enemies.push(enemy);
    return enemy;
  }

  spawnBoss() {
    this.boss = this.add.container(WIDTH/2, HEIGHT/3);
    
    // Big demon body
    const body = this.add.rectangle(0, 0, 64, 64, 0x1a0000);
    const eye1 = this.add.circle(-15, -10, 8, 0xff0000);
    const eye2 = this.add.circle(15, -10, 8, 0xff0000);
    // Horns
    const horn1 = this.add.triangle(-25, -30, 0, 20, 10, 0, 20, 20, 0x2d0000);
    const horn2 = this.add.triangle(25, -30, 0, 20, -10, 0, -20, 20, 0x2d0000);
    
    this.boss.add([body, horn1, horn2, eye1, eye2]);
    this.physics.world.enable(this.boss);
    this.boss.body.setSize(64, 64);
    this.boss.body.setOffset(-32, -32);
    
    this.boss.hp = 50;
    this.boss.maxHp = 50;
    this.boss.phase = 1;
    this.boss.lastAttack = 0;
    this.boss.lastSpawn = 0;
    
    // Boss health bar
    this.bossHpBg = this.add.rectangle(WIDTH/2, 50, 200, 12, 0x333333);
    this.bossHpBar = this.add.rectangle(WIDTH/2, 50, 200, 12, 0xff0000).setOrigin(0.5);
    this.bossLabel = this.add.text(WIDTH/2, 35, 'CORRUPTED CORE', {
      fontSize: '12px', color: '#ff4444', fontFamily: 'monospace'
    }).setOrigin(0.5);
    
    this.enemies.push(this.boss);
  }

  update(time, delta) {
    this.handleMovement();
    this.handleShooting(time);
    this.updateCompanion(time);
    this.updateEnemies(time);
    this.checkCollisions();
    this.checkRoomClear();
    this.checkDoors();
    
    if (this.boss) {
      this.updateBoss(time);
    }
  }

  handleMovement() {
    let vx = 0, vy = 0;
    
    // Keyboard input
    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -playerStats.speed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = playerStats.speed;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -playerStats.speed;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = playerStats.speed;
    
    // Touch input (virtual joystick) - overrides keyboard if active
    if (this.touchVelocity && (this.touchVelocity.x !== 0 || this.touchVelocity.y !== 0)) {
      vx = this.touchVelocity.x;
      vy = this.touchVelocity.y;
    }
    
    this.player.body.setVelocity(vx, vy);
  }

  handleShooting(time) {
    if (time - this.lastShot < this.shootCooldown) return;
    
    // Auto-shoot toward nearest enemy
    const nearest = this.findNearestEnemy();
    if (nearest) {
      this.shoot(this.player.x, this.player.y, nearest.x, nearest.y, playerStats.damage, 0x88ff88);
      this.lastShot = time;
    }
  }

  shoot(fromX, fromY, toX, toY, damage, color) {
    const bullet = this.add.circle(fromX, fromY, 5, color);
    this.physics.world.enable(bullet);
    
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const speed = 300;
    bullet.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    bullet.damage = damage;
    bullet.isPlayerBullet = color === 0x88ff88 || color === 0x9945ff;
    
    this.bullets.push(bullet);
    
    // Destroy after 2 seconds
    this.time.delayedCall(2000, () => {
      bullet.destroy();
      this.bullets = this.bullets.filter(b => b !== bullet);
    });
  }

  findNearestEnemy() {
    let nearest = null;
    let minDist = Infinity;
    
    this.enemies.forEach(e => {
      if (!e.active) return;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = e;
      }
    });
    
    return nearest;
  }

  updateCompanion(time) {
    // Follow player
    const dx = this.player.x - 30 - this.companion.x;
    const dy = this.player.y - this.companion.y;
    this.companion.body.setVelocity(dx * 3, dy * 3);
    
    // Companion shoots (weaker, slower)
    if (time - this.companionLastShot > 800 && this.enemies.length > 0) {
      const nearest = this.findNearestEnemy();
      if (nearest) {
        this.shoot(this.companion.x, this.companion.y, nearest.x, nearest.y, 1, 0x9945ff);
        this.companionLastShot = time;
      }
    }
  }

  updateEnemies(time) {
    this.enemies.forEach(enemy => {
      if (!enemy.active || enemy === this.boss) return;
      
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      switch(enemy.type) {
        case 'crawler':
        case 'mini':
          // Chase player
          if (dist > 10) {
            enemy.body.setVelocity((dx/dist) * enemy.speed, (dy/dist) * enemy.speed);
          }
          break;
          
        case 'shooter':
          // Stay still, shoot every 2s
          enemy.body.setVelocity(0, 0);
          if (time - enemy.lastShot > 2000) {
            this.shoot(enemy.x, enemy.y, this.player.x, this.player.y, enemy.damage, 0xff4444);
            enemy.lastShot = time;
          }
          break;
          
        case 'charger':
          // Charge when player is in line of sight
          if (!enemy.charging && dist < 200) {
            enemy.charging = true;
            enemy.chargeDir = { x: dx/dist, y: dy/dist };
            this.time.delayedCall(1500, () => { enemy.charging = false; });
          }
          if (enemy.charging) {
            enemy.body.setVelocity(enemy.chargeDir.x * enemy.speed * 2, enemy.chargeDir.y * enemy.speed * 2);
          } else {
            enemy.body.setVelocity((dx/dist) * 30, (dy/dist) * 30);
          }
          break;
          
        case 'floater':
          // Erratic movement
          if (!enemy.floatTimer || time > enemy.floatTimer) {
            enemy.floatDir = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
            enemy.floatTimer = time + 1000;
          }
          enemy.body.setVelocity(enemy.floatDir.x * enemy.speed + dx * 0.1, enemy.floatDir.y * enemy.speed + dy * 0.1);
          break;
          
        case 'splitter':
          // Medium chase
          if (dist > 10) {
            enemy.body.setVelocity((dx/dist) * enemy.speed, (dy/dist) * enemy.speed);
          }
          break;
      }
    });
  }

  updateBoss(time) {
    if (!this.boss || !this.boss.active) return;
    
    const dx = this.player.x - this.boss.x;
    const dy = this.player.y - this.boss.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    // Update phase based on HP
    if (this.boss.hp < this.boss.maxHp * 0.3) this.boss.phase = 3;
    else if (this.boss.hp < this.boss.maxHp * 0.6) this.boss.phase = 2;
    
    // Movement - slow chase
    const speed = 30 + this.boss.phase * 15;
    this.boss.body.setVelocity((dx/dist) * speed, (dy/dist) * speed);
    
    // Attacks based on phase
    const attackCooldown = 2000 - this.boss.phase * 400;
    if (time - this.boss.lastAttack > attackCooldown) {
      this.bossAttack();
      this.boss.lastAttack = time;
    }
    
    // Spawn minions
    if (this.boss.phase >= 2 && time - this.boss.lastSpawn > 5000) {
      this.spawnEnemy('crawler', this.boss.x + 50, this.boss.y);
      this.spawnEnemy('crawler', this.boss.x - 50, this.boss.y);
      this.boss.lastSpawn = time;
    }
    
    // Update HP bar
    const hpPercent = this.boss.hp / this.boss.maxHp;
    this.bossHpBar.setScale(hpPercent, 1);
  }

  bossAttack() {
    const patterns = {
      1: () => {
        // Spread shot
        for (let i = 0; i < 5; i++) {
          const angle = (i - 2) * 0.3 + Math.atan2(this.player.y - this.boss.y, this.player.x - this.boss.x);
          this.shootAngle(this.boss.x, this.boss.y, angle, 3, 0xff0000);
        }
      },
      2: () => {
        // Circle burst
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          this.shootAngle(this.boss.x, this.boss.y, angle, 3, 0xff4400);
        }
      },
      3: () => {
        // Spiral + aimed shot
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2 + Date.now() * 0.001;
          this.shootAngle(this.boss.x, this.boss.y, angle, 3, 0xff0000);
        }
        // Aimed shot
        this.shoot(this.boss.x, this.boss.y, this.player.x, this.player.y, 3, 0xffff00);
      }
    };
    
    patterns[this.boss.phase]();
  }

  shootAngle(x, y, angle, damage, color) {
    const bullet = this.add.circle(x, y, 6, color);
    this.physics.world.enable(bullet);
    bullet.body.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
    bullet.damage = damage;
    bullet.isPlayerBullet = false;
    this.bullets.push(bullet);
    this.time.delayedCall(3000, () => {
      if (bullet.active) bullet.destroy();
      this.bullets = this.bullets.filter(b => b !== bullet);
    });
  }

  checkCollisions() {
    // Player bullets hit enemies
    this.bullets.forEach(bullet => {
      if (!bullet.active || !bullet.isPlayerBullet) return;
      
      this.enemies.forEach(enemy => {
        if (!enemy.active) return;
        if (Phaser.Geom.Intersects.CircleToRectangle(
          new Phaser.Geom.Circle(bullet.x, bullet.y, 5),
          new Phaser.Geom.Rectangle(enemy.x - 12, enemy.y - 12, 24, 24)
        )) {
          this.hitEnemy(enemy, bullet.damage);
          bullet.destroy();
          this.bullets = this.bullets.filter(b => b !== bullet);
        }
      });
    });
    
    // Enemy bullets hit player
    this.bullets.forEach(bullet => {
      if (!bullet.active || bullet.isPlayerBullet) return;
      
      if (Phaser.Math.Distance.Between(bullet.x, bullet.y, this.player.x, this.player.y) < 15) {
        this.hitPlayer(bullet.damage);
        bullet.destroy();
        this.bullets = this.bullets.filter(b => b !== bullet);
      }
    });
    
    // Enemies touch player
    this.enemies.forEach(enemy => {
      if (!enemy.active) return;
      if (Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y) < 20) {
        this.hitPlayer(enemy.damage || 1);
      }
    });
    
    // Pickups
    this.pickups.forEach(pickup => {
      if (!pickup.active) return;
      if (Phaser.Math.Distance.Between(pickup.x, pickup.y, this.player.x, this.player.y) < 25) {
        this.collectItem(pickup);
      }
    });
  }

  hitEnemy(enemy, damage) {
    enemy.hp -= damage;
    
    // Flash red
    enemy.list[0].setFillStyle(0xffffff);
    this.time.delayedCall(100, () => {
      if (enemy.active) enemy.list[0].setFillStyle(enemy === this.boss ? 0x1a0000 : 0x4a0000);
    });
    
    if (enemy.hp <= 0) {
      // Splitter spawns 2 mini
      if (enemy.type === 'splitter') {
        this.spawnEnemy('mini', enemy.x - 15, enemy.y, 0.6);
        this.spawnEnemy('mini', enemy.x + 15, enemy.y, 0.6);
      }
      
      // Boss defeated
      if (enemy === this.boss) {
        this.bossDefeated();
        return;
      }
      
      // Maybe drop item
      if (Math.random() < 0.3) {
        this.spawnPickup(enemy.x, enemy.y);
      }
      
      enemy.destroy();
      this.enemies = this.enemies.filter(e => e !== enemy);
    }
  }

  hitPlayer(damage) {
    if (this.playerInvuln) return;
    
    const actualDamage = Math.max(1, damage - playerStats.defense);
    playerStats.hp -= actualDamage;
    this.updateHearts();
    
    // Invulnerability frames
    this.playerInvuln = true;
    this.player.setAlpha(0.5);
    this.time.delayedCall(1000, () => {
      this.playerInvuln = false;
      this.player.setAlpha(1);
    });
    
    // Camera shake
    this.cameras.main.shake(100, 0.01);
    
    if (playerStats.hp <= 0) {
      this.gameOver();
    }
  }

  spawnPickup(x, y) {
    const types = [
      { name: 'heart', emoji: '❤️', effect: () => { playerStats.hp = Math.min(playerStats.hp + 1, playerStats.maxHp); this.updateHearts(); }},
      { name: 'meat', emoji: '🥩', effect: () => { playerStats.damage += 1; items.push('🥩'); }},
      { name: 'feather', emoji: '🪶', effect: () => { playerStats.speed += 30; items.push('🪶'); }},
      { name: 'shield', emoji: '🛡️', effect: () => { playerStats.defense += 1; items.push('🛡️'); }},
      { name: 'eye', emoji: '👁️', effect: () => { this.shootCooldown = Math.max(100, this.shootCooldown - 50); items.push('👁️'); }},
    ];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const pickup = this.add.text(x, y, type.emoji, { fontSize: '20px' }).setOrigin(0.5);
    pickup.itemType = type;
    this.pickups.push(pickup);
  }

  collectItem(pickup) {
    pickup.itemType.effect();
    this.updateStats();
    this.updateItemsUI();
    
    // Float up and fade
    this.tweens.add({
      targets: pickup,
      y: pickup.y - 30,
      alpha: 0,
      duration: 500,
      onComplete: () => pickup.destroy()
    });
    
    this.pickups = this.pickups.filter(p => p !== pickup);
  }

  checkRoomClear() {
    if (this.roomCleared) return;
    
    const activeEnemies = this.enemies.filter(e => e.active && e !== this.boss);
    if (activeEnemies.length === 0 && !this.boss) {
      this.roomCleared = true;
      this.drawDoors();
      
      // Spawn reward
      if (Math.random() < 0.5) {
        this.spawnPickup(WIDTH/2, HEIGHT/2);
      }
    }
  }

  checkDoors() {
    if (!this.roomCleared && currentRoom > 0) return;
    
    const px = this.player.x;
    const py = this.player.y;
    
    // Check door positions
    if (py < TILE + 10 && Math.abs(px - TILE * 7.5) < TILE) this.nextRoom();
    if (py > HEIGHT - TILE - 10 && Math.abs(px - TILE * 7.5) < TILE) this.nextRoom();
    if (px < TILE + 10 && Math.abs(py - TILE * 5.5) < TILE) this.nextRoom();
    if (px > WIDTH - TILE - 10 && Math.abs(py - TILE * 5.5) < TILE) this.nextRoom();
  }

  nextRoom() {
    currentRoom++;
    this.scene.restart();
  }

  bossDefeated() {
    bossDefeated = true;
    this.boss.destroy();
    this.bossHpBg.destroy();
    this.bossHpBar.destroy();
    this.bossLabel.destroy();
    
    // Victory!
    this.add.text(WIDTH/2, HEIGHT/2, '🎉 CORRUPTED CORE DEFEATED! 🎉', {
      fontSize: '20px', color: '#22c55e', fontFamily: 'monospace'
    }).setOrigin(0.5);
    
    this.add.text(WIDTH/2, HEIGHT/2 + 40, 'You cleared the backrooms!\nRefresh to play again', {
      fontSize: '14px', color: '#888', fontFamily: 'monospace', align: 'center'
    }).setOrigin(0.5);
    
    // Stop game
    this.physics.pause();
  }

  gameOver() {
    this.add.rectangle(WIDTH/2, HEIGHT/2, WIDTH, HEIGHT, 0x000000, 0.8);
    this.add.text(WIDTH/2, HEIGHT/2, '💀 CORRUPTED 💀', {
      fontSize: '24px', color: '#ff4444', fontFamily: 'monospace'
    }).setOrigin(0.5);
    this.add.text(WIDTH/2, HEIGHT/2 + 40, `Reached room ${currentRoom + 1}\nRefresh to try again`, {
      fontSize: '14px', color: '#888', fontFamily: 'monospace', align: 'center'
    }).setOrigin(0.5);
    
    this.physics.pause();
  }
}

// ═══════════════════════════════════════════════════════════════
// GAME CONFIG
// ═══════════════════════════════════════════════════════════════

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: 'game-container',
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: MainScene,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);
