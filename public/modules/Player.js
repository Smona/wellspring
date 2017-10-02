function Player(x, y) {
  this.baseSpeed = 350;
  this.jumpPower = 800;
  this.scale = 0.1;
  this.sprite = game.add.sprite(x, y, 'player');
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.sprite.scale.setTo(this.scale);

  // Physics
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.gravity.y = 1500;
  this.sprite.body.maxVelocity.setTo(this.baseSpeed, 800);
  // Adjust body size to width of legs
  var shrinkBodyWidth = 100;
  this.sprite.body.setSize(328 - shrinkBodyWidth, 529, shrinkBodyWidth / 2);
  // Prevent falling through ledges
  this.sprite.body.tilePadding.y = 20;
  this.falling = false;

  // Animations
  var playbackRate = 15;
  this.sprite.animations.add('rest', [0,1], 2, true);
  this.sprite.animations.add('run', [2,3,4,5,6,7], playbackRate, true);
  this.sprite.animations.add('jump', [8,9,10,11], 20);

  // Sounds
  this.sounds = {
    fall: game.add.audio('grassFall')
  };
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
  if (this.sprite.body.velocity.y > 300) {
    this.falling = true;
    this.sprite.animations.play('jump');
  }
  // Player is standing on ground
  if (this.onGround) {
    // Friction
    this.sprite.body.drag.x = 2000;

    // Hitting the ground
    if (this.falling) {
      this.falling = false;
      this.play('fall', 0.2);
    }

    // On-ground animations
    if (Math.abs(this.sprite.body.velocity.x) > 0.1) {
      this.sprite.animations.play('run');
    } else {
      this.sprite.animations.play('rest');
    }

    // Jumping
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
      this.sprite.body.velocity.y = -this.jumpPower;
      this.sprite.animations.play('jump');
    }
    // Climbing down from a ledge
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
      this.sprite.y += 20;
    }
  } else { // player is in the air
    // Lack of Friction
    this.sprite.body.drag.x = 100;
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
};

Player.prototype.play = function (key, time) {
  this.sounds[key].play(null, time);
};