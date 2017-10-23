var msToGrabVine = 300;

function Player(x, y) {
  this.baseSpeed = 350;
  this.jumpPower = 750;
  this.scale = 0.2;
  this.gravity = 1300;
  this.sprite = game.add.sprite(x, y, 'player');
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.sprite.scale.setTo(this.scale);

  // Physics
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.gravity.y = this.gravity;
  // Adjust body size to width of legs
  var shrinkBodyWidth = 150;
  this.sprite.body.setSize(playerSpriteWidth - shrinkBodyWidth, playerSpriteHeight, shrinkBodyWidth / 2, -50);
  // Prevent falling through ledges
  this.sprite.body.tilePadding.y = 20;
  this.falling = false;
  this.onVines = false;
  this.climbingVines = false;
  this.lastTimeJumpPressed = game.time.now;
  cursors.up.onDown.add(function updateTime() {
    if (this.onVines) {
      this.climbingVines = true;
    }
    if (this.onGround) {
      this.jump();
    }
    if (this.climbingVines && game.time.now - this.lastTimeJumpPressed < msToGrabVine) {
      console.log('jumping');
      this.climbingVines = false;
      this.jump();
    }
    this.lastTimeJumpPressed = game.time.now;
  }, this);

  // Animations
  var playbackRate = 15;
  this.sprite.animations.add('rest', [0,1], 1, true);
  this.sprite.animations.add('run', [2,3,4,5,6,7], playbackRate, true);
  this.sprite.animations.add('jump', [8,9], 20);
  this.sprite.animations.add('climb', [10,11,12,13], 5, true);

  // Sounds
  this.sounds = {
    fall: game.add.audio('grassFall'),
    step: game.add.audio('grassStep', 0.1),
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
      var speedModifier = this.onGround ? 1 :
        this.climbingVines ? 0.15 : 0.05;
      // Move slower in the air
      return this.baseSpeed * speedModifier;
    }
  },
  x: {
    get: function () {
      return this.sprite.x;
    }
  }
});

var stepSoundWaiting = false;
var stepDelay = 200;
function stepSoundLoop() {
  if (!stepSoundWaiting) {
    this.playSound('step');
    stepSoundWaiting = true;
    setTimeout(function () {
      stepSoundWaiting = false;
    }, stepDelay)
  }
}
Player.prototype.update = function () {
  this.sprite.body.maxVelocity.setTo(this.baseSpeed, 800);
  if (this.sprite.body.velocity.y > 500) {
    this.falling = true;
    this.fallingVelocity = this.sprite.body.velocity.y;
    this.sprite.animations.play('jump');
  }
  // Player is standing on ground
  if (this.onGround) {
    // Stop climbing vines
    if (this.climbingVines) {
      this.climbingVines = false;
      this.sprite.position.y -= 32;
    }

    // Friction
    this.sprite.body.drag.x = 2000;

    // Hitting the ground
    if (this.falling) {
      this.falling = false;
      this.playSound('fall', 0.2);
      game.camera.shake(this.fallingVelocity * 0.00001, this.fallingVelocity * 0.1, true, Phaser.Camera.SHAKE_VERTICAL);
    }

    // On-ground animations
    if (Math.abs(this.sprite.body.velocity.x) > 0.1) {
      this.sprite.animations.play('run');
      stepSoundLoop.call(this);
    } else {
      this.sprite.animations.play('rest');
    }

    // Climbing down from a ledge
    // TODO: disable for checkpoints
    if (cursors.down.isDown) {
      // this.sprite.y += 20;
    }
  } else { // player is in the air
    // Lack of Friction
    this.sprite.body.drag.x = 100;
  }

  // Running Left
  if (cursors.left.isDown) {
    this.sprite.body.velocity.x -= this.speed;
    this.sprite.scale.setTo(-this.scale, this.scale);
  }
  // Running Right
  if (cursors.right.isDown) {
    this.sprite.body.velocity.x += this.speed;
    this.sprite.scale.setTo(this.scale, this.scale);
  }
  if (!this.onVines) {
    this.climbingVines = false;
  }
  if (this.climbingVines) {
    this.sprite.body.drag.y = 10000;
    this.sprite.body.drag.x = 2000;
    var climbingSpeed = 200;
    this.sprite.body.maxVelocity.y = climbingSpeed;
    if (cursors.up.isDown) {
      player.sprite.body.velocity.y -= climbingSpeed;
      this.sprite.animations.play('climb');
    } else if (cursors.down.isDown) {
      player.sprite.body.velocity.y += climbingSpeed;
      this.sprite.animations.play('climb');
    } else if (Math.abs(this.sprite.body.velocity.x) > 5) {
      this.sprite.animations.play('climb');
    } else {
      this.sprite.animations.stop()
    }
  } else {
    this.sprite.body.drag.y = 0;
  }

};

Player.prototype.playSound = function (key, time) {
  this.sounds[key].play(null, time);
};

Player.prototype.jump = function() {
  this.sprite.body.velocity.y = -this.jumpPower;
  this.sprite.animations.play('jump');
};
