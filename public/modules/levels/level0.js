levels[0] = new Level({
  name: 'level0',
  tutorials: [
    {
      text: 'IF YOU WANT TO LIVE, MOVE',
      end: function () {
        return (cursors.up.isDown || cursors.left.isDown || cursors.right.isDown ||
          cursors.jump.isDown || cursors.a.isDown || cursors.d.isDown);
      },
      sprites: {
        'arrow_keys': {
          y: 0.3
        },
      }
    },
    {
      text: 'Press up to grab the ladder',
      begin: function () {
        return this.player.sprite.position.y < this.height - 1900; //&& this.player.climbingVines;
      },
      end: function () {
        return this.player.climbingLadder;
      },
      sprites: {
        'up_arrow': {
          y: 0.4
        },
      }
    },
  ],
  hooks: {
    create: function () {
      var caveNoise = game.add.audio('cave_noise');
      caveNoise.play(null, 0, 0.1, true);
    }
  }
});