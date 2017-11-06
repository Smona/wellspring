var startState = 'level1';
var camera = {
  width: 682,
  height: 400,
};

var game = new Phaser.Game(camera.width, camera.height, Phaser.AUTO, 'game-root');

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
