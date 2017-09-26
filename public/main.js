var world = {
  width: 640,
  height: 3200,
};
var camera = {
  width: 640,
  height: 500,
};
var game = new Phaser.Game(camera.width, camera.height, Phaser.AUTO, 'game-root');

game.state.add('boot', boot);
game.state.add('menu', menu);
game.state.add('level1', levelOne);

game.state.start('boot');
