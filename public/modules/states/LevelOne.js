var player, ledges, map, tilemap = 0;

levelOne = {
  preload: function () {
    game.world.setBounds(0, 0, world.width, world.height);
    this.game.time.advancedTiming = true; // enables fps monitoring
  },
  create: function () {
    map = game.add.tilemap('level1');
    map.addTilesetImage('ledgeTile');
    map.addTilesetImage('wallTile');

    var wellTiles = map.createLayer('wall');
    ledges = map.createLayer('ledge');
    map.setCollisionBetween(270, 275, true, 'ledge');
    // var vineTiles = map.createLayer('vine');

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

      'void main( void ) {',
        'float xCoord = gl_FragCoord.x - resolution.x / 2.0;',
        'float renderedX = xCoord * sin((180.0 - viewAngle) / 2.0) /',
          'cos(atan());',
        // 'if (gl_FragCoord.x > resolution.x / 2.0) {',
        //   'float stretchAmt = sin((resolution.x - gl_FragCoord.x) / (resolution.x / 2.0));',
        // '}',
        'gl_FragColor = texture2D(uSampler, vec2(renderedX, vTextureCoord.y));',
      '}'
    ];
    var scanlineFilter = new Phaser.Filter(game, null, fragmentSrc);
    scanlineFilter.uniforms.viewAngle = { type: '1f', value: 180 }; // FOV, in degrees
    scanlineFilter.setResolution(camera.width, camera.height);
    // game.world.filters = [scanlineFilter];
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
