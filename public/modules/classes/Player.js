var msToGrabVine = 300;

function Player(x, y) {
  this.baseSpeed = 350;
  this.jumpPower = 620;
  this.scale = 0.2;
  this.gravity = 1800;
  this.maxFallSpeed = 1000;
  this.sprite = game.add.sprite(x, y, 'player');
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.sprite.scale.setTo(this.scale);

  // Physics
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.gravity.y = this.gravity;
  // Adjust body size to width of legs
  this.shrinkBodyWidth = playerSpriteWidth * 0.7;
  // Prevent falling through ledges
  this.sprite.body.tilePadding.y = 20;
  this.falling = false;
  this.fallingThreshold = 760;
  this.onVine = false;
  this.onLadder = false;
  this.climbingVines = false;
  this.climbingLadder = false;
  function jumpBehavior() {
    if (this.onGround) {
      this.jump();
    }
    if (this.climbingVines) {
      this.climbingVines = false;
      this.setPhysics('air');
      setTimeout(this.jump.bind(this), 10);
    }
  }
  function grabVines() {
    if (this.onVine) {
      this.climbingVines = true;
    }
  }
  function grabLadder() {
    if (this.onLadder && !this.climbingLadder) {
      var ladderOffset = this.onLadder.width / 4;
      if (this.onLadder.index % 2 === 1) {
        ladderOffset += this.onLadder.width / 2;
      }
      this.climbingLadder = true;
      this.sprite.position.x = this.onLadder.worldX + ladderOffset;
      this.setPhysics('ladder')
    }
  }
  function climbOffLedge () {
    // TODO: disable for checkpoints
    if (this.onGround && !this.climbingLadder && this.on === 'grass') {
      this.sprite.y += 20;
    }
  }
  cursors.jump.onDown.add(jumpBehavior, this);
  cursors.up.onDown.add(grabVines, this);
  cursors.w.onDown.add(grabVines, this);
  cursors.up.onDown.add(grabLadder, this);
  cursors.w.onDown.add(grabLadder, this);
  cursors.down.onDown.add(climbOffLedge, this);
  cursors.s.onDown.add(climbOffLedge, this);
  cursors.down.onDown.add(grabLadder, this);
  cursors.s.onDown.add(grabLadder, this);

  // Animations
  var playbackRate = 15;
  this.sprite.animations.add('rest', [0,1], 1, true);
  this.sprite.animations.add('run', [2,3,4,5,6,7], playbackRate, true);
  this.sprite.animations.add('jump', [8,9, 10], 20);
  this.sprite.animations.add('climb', [12,13,14,15], 5, true);
  this.sprite.animations.add('climbDown', [15,14,13,12], 5, true);
  this.sprite.animations.add ("dance", [16, 17, 18, 19], 5, true);
  this.sprite.animations.add ("sit", [20, 21], 16, false);
  this.sprite.animations.add ("facePlant", [22, 23], 10, false);
  this.sprite.animations.add ("gettingUp", [24, 25, 26], 10, false);

  this.sounds = {
    climbVines: game.add.audio('vine_rustles'),
    grass: game.add.audio('grass_step', 0.1),
    grassFall: game.add.audio('grass_fall'),
    stone: game.add.audio('stone_step', 0.5),
    stoneFall: game.add.audio('stone_fall'),
  };
  Object.defineProperties(this.sounds, {
    step: {
      get: function() {
        return (this.on === 'stone') ? this.sounds.stone : this.sounds.grass;
      }.bind(this),
    },
    fall: {
      get: function() {
        return (this.on === 'stone') ? this.sounds.stoneFall : this.sounds.grassFall;
      }.bind(this),
    },
  })
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
        this.climbingVines ? 0.12 : 0.05;
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

function loopSound(key, delay, volume) {
  var soundWaiting = false;
  return function() {
    if (!soundWaiting) {
      this.playSound(key, null, volume);
      soundWaiting = true;
      setTimeout(function () {
        soundWaiting = false;
      }, delay)
    }
  }
}
var stepSoundLoop = loopSound('step', 200);
var vineSoundLoop = loopSound('climbVines', 600, 0.5);

Player.prototype.update = function () {
  this.sprite.body.maxVelocity.setTo(this.baseSpeed, this.maxFallSpeed);
  this.sprite.body.setSize(playerSpriteWidth - this.shrinkBodyWidth, 
    playerSpriteHeight, this.shrinkBodyWidth / 2, -50);

  if (this.sprite.body.velocity.y > this.fallingThreshold && 
    !this.climbingVines && !this.climbingLadder) {
    this.falling = true;
    this.fallingVelocity = this.sprite.body.velocity.y;
    this.sprite.animations.play('jump');
  }
                   
  // Player is standing on ground
  if (this.onGround) {
    // Stop climbing vines
    if (this.climbingVines && !cursors.w.isDown && !cursors.up.isDown) {
      this.climbingVines = false;
      this.sprite.position.y -= 2;  // keeps you from falling off ledge you are on
    }
    if (this.climbingLadder && !cursors.up.isDown && !cursors.w.isDown) {
      this.climbingLadder = false;
      this.sprite.position.y -= 2;
    }

    this.setPhysics('ground');

    // Hitting the ground
    if (this.falling) {
      this.falling = false;
      this.land = true;
      var getUpTime = 600;
      var me = this;

      var getUp = function() {
        setTimeout(function() {
          me.sprite.animations.play('gettingUp').onComplete.addOnce(function() {
            me.land = false;
          });
        }, getUpTime)
      };

      if (this.fallingVelocity < 1000){
        this.sprite.animations.play('sit').onComplete.addOnce(getUp);
      } else {
       this.sprite.animations.play("facePlant").onComplete.addOnce(getUp);
       getUpTime = 1200;
      }

      //game.camera.shake((this.fallingVelocity - this.fallingThreshold) * 0.0005, 200);
      this.playSound('fall', 0.2);

    }

    if (!this.land){
    // On-ground animations
      if (Math.abs(this.sprite.body.velocity.x) > 0.1) {
        this.sprite.animations.play('run');
        stepSoundLoop.call(this);
      } else { //making sure the landing animations dont get over ridden
        this.sprite.animations.play('rest');
      }
    }

  } else { // player is in the air
    this.setPhysics('air');
  }

  // Running Left
  if (!this.land){ 
    if (cursors.left.isDown || cursors.a.isDown) {
      this.sprite.body.velocity.x -= this.speed;
      this.sprite.scale.setTo(-this.scale, this.scale);
    }
    // Running Right
    if (cursors.right.isDown || cursors.d.isDown) {
      this.sprite.body.velocity.x += this.speed;
      this.sprite.scale.setTo(this.scale, this.scale);
    }
  }

  // Variable height jump
  if (cursors.jump.isDown && this.sprite.body.velocity.y <= 0) {
    this.sprite.body.gravity.y = this.gravity * 0.6;
  } else {
    this.sprite.body.gravity.y = this.gravity;
  }

  if (this.climbingVines) {
    this.setPhysics('vines');
    this.falling = false;
    var climbAcceleration = 80;
    if (cursors.up.isDown || cursors.w.isDown) {
      this.sprite.body.velocity.y -= climbAcceleration;
      this.sprite.animations.play('climb');
      vineSoundLoop.call(this);
    } else if (cursors.down.isDown) {
      this.sprite.body.velocity.y += climbAcceleration;
      this.sprite.animations.play('climb');
      vineSoundLoop.call(this);
    } else if (Math.abs(this.sprite.body.velocity.x) > 5) {
      this.sprite.animations.play('climb');
      vineSoundLoop.call(this);
    } else {
      this.sprite.animations.stop()
    }
  }
  if (!this.onVine) {
    this.climbingVines = false;
  }
  if (this.onVine) {
    if (cursors.up.isDown || cursors.w.isDown) {
      this.climbingVines = true;
    }
  }

  if (!this.onLadder) {
    this.climbingLadder = false;
  }
  if (this.climbingLadder) {
    this.setPhysics('ladder');
    var ladderAcceleration = 800;
    if (cursors.up.isDown || cursors.w.isDown) {
      this.sprite.body.velocity.y -= ladderAcceleration;
      this.sprite.animations.play('climb');
    } else if (cursors.down.isDown || cursors.s.isDown) {
      this.sprite.body.velocity.y += ladderAcceleration;
      this.sprite.animations.play('climbDown');
    } else {
      this.sprite.animations.stop()
    }
  }
};

Player.prototype.playSound = function (key, time, volume) {
  this.sounds[key].play(null, time, volume);
};

Player.prototype.jump = function() {
  if (!this.land){
    this.sprite.body.velocity.y = -this.jumpPower;
    this.sprite.animations.play('jump');
  }  
};

Player.prototype.setPhysics = function (state) {
  switch (state) {
    case 'ground':
      // Friction
      this.sprite.body.drag.y = 0;
      this.sprite.body.drag.x = 2000;
      break;
    case 'vines':
      this.sprite.body.drag.y = 1700;
      this.sprite.body.drag.x = 2000;
      var climbingSpeed = 200;
      this.sprite.body.maxVelocity.y = climbingSpeed;
      this.sprite.body.setSize(playerSpriteWidth * 0.1, playerSpriteHeight * 0.1,
        playerSpriteWidth * 0.5, playerSpriteHeight * 0.5
      )
      break;
    case 'ladder':
      var climbingSpeed = 200;
      this.sprite.body.maxVelocity.y = climbingSpeed;
      this.sprite.body.drag.y = 10000;
      this.sprite.body.drag.x = 5000;
      break;
    case 'air':
      // Lack of Friction
      this.sprite.body.drag.x = 100;
      this.sprite.body.drag.y = 0;
      break;
  }
};
