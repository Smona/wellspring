var textStyle = {
  fill: 'white'
};
var frame = 0;

menu = {
  create: function () {
    var background = new Tilemap('level1');
    game.world.setBounds(0, 0, background.map.widthInPixels, background.map.heightInPixels);

    var title = game.add.text(camera.width / 2, camera.height / 2, 'WELLSPRING', Object.assign(textStyle, {
      fontSize: '80px',
      font: gameFont,
    }));
    title.anchor.set(0.5);
    title.fixedToCamera = true;

    function startGame() {
      game.state.start('level0');
    }

    var startButton = game.add.button(camera.width / 2, camera.height * 0.8,
      'startButton', startGame, this,
      1, 0, 0);
    startButton.anchor.setTo(0.5);
    startButton.fixedToCamera = true;

    var key1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key1.onDown.add(startGame, this);
    var key2 = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    key2.onDown.add(startGame, this);

    wellShader(game.world);
  },
  update: function () {
    game.camera.y = 6656 - camera.height - frame;
    frame++;
  },
};