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
    if (this.onGround && !this.climbingLadder) {
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
  if (!this.onVine && this.climbingVines) {
    if (cursors.up.isDown || cursors.w.isDown) {
      this.sprite.body.velocity.y = 0;
    } else {
      this.climbingVines = false;
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

var fallTimer, ladderColliders;
// Generate array of non-0 indexes
var indexes = new Array(2000);
for (var i = 0; i < indexes.length; i++) {
  indexes[i] = i + 1;
}

function Tilemap(key, player) {
  var map = game.add.tilemap(key);
  var that = this;

  function setupLayer(layerName, cb) {
    var hasLayer = map.layers.filter(function (layer) {
      return layer.name === layerName;
    }).length > 0;
    if (hasLayer) {
      cb.call(that);
      that[layerName] = map.createLayer(layerName);
      climbBehavior(layerName);
    }
  }
  function climbBehavior(layerName) {
    if (typeof player !== 'undefined') {
      map.setCollisionByExclusion([0], false, that[layerName]);
      var fallTimer;
      var propName = 'on' + layerName.charAt(0).toUpperCase() + layerName.slice(1);

      // Remove vine/player separation and add grabbing mechanic
      map.setTileIndexCallback(indexes, function (playerSprite, tile) {
        if (!!fallTimer) {
          clearTimeout(fallTimer);
        }
        player[propName] = tile;
        fallTimer = setTimeout(function () {
          player[propName] = false;
        }, 32);
      }, game, that[layerName]);
    }
  }

  map.addTilesetImage('grassLedgeTile');
  map.addTilesetImage('stoneLedgeTile');
  map.addTilesetImage('wellBottom');
  map.addTilesetImage('wallTile');

  this.wellTiles = map.createLayer('wall');
  this.ledges = map.createLayer('grassLedge');

  setupLayer('vine', function() {
    map.addTilesetImage('vineTile');
  });

  this.stoneLedges = map.createLayer('stoneLedge');
  this.wellBottom = map.createLayer('stone');
  if (typeof player !== 'undefined') {
    map.setCollisionByExclusion([0], true, this.ledges);
    // Only collide top of grass ledges
    this.ledges.layer.data.forEach(function(arr) {
      arr.forEach(function(tile) {
        if (tile.index >= 0) {
          tile.collideLeft = false;
          tile.collideRight = false;
          tile.collideDown = false;
        }
      })
    });
    map.setCollisionByExclusion([0], true, this.stoneLedges);
    map.setCollisionByExclusion([0], true, this.wellBottom);
  }
  setupLayer('ladder', function() {
    map.addTilesetImage('ladder');
  });

  this.map = map;
  this.player = player;
}

Tilemap.prototype.checkCollisions = function (body) {
  if (this.ladder) {
    game.physics.arcade.collide(body, this.ladder);
  }
  if (this.vine) {
    game.physics.arcade.collide(body, this.vine);
  }
  game.physics.arcade.collide(body, this.ledges, function() {
    this.player.on = 'grass';
  }, null, this);
  game.physics.arcade.collide(body, this.wellBottom, function() {
    this.player.on = 'stone';
  }, null, this);
};

Tilemap.prototype.destroy = function () {
  this.stoneLedges.destroy();
  this.ledges.destroy();
  this.wellBottom.destroy();
  this.wellTiles.destroy();
  if (this.vine) {
    this.vine.destroy();
  }
  if (this.ladder) {
    this.ladder.destroy();
  }
  this.map.destroy();
};
var tutFont = {
  fontSize: '25px',
  fill: 'white',
  strokeThickness: 2,
  stroke: 'black',
  font: gameFont,
  align: 'center',
  wordWrap: true,
  wordWrapWidth: 500
};

function Tutorial(args) {
  this.end = args.end;
  this.text = args.text || '';
  this.sprites = args.sprites || false;
  if (args.hasOwnProperty('begin')) {
    this.begin = args.begin;
    this.created = false;
  } else {
    this.render();
  }
}

Tutorial.prototype.render = function () {
  var group = game.add.group();

  // Add tutorial text
  var text = game.add.text(camera.width / 2, camera.height * 0.5,
    this.text, tutFont);
  text.anchor.setTo(0.5);
  group.add(text);

  // Add tutorial sprites
  if (this.sprites) {
    var sprites = this.sprites;
    Object.keys(this.sprites).forEach(function (key) {
      var settings = sprites[key];
      var x = settings.x || 0.5;
      var y = settings.y || 0.5;
      var sprite = game.add.sprite(camera.width * x, camera.height * y, key);
      sprite.anchor.setTo(0.5);
      group.add(sprite);
    });
  }

  group.fixedToCamera = true;
  this.group = group;
  this.created = true;
};

Tutorial.prototype.complete = function () {
  if (this.hasOwnProperty('group')) {
    this.group.removeChildren();
  }
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
intro = {
  create: function () {
    
  }
};
var levels = [ ];
var currentLevel = 0;

function Level(args) {
  this.name = args.name;
  this.tutorials = args.tutorials;
  this.callbacks = Object.assign({}, args.hooks);
  this.animation = false; // Level transition animation started
}

// Width and height getters allow access to width and height
// before level is initialized
Object.defineProperties(Level.prototype, {
  width: {
    get: function () {
      if (!this.hasOwnProperty('map')) {
        var map = new Tilemap(this.name);
        var width = map.map.widthInPixels;
        map.destroy();
        return width;
      } else {
        return this.map.map.widthInPixels;
      }
    }
  },
  height: {
    get: function () {
      if (!this.hasOwnProperty('map')) {
        var map = new Tilemap(this.name);
        var height = map.map.heightInPixels;
        map.destroy();
        return height;
      } else {
        return this.map.map.heightInPixels;
      }
    }
  },
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
          // Setup world
          this.player = new Player(0, 0);
          this.map = new Tilemap(this.name, this.player);
          this.width = this.map.map.widthInPixels;
          this.height = this.map.map.heightInPixels;
          game.world.setBounds(0, 0, this.width, this.height);
          this.player.sprite.position.setTo(game.world.centerX, game.world.height - 90);
          wellShader(game.world);

          // Add depth sign
          var totalHeight = levels.slice(currentLevel, levels.length).
            reduce(function (total, current) {
              return total + current.height;
            }, 0);
          this.bottomSign = new DepthSign(game.world.centerX + 100, game.world.height - 130, totalHeight / 16);

          // Initialize tutorials
          if (this.tutorials) {
            this.tutorials = this.tutorials.map(function (options) {
              return new Tutorial(options);
            })
          }

          if (this.callbacks.hasOwnProperty('create')) {
            this.callbacks.create.call(this);
          }
          game.world.bringToTop(this.player.sprite);

        }.bind(this),
        update: function() {
          // Check tutorials for creation
          if (this.tutorials) {
            this.tutorials.forEach(function (tut) {
              if (!tut.created && tut.begin.call(this)) {
                tut.render();
              }
            }.bind(this));

            // Check tutorials for completion
            this.tutorials = this.tutorials.filter(function (tut) {
              var completed = tut.created && tut.end.call(this);
              if (completed) {
                tut.complete();
              }
              return !completed;
            }.bind(this));
          }

          game.camera.follow(this.player.sprite);

          // World Wrapping
          if (this.player.x > this.width / 3 * 2) {
            this.player.sprite.x = this.width / 3;
          } else if (this.player.x < this.width / 3) {
            this.player.sprite.x = this.width / 3 * 2;
          }

          // Level Completion
          if (this.player.sprite.y < 180 && !this.animation) {
            var transition = game.add.graphics(0,0);
            transition.beginFill(0, 0.1);
            transition.drawRect(0,0,game.world.width,game.world.height);
            var frame = 0;
            function animation() {
              if (frame >= 35) {
                window.clearInterval(this.animation);
                if (currentLevel < levels.length - 1 ) {
                  currentLevel++;
                  game.state.start(levels[currentLevel].name);
                } else if (currentLevel = levels.length - 1) {
                  game.state.start('victory');
                }
              } else {
                transition.drawRect(0,0,game.world.width,game.world.height);
                frame++;
                this.animation = window.requestAnimationFrame(animation);
              }
            }
            this.animation = window.requestAnimationFrame(animation);
          }

          // Action
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
var video;
var sprite;

intro = {
  create: function(){
    game.stage.backgroundColor = "#000000";
    video = game.add.video ("introcut");
    sprite = video.addToWorld(game.world.centerX, game.world.centerY, 0.5, 0.5, 2, 2);
    video.play (false); //Dont loop the video
  }
}



menu = {
  create: function () {
    var background = new Tilemap('level1');
    game.world.setBounds(0, 0, background.map.widthInPixels, background.map.heightInPixels);

    var title = game.add.text(camera.width / 2, camera.height / 2, 'WELLSPRING', Object.assign(textStyle, {
      fontSize: '80px',
      font: gameFont,
    }));
    title.anchor.set(0.5);
    title.fixedToCamera = true;

    function startGame() {
      game.state.start('level0');
      startTime = new Date().getTime();
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
    var soundtrack = game.add.audio('soundtrack');
    soundtrack.play(null, 0, 0.5, true);
  },
  update: function () {
    game.camera.y = game.world.height - camera.height - frame;
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
    game.load.tilemap('level2', 'tilemaps/level2-tripled.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level3', 'tilemaps/level3-tripled.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level4', 'tilemaps/level4-tripled.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level5', 'tilemaps/level5-tripled.json',null,Phaser.Tilemap.TILED_JSON);

    game.load.image('grassLedgeTile','tilemaps/ledgeTile.png');
    game.load.image('stoneLedgeTile','tilemaps/stoneledgetiled.png');
    game.load.image('wellBottom','tilemaps/stoneledge.png');
    game.load.image('ladder','tilemaps/ladder.png');
    game.load.image('wallTile','tilemaps/wallTile.png');
    game.load.image('vineTile', 'tilemaps/vineTile.png');
    game.load.image("up_arrow", "sprites/up.png");
    game.load.image('arrow_keys', 'sprites/keys.png');
    game.load.image('sign', 'sprites/sign.png');
    game.load.image('victory_bg', 'sprites/landscape.png');

    //  Load the Google WebFont Loader script
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    game.load.video ("introcut", "audio/introcut.mp4");
    game.load.audio('grass_fall', 'audio/grass_fall.mp3');
    game.load.audio('grass_step', 'audio/grass_step.mp3');
    game.load.audio('cave_noise', 'audio/cave_noise.mp3');
    game.load.audio('vine_rustles', 'audio/vine_rustles.mp3');
    game.load.audio('soundtrack', 'audio/wellspring.mp3');
    game.load.audio('stone_step', 'audio/stone_step.mp3');
    game.load.audio('stone_fall', 'audio/stone_fall.mp3');
  },
  create: function () {
    game.state.start(startState);
  }
};
var victory = {
  create: function () {
    game.input.keyboard.clearCaptures();
    var bg = game.add.sprite(0, 0, 'victory_bg');
    bg.scale.setTo(1.6);
    var player = new Player(camera.width * 0.3, camera.height * 0.9);
    player.sprite.body.gravity.y = 0;
    player.sprite.scale.setTo(0.1);
    player.sprite.animations.play('dance');

    var runtime = new Date().getTime() - startTime;

    var root = document.getElementById('game-root');
    var form = document.createElement('form');
    form.id = 'score-form';
    var header = document.createElement('h1');
    var displayTime = (runtime / 1000).toFixed(1);
    header.appendChild(document.createTextNode('YOU ESCAPED IN ' + displayTime + ' SECONDS!'));
    root.appendChild(header);
    var input = document.createElement('input');
    input.setAttribute('size', '1');
    input.id = 'name-field';
    var label = document.createElement('label');
    label.setAttribute('for', 'name-field');
    label.appendChild(document.createTextNode('NICKNAME'));
    var submit = document.createElement('button');
    submit.appendChild(document.createTextNode('UPLOAD SCORE'));

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // form validation
      if (input.value === '') return;

      // Create scores table
      var tableContainer = document.createElement('div');
      tableContainer.id = 'score-form';
      var scoresTable = document.createElement('table');
      tableContainer.appendChild(scoresTable);
      var header = document.createElement('th');
      header.appendChild(document.createTextNode('HIGH SCORES'));
      header.setAttribute('colspan', '2');
      scoresTable.appendChild(header);

      // Upload Score
      db.add({
        name: input.value,
        time: runtime,
      }).then(function () {
        db.orderBy('time').limit(10).get().then(function (docs) {
          docs.forEach(function (doc) {
            var data = doc.data();
            var row = document.createElement('tr');

            var name = document.createElement('td');
            name.appendChild(document.createTextNode(data.name));
            var score = document.createElement('td');
            var formattedTime = (data.time / 1000).toFixed(1);
            score.appendChild(document.createTextNode(formattedTime + 's'));

            row.appendChild(name);
            row.appendChild(score);
            scoresTable.appendChild(row);
          });

          root.removeChild(form);
          root.appendChild(tableContainer);
        });
      });
    });

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(submit);

    root.appendChild(form);
    input.focus();
  }
};
levels[0] = new Level({
  name: 'level0',
  tutorials: [
    {
      text: 'IF YOU WANT TO LIVE, MOVE',
      end: function () {
        return (cursors.up.isDown || cursors.left.isDown || cursors.right.isDown ||
          cursors.jump.isDown || cursors.a.isDown || cursors.d.isDown);
      },
      sprites: {
        'arrow_keys': {
          y: 0.3
        },
      }
    },
    {
      text: 'PRESS UP TO GRAB THE LADDER',
      begin: function () {
        return this.player.sprite.position.y < this.height - 2000; //&& this.player.climbingVines;
      },
      end: function () {
        return this.player.climbingLadder;
      },
      sprites: {
        'up_arrow': {
          y: 0.4
        },
      }
    },
  ],
  hooks: {
    create: function () {
      var caveNoise = game.add.audio('cave_noise');
      caveNoise.play(null, 0, 0.1, true);
    }
  }
});
levels[1] = new Level({
  name: 'level1',
  tutorials: [
    {
      text: 'PRESS UP TO GRAB VINES',
      end: function () {
        return this.player.climbingVines;
      },
      sprites: {
        'up_arrow': {
          y: 0.4
        }
      }
    },
    {
      text: 'THESE VINES SEEM STURDY ENOUGH TO JUMP OFF',
      begin: function () {
        return this.player.sprite.position.y < this.height - 500 && this.player.climbingVines;
      },
      end: function () {
        return cursors.jump.isDown;
      }
    }
  ],
  hooks: {
    create: function() {
      this.player.sprite.position.x -= 150;
    }
  }
});
levels[2] = new Level({
    name: 'level2',
});
levels[3] = new Level({
  name: 'level3',
});
levels[4] = new Level({
  name: 'level4',
});
levels[5] = new Level({
  name: 'level5',
});
var startState = 'menu';
var camera = {
  width: 682,
  height: 400,
};
var startTime;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBenRDTk0wrxZIXythU8DMWMzXxSjiLyx0",
  authDomain: "wellspring-8cf13.firebaseapp.com",
  databaseURL: "https://wellspring-8cf13.firebaseio.com",
  projectId: "wellspring-8cf13",
  storageBucket: "",
  messagingSenderId: "406665721598"
};
firebase.initializeApp(config);
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore().collection('highscores');

var game = new Phaser.Game(camera.width, camera.height, Phaser.CANVAS, 'game-root');

game.state.add('boot', boot);
game.state.add('preload', preload);
game.state.add('menu', menu);
levels.forEach(function (level) {
  game.state.add(level.name, level.state)
});
game.state.add('victory', victory);


window.onload = function () {
  game.state.start('boot');
};

function wellShader(layer) {
  var fragmentSrc = [
    'precision mediump float;',
    // Incoming texture coordinates.
    'varying vec2 vTextureCoord;',
    // Incoming vertex color
    'varying vec4 vColor;',
    // Sampler for a) sprite image or b) rendertarget in case of game.world.filter
    'uniform sampler2D uSampler;',

    'uniform vec2      resolution;',
    'uniform float     time;',
    'uniform vec2      mouse;',
    'uniform float     cameraWidth;', // angle of well viewed in radians
    'const float PI = 3.14159265359;',
    'const float TWOPI = 2.0 * PI;',

    'void main( void ) {',
    'vec4 texColor = texture2D(uSampler, vTextureCoord);',
    'float xCoord = cos((vTextureCoord.x - 0.5) * PI / 3.0);',
    // 'float renderedX = worldWidth / TWOPI * sin(TWOPI*xCoord / worldWidth);',
    'gl_FragColor = texColor - 2.0 *  abs(1.0 - xCoord);',
    '}'
  ];
  var circularProjection = new Phaser.Filter(game, null, fragmentSrc);
  circularProjection.uniforms.cameraWidth = { type: '1f', value: camera.width }; // FOV, in degrees
  circularProjection.setResolution(camera.width, camera.height);
  layer.filters = [circularProjection];
}
