function DepthSign(x, y, depth) {
  this.x = x;
  this.y = y;
  this.sign = game.add.sprite(x, y, 'sign');
  this.sign.anchor.setTo(0.5);
  this.sign.scale.setTo(1.8);
  this.text = game.add.text(x, y - 2, '-' + depth + ' FT', {
    font: gameFont,
  });
  this.text.anchor.setTo(0.5)
}
var msToGrabVine = 300;

function Player(x, y) {
  this.baseSpeed = 350;
  // this.jumpPower = 725;
  this.jumpPower = 800;
  this.scale = 0.2;
  this.gravity = 1900;
  this.sprite = game.add.sprite(x, y, 'player');
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.sprite.scale.setTo(this.scale);

  // Physics
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.gravity.y = this.gravity;
  // Adjust body size to width of legs
  var shrinkBodyWidth = playerSpriteWidth * 0.7;
  this.sprite.body.setSize(playerSpriteWidth - shrinkBodyWidth, playerSpriteHeight, shrinkBodyWidth / 2, -50);
  // Prevent falling through ledges
  this.sprite.body.tilePadding.y = 20;
  this.falling = false;
  this.onVines = false;
  this.climbingVines = false;
  this.lastTimeJumpPressed = game.time.now;
  function jumpBehavior() {
    var leftVines = false;
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
    if (this.onVines) {
      this.climbingVines = true;
    }
  }
  cursors.jump.onDown.add(jumpBehavior, this);
  cursors.up.onDown.add(grabVines, this);
  cursors.w.onDown.add(grabVines, this);

  // Animations
  var playbackRate = 15;
  this.sprite.animations.add('rest', [0,1], 1, true);
  this.sprite.animations.add('run', [2,3,4,5,6,7], playbackRate, true);
  this.sprite.animations.add('jump', [8,9, 10], 20);
  this.sprite.animations.add('climb', [12,13,14,15], 5, true);

  // Sounds
  this.sounds = {
    fall: game.add.audio('grassFall'),
    step: game.add.audio('grassStep', 0.1),
    climbVines: game.add.audio('vine_rustles'),
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
  this.sprite.body.maxVelocity.setTo(this.baseSpeed, 800);
  if (this.sprite.body.velocity.y > 500) {
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

    this.setPhysics('ground');

    // Hitting the ground
    if (this.falling) {
      this.falling = false;
      this.playSound('fall', 0.2);
      game.camera.shake(this.fallingVelocity * 0.0001, this.fallingVelocity * 0.3);
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
    this.setPhysics('air');
  }

  // Running Left
  if (cursors.left.isDown || cursors.a.isDown) {
    this.sprite.body.velocity.x -= this.speed;
    this.sprite.scale.setTo(-this.scale, this.scale);
  }
  // Running Right
  if (cursors.right.isDown || cursors.d.isDown) {
    this.sprite.body.velocity.x += this.speed;
    this.sprite.scale.setTo(this.scale, this.scale);
  }

  // Variable height jump
  if (cursors.jump.isDown && this.sprite.body.velocity.y <= 0) {
    this.sprite.body.gravity.y = this.gravity * 0.6;
  } else {
    this.sprite.body.gravity.y = this.gravity;
  }

  if (!this.onVines) {
    this.climbingVines = false;
  }
  if (this.climbingVines) {
    this.setPhysics('vines');
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
};

Player.prototype.playSound = function (key, time, volume) {
  this.sounds[key].play(null, time, volume);
};

Player.prototype.jump = function() {
  this.sprite.body.velocity.y = -this.jumpPower;
  this.sprite.animations.play('jump');
};

Player.prototype.setPhysics = function (state) {
  switch (state) {
    case 'ground':
      // Friction
      this.sprite.body.drag.y = 0;
      this.sprite.body.drag.x = 2000;
      break;
    case 'vines':
      this.sprite.body.drag.y = 1000;
      this.sprite.body.drag.x = 2000;
      var climbingSpeed = 200;
      this.sprite.body.maxVelocity.y = climbingSpeed;
      break;
    case 'air':
      // Lack of Friction
      this.sprite.body.drag.x = 100;
      this.sprite.body.drag.y = 0;
      break;
  }
};

function Tilemap(key, player) {
  var map = game.add.tilemap(key);

  map.addTilesetImage('grassLedgeTile');
  map.addTilesetImage('stoneLedgeTile');
  map.addTilesetImage('wellBottom');
  map.addTilesetImage('ladder');
  map.addTilesetImage('wallTile');
  map.addTilesetImage('vineTile');

  this.wellTiles = map.createLayer('wall');
  this.ledges = map.createLayer('grassLedge');
  this.stoneLedges = map.createLayer('stoneLedge');
  this.wellBottom = map.createLayer('stone');
  this.vines = map.createLayer('vine');
  if (typeof player !== 'undefined') {
    map.setCollisionByExclusion([0], true, this.ledges);
    map.setCollisionByExclusion([0], true, this.stoneLedges);
    map.setCollisionByExclusion([0], true, this.wellBottom);
    map.setCollisionByExclusion([0], true, this.vines);
    var vineFallTimer;

    // Generate array of non-0 indexes
    var vineTileIndexes = new Array(100);
    for (var i = 0; i < vineTileIndexes.length; i++) {
      vineTileIndexes[i] = i + 1;
    }

    // Remove vine/player separation and add grabbing mechanic
    map.setTileIndexCallback(vineTileIndexes, function () {
      if (!!vineFallTimer) {
        clearTimeout(vineFallTimer);
      }
      player.onVines = true;
      vineFallTimer = setTimeout(function () {
        player.onVines = false;
      }, 32);
    }, game, this.vines);
  }

  this.map = map;
}

Tilemap.prototype.checkCollisions = function (body) {
  game.physics.arcade.collide(body, this.ledges, null, function (collidedBody, ledge) {
    // Allows the player to jump through the bottom of ledges
    var colliding = ledge.collides &&
      collidedBody.position.y - collidedBody.body.height * collidedBody.anchor.y <=
      ledge.worldY - ledge.height + 40;
    return colliding;
  });
  game.physics.arcade.collide(body, this.vines);
  game.physics.arcade.collide(body, this.wellBottom);
};
// Entry point. Designed to load quickly and set global game settings

var cursors;

boot = {
  preload: function () {
    game.load.image('loadingBar', 'sprites/loading-bar.png');
  },
  create: function () {
    // Dynamically resize game canvas
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
    cursors.w = game.input.keyboard.addKey(Phaser.Keyboard.W);
    cursors.a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    cursors.s = game.input.keyboard.addKey(Phaser.Keyboard.S);
    cursors.d = game.input.keyboard.addKey(Phaser.Keyboard.D);
    cursors.jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.state.start('preload');
  }
};
var levels = [ ];
var currentLevel = 0;

function Level(width, height, name, customCallbacks) {
  this.width = width;
  this.height = height;
  this.name = name;
  this.callbacks = Object.assign({}, customCallbacks);
}

Object.defineProperties(Level.prototype, {
  state: {
    get: function () {
      return {
        preload: function () {
          game.time.advancedTiming = true; // enables fps monitoring
          if (this.callbacks.hasOwnProperty('preload')) {
            this.callbacks.preload.call(this);
          }
        }.bind(this),
        create: function () {
          game.world.setBounds(0, 0, this.width, this.height);
          this.player = new Player(game.world.centerX, game.world.height - 160);
          this.map = new Tilemap(this.name, this.player);
          wellShader(game.world);

          var totalHeight = levels.slice(currentLevel, levels.length).
            reduce(function (total, current) {
              return total + current.height;
            }, 0);
          this.bottomSign = new DepthSign(game.world.centerX + 100, game.world.height - 100, totalHeight / 16);

          if (this.callbacks.hasOwnProperty('create')) {
            this.callbacks.create.call(this);
          }
          game.world.bringToTop(this.player.sprite);
        }.bind(this),
        update: function() {
          game.camera.follow(this.player.sprite);

          // World Wrapping
          if (this.player.x > this.width / 3 * 2) {
            this.player.sprite.x = this.width / 3;
          } else if (this.player.x < this.width / 3) {
            this.player.sprite.x = this.width / 3 * 2;
          }

          // Level Completion
          if (this.player.sprite.y < 180) {
            if (currentLevel < levels.length - 1 ) {
              currentLevel++;
              game.state.start(levels[currentLevel].name);
            } else if (currentLevel = levels.length - 1) {
              game.state.start('victory');
            }
          }

          this.map.checkCollisions(this.player.sprite);
          this.player.update();
          if (this.callbacks.hasOwnProperty('update')) {
            this.callbacks.update.call(this);
          }
        }.bind(this),
        render: function () {
          // this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
        }
      }
    }
  }
});
var textStyle = {
  fill: 'white'
};
var frame = 0;

menu = {
  create: function () {
    game.world.setBounds(0, 0, 2048 * 3, 6656);
    var background = new Tilemap('level1');

    var title = game.add.text(camera.width / 2, camera.height / 2, 'WELLSPRING', Object.assign(textStyle, {
      fontSize: '80px',
      font: gameFont,
    }));
    title.anchor.set(0.5);
    title.fixedToCamera = true;

    function startGame() {
      game.state.start('level0');
    }

    var startButton = game.add.button(camera.width / 2, camera.height * 0.8,
      'startButton', startGame, this,
      1, 0, 0);
    startButton.anchor.setTo(0.5);
    startButton.fixedToCamera = true;

    var key1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key1.onDown.add(startGame, this);
    var key2 = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    key2.onDown.add(startGame, this);

    wellShader(game.world);
  },
  update: function () {
    game.camera.y = 6656 - camera.height - frame;
    frame++;
  },
};
var playerSpriteWidth, playerSpriteHeight;

var gameFont = 'Josefin Sans';
WebFontConfig = {

  //  'active' means all requested fonts have finished loading
  //  We set a 1 second delay before calling 'createText'.
  //  For some reason if we don't the browser cannot render the text the first time it's created.
  active: function() {
    console.log('fonts loaded')
  },

  //  The Google Fonts we want to load (specify as many as you like in the array)
  google: {
    families: [gameFont]
  }

};


var preload = {
  preload: function () {
    var preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, 'loadingBar');
    preloadBar.anchor.setTo(0.5);
    preloadBar.scale.setTo(0.5);
    game.load.setPreloadSprite(preloadBar);

    playerSpriteWidth = 329;
    playerSpriteHeight = 324;
    var frames = 32;
    game.load.spritesheet('player', 'sprites/Player.png', playerSpriteWidth, playerSpriteHeight, frames);
    game.load.spritesheet('startButton', 'sprites/start_button.png', 175, 74);

    game.load.tilemap('level0', 'tilemaps/level0-tripled.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level1', 'tilemaps/level1-tripled.json',null,Phaser.Tilemap.TILED_JSON);

    game.load.image('grassLedgeTile','tilemaps/ledgeTile.png');
    game.load.image('stoneLedgeTile','tilemaps/stoneledgetiled.png');
    game.load.image('wellBottom','tilemaps/stoneledge.png');
    game.load.image('ladder','tilemaps/ladder.png');
    game.load.image('wallTile','tilemaps/wallTile.png');
    game.load.image('vineTile', 'tilemaps/vineTile.png');
    game.load.image('arrow_keys', 'sprites/keys.png');
    game.load.image('sign', 'sprites/sign.png');
    game.load.image('victory_bg', 'sprites/landscape.png');

    //  Load the Google WebFont Loader script
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    game.load.audio('grassFall', 'audio/grass_fall.mp3');
    game.load.audio('grassStep', 'audio/grass_step.mp3');
    game.load.audio('cave_noise', 'audio/cave_noise.mp3');
    game.load.audio('vine_rustles', 'audio/vine_rustles.mp3');
  },
  create: function () {
    game.state.start(startState);
  }
};
var victory = {
  create: function () {
    var bg = game.add.sprite(0, 0, 'victory_bg');
    bg.scale.setTo(1.6);
    var player = new Player(camera.width * 0.3, camera.height * 0.9);
    player.sprite.body.gravity.y = 0;
    player.sprite.scale.setTo(0.1);
  }
};
levels[0] = new Level(2048 * 3, 2400, 'level0', {
  create: function () {
    this.tut1 = game.add.group();
    var keys = game.add.sprite(camera.width / 2, camera.height / 2, 'arrow_keys');
    keys.anchor.setTo(0.5);
    var text = game.add.text(camera.width / 2, camera.height * 0.7,
        'IF YOU WANT TO LIVE, MOVE', {
        fontSize: '30px',
        fill: 'white',
        font: gameFont,
      });
    text.anchor.setTo(0.5);
    this.tut1.fixedToCamera = true;

    this.tut1.add(text);
    this.tut1.add(keys);

    var caveNoise = game.add.audio('cave_noise');
    caveNoise.play(null, 0, 0.1, true);

  },
  update: function () {
    if (this.tut1 && (cursors.up.isDown || cursors.left.isDown || cursors.right.isDown ||
        cursors.jump.isDown || cursors.a.isDown || cursors.d.isDown)) {
      this.tut1.removeChildren();
      this.tut1 = false;
    }
    if (!this.hasOwnProperty('tut2') && this.player.sprite.y < this.height - 300) {
      this.tut2 = game.add.text(camera.width / 2, camera.height * 0.7,
        'PRESS UP TO GRAB VINES', {
        fontSize: '30px',
        fill: 'white',
        font: gameFont,
      });
      this.tut2.anchor.setTo(0.5);
      this.tut2.fixedToCamera = true;
    }
    if (this.hasOwnProperty('tut2') && this.tut2 && this.player.climbingVines) {
      this.tut2.kill();
      this.tut2 = false;
    }
  }
});
levels[1] = new Level(2048 * 3, 2400, 'level1');