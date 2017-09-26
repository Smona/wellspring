function Player(x, y) {
  this.baseSpeed = 400;
  this.jumpPower = 800;
  this.scale = 0.04;
  this.sprite = game.add.sprite(x, y, 'player');
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.sprite.scale.setTo(this.scale);

  // Physics
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.gravity.y = 1500;
  this.sprite.body.maxVelocity.x = this.baseSpeed;
  // Adjust body size to width of legs
  var shrinkBodyWidth = 400;
  this.sprite.body.setSize(1293 - shrinkBodyWidth, 2100, shrinkBodyWidth / 2);
  // Prevent falling through ledges
  this.sprite.body.tilePadding.y = 20;
  this.falling = false;

  // Animations
  this.sprite.animations.add('run');

  // Sounds
  this.sounds = {
    fall: game.add.audio('grassFall')
  }
}

Object.defineProperties(Player.prototype, {
  onGround: {
    get: function () {
      return this.sprite.body.onFloor() || this.sprite.body.touching.down;
    },
    set: function (y) {
    }
  },
  speed: {
    get: function () {
      // Move slower in the air
      return this.baseSpeed * (this.onGround ? 1 : 0.05);
    }
  },
  x: {
    get: function () {
      return this.sprite.x;
    }
  }
});

Player.prototype.update = function () {
  if (this.sprite.body.velocity.y > 2) {
    this.falling = true;
  }
  // Player is standing on ground
  if (this.onGround) {
    // Friction
    this.sprite.body.velocity.x = 0;

    if (this.falling) {
      this.falling = false;
      this.play('fall', 0.2);
    }

    // Jumping
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
      this.sprite.body.velocity.y = -this.jumpPower;
    }
    // Climbing down from a ledge
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
      this.sprite.y += 20;
    }
  }

  // Running Left
  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    this.sprite.body.velocity.x -= this.speed;
    this.sprite.scale.setTo(-this.scale, this.scale);
  }
  // Running Right
  if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    this.sprite.body.velocity.x += this.speed;
    this.sprite.scale.setTo(this.scale, this.scale);
  }
  if (Math.abs(this.sprite.body.velocity.x) > 0.1 && this.onGround) {
    this.sprite.animations.play('run', 15, true);
  } else {
    this.sprite.animations.stop('run', 0);
  }
};

Player.prototype.play = function (key, time) {
  this.sounds[key].play(null, time);
};