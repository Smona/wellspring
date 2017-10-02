var textStyle = {
  fill: 'white'
};

menu = {
  create: function () {
    var title = game.add.text(camera.width / 2, camera.height / 2, 'WELLSPRING', Object.assign(textStyle, {
      fontSize: '80px',
    }));
    title.anchor.set(0.5);

    var startButton = game.add.button(camera.width / 2, camera.height * 0.7, 'START', startGame);
    function startGame() {
      game.state.start('level1');
    }
  }
};