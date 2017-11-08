levels[0] = new Level('level0', {
  create: function () {
    this.tut1 = game.add.group();
    var space = game.add.sprite(camera.width / 2, camera.height * 0.25, 'space');
    space.anchor.setTo(0.5);
    var keys = game.add.sprite(camera.width / 2, camera.height * 0.3, 'arrow_keys');
    keys.anchor.setTo(0.5);
    var text = game.add.text(camera.width / 2, camera.height * 0.5,
        'IF YOU WANT TO LIVE, MOVE', {
        fontSize: '30px',
        fill: 'white',
        font: gameFont,
      });
    text.anchor.setTo(0.5);
    this.tut1.fixedToCamera = true;

    this.tut1.addMultiple([text, keys, space]);

    var caveNoise = game.add.audio('cave_noise');
    caveNoise.play(null, 0, 0.1, true);

  },
  update: function () {
    if (this.tut1 && (cursors.up.isDown || cursors.left.isDown || cursors.right.isDown ||
        cursors.jump.isDown || cursors.a.isDown || cursors.d.isDown)) {
      this.tut1.removeChildren();
      this.tut1 = false;
    }
  }
});