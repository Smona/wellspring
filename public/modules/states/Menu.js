var textStyle = {
  fill: 'white'
};
var frame = 0;
var video;
var sprite;

intro = {
  create: function(){
    game.stage.backgroundColor = "#000000";
    video = game.add.video ("introcut");
    sprite = video.addToWorld(game.world.centerX, game.world.centerY, 0.5, 0.5, 2, 2);
    video.play (false); //Dont loop the video
  }
}



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
      startTime = new Date().getTime();
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
    var soundtrack = game.add.audio('soundtrack');
    soundtrack.play(null, 0, 0.5, true);
  },
  update: function () {
    game.camera.y = game.world.height - camera.height - frame;
    frame++;
  },
};