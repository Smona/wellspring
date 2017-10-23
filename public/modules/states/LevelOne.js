var player, map;

var world = {
  width: 2048 * 3,
  height: 6656,
};
var camera = {
  width: world.width / 3 / 3,
  height: 400,
};

levelOne = {
  preload: function () {
    game.world.setBounds(0, 0, world.width, world.height);
    this.game.time.advancedTiming = true; // enables fps monitoring
  },
  create: function () {
    player = new Player(game.world.centerX, game.world.height - 70);
    map = new Tilemap(player);
    // wellShader(game.world);
  },
  update: function() {
    game.camera.follow(player.sprite);

    // World Wrapping
    if (player.x > world.width / 3 * 2) {
      player.sprite.x = world.width / 3;
    } else if (player.x < world.width / 3) {
      player.sprite.x = world.width / 3 * 2;
    }

    map.checkCollisions(player.sprite);
    player.update();
  },
  render: function () {
    // this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
  }
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
    // 'gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * xCoord;',
    'gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * xCoord;',
    '}'
  ];
  var circularProjection = new Phaser.Filter(game, null, fragmentSrc);
  circularProjection.uniforms.viewAngle = { type: '1f', value: 180 }; // FOV, in degrees
  circularProjection.uniforms.leftEdge = { type: '1f', value: game.camera.x - world.width / 3 };
  circularProjection.uniforms.worldWidth = { type: '1f', value: world.width / 3 };
  circularProjection.setResolution(camera.width, camera.height);
  layer.filters = [circularProjection];
}
