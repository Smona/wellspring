var startState = 'menu';

var game = new Phaser.Game(camera.width, camera.height, Phaser.CANVAS, 'game-root');

game.state.add('boot', boot);
game.state.add('preload', preload);
game.state.add('menu', menu);
game.state.add('level1', levelOne);


window.onload = function () {
  game.state.start('boot');

  // Remove loading text
  document.body.classList.remove('loading');
}
