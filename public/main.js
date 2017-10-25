var startState = 'menu';
var camera = {
  width: 682,
  height: 400,
};

var game = new Phaser.Game(camera.width, camera.height, Phaser.AUTO, 'game-root');

game.state.add('boot', boot);
game.state.add('preload', preload);
game.state.add('menu', menu);
game.state.add('level0', new Level(2048 * 3, 1664, 'level0', 'level1', {
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
    if (this.tut1 && (cursors.up.isDown || cursors.left.isDown || cursors.right.isDown)) {
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
}).state)
game.state.add('level1', new Level(2048 * 3, 6656, 'level1').state);


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
