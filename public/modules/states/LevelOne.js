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
    this.game.time.advancedTiming = true; // enables fps monitoring
  },
  create: function () {
    player = new Player(game.world.centerX, game.world.height - 70);
    map = new Tilemap(player);
    wellShader(game.world);
    game.world.bringToTop(player.sprite);
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
    'uniform float     cameraWidth;', // angle of well viewed in radians
    'uniform float     leftEdge;',   // world coordinate of left edge of camera
    'uniform float     worldWidth;', // total width of level
    'const float PI = 3.14159265359;',
    'const float TWOPI = 2.0 * PI;',

    'void main( void ) {',
    'vec4 texColor = texture2D(uSampler, vTextureCoord);',
    'float xCoord = cos((vTextureCoord.x - 0.5) * PI);',
    'float renderedX = worldWidth / TWOPI * sin(TWOPI*xCoord / worldWidth);',
    'gl_FragColor = texColor - 0.3 * abs(1.0 - xCoord);',
    '}'
  ];
  var circularProjection = new Phaser.Filter(game, null, fragmentSrc);
  circularProjection.uniforms.cameraWidth = { type: '1f', value: camera.width }; // FOV, in degrees
  circularProjection.uniforms.leftEdge = { type: '1f', value: game.camera.x - world.width / 3 };
  circularProjection.uniforms.worldWidth = { type: '1f', value: world.width / 3 };
  circularProjection.setResolution(camera.width, camera.height);
  layer.filters = [circularProjection];
}
