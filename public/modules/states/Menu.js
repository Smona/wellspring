var textStyle = {
  fill: 'white'
};
var frame = 0;

menu = {
  create: function () {
    var background = new Tilemap();

    var title = game.add.text(camera.width / 2, camera.height / 2, 'WELLSPRING', Object.assign(textStyle, {
      fontSize: '80px',
    }));
    title.anchor.set(0.5);
    title.font = gameFont;

    function startGame() {
      game.state.start('level1');
    }

    var startButton = game.add.button(camera.width / 2, camera.height * 0.8,
      'startButton', startGame, this,
      1, 0, 0);
    startButton.anchor.setTo(0.5);

    var key1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key1.onDown.add(startGame, this);
    var key2 = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    key2.onDown.add(startGame, this);
  },
  update: function () {
    game.camera.position.y = world.height - frame;
    frame++;
  }
};