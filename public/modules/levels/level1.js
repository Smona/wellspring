levels[1] = new Level({
  name: 'level1',
  tutorials: [
    {
      text: 'PRESS UP TO GRAB VINES',
      end: function () {
        return this.player.climbingVines;
      },
      sprites: {
        'up_arrow': {
          y: 0.4
        }
      }
    },
    {
      text: 'THESE VINES SEEM STURDY ENOUGH TO JUMP OFF',
      begin: function () {
        return this.player.sprite.position.y < this.height - 500 && this.player.climbingVines;
      },
      end: function () {
        return cursors.jump.isDown;
      }
    }
  ],
  hooks: {
    create: function() {
      this.player.sprite.position.x -= 150;
    }
  }
});