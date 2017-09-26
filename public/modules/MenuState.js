var textStyle = {
  fill: 'white'
};

menuState = {
  create: function () {
    // Dynamically resize game canvas
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
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