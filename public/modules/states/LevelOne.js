var player, ledges, map, tilemap = 0;

var world = {
  width: 2048 * 3,
  height: 6656,
};
var camera = {
  width: world.width / 3 / 4,
  height: 300,
};

levelOne = {
  preload: function () {
    game.world.setBounds(0, 0, world.width, world.height);
    this.game.time.advancedTiming = true; // enables fps monitoring
  },
  create: function () {
    map = game.add.tilemap('level1');
    map.addTilesetImage('ledgeTile');
    map.addTilesetImage('wallTile');
    map.addTilesetImage('vineTile');

    var wellTiles = map.createLayer('wall');
    ledges = map.createLayer('ledge');
    map.setCollisionBetween(270, 275, true, 'ledge');
    var vineTiles = map.createLayer('vine');

    player = new Player(game.world.centerX, game.world.height - 50);

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
      'uniform float     viewAngle;', // angle of well viewed in radians
      'uniform float     leftEdge;',   // world coordinate of left edge of camera
      'uniform float     worldWidth;', // total width of level
      'const float TWOPI = 2.0 * 3.14159265359;',

      'void main( void ) {',
        'float xCoord = vTextureCoord.x + leftEdge - worldWidth / 2.0;',
        // 'float renderedX = xCoord;',
        'float renderedX = worldWidth / TWOPI * sin(TWOPI*xCoord / worldWidth);',
        // 'if (gl_FragCoord.x > resolution.x / 2.0) {',
        //   'float stretchAmt = sin((resolution.x - gl_FragCoord.x) / (resolution.x / 2.0));',
        // '}',
        'gl_FragColor = texture2D(uSampler, vec2(renderedX, vTextureCoord.y));',
      '}'
    ];
    var circularProjection = new Phaser.Filter(game, null, fragmentSrc);
    circularProjection.uniforms.viewAngle = { type: '1f', value: 180 }; // FOV, in degrees
    circularProjection.uniforms.leftEdge = { type: '1f', value: game.camera.x - world.width / 3 };
    circularProjection.uniforms.worldWidth = { type: '1f', value: world.width / 3 };
    circularProjection.setResolution(camera.width, camera.height);
    // game.world.filters = [circularProjection];
  },
  update: function() {
    game.camera.follow(player.sprite);
    game.physics.arcade.collide(player.sprite, ledges, null, function (playerSprite, ledge) {
      // Allows the player to jump through the bottom of ledges
      return ledge.collides &&
        playerSprite.position.y - playerSprite.body.height * playerSprite.anchor.y <=
          ledge.worldY - ledge.height + 10;
    });

    // World Wrapping
    if (player.x > world.width / 3 * 2) {
      player.sprite.x = world.width / 3;
    } else if (player.x < world.width / 3) {
      player.sprite.x = world.width / 3 * 2;
    }
    player.update();
  },
  render: function () {
    // this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
  }
};
