levels[0] = new Level({
  name: 'level0',
  tutorials: [
    {
      end: function () {
        return (cursors.up.isDown || cursors.left.isDown || cursors.right.isDown ||
          cursors.jump.isDown || cursors.a.isDown || cursors.d.isDown);
      },
      text: 'IF YOU WANT TO LIVE, MOVE',
      sprites: {
        'arrow_keys': {
          y: 0.3
        },
      }
    }
  ],
  hooks: {
    create: function () {
      var caveNoise = game.add.audio('cave_noise');
      caveNoise.play(null, 0, 0.1, true);
    }
  }
});