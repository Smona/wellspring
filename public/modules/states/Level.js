var levels = [ ];
var currentLevel = 0;

function Level(name, customCallbacks) {
  this.name = name;
  this.callbacks = Object.assign({}, customCallbacks);
}

Object.defineProperties(Level.prototype, {
  state: {
    get: function () {
      return {
        preload: function () {
          game.time.advancedTiming = true; // enables fps monitoring
          if (this.callbacks.hasOwnProperty('preload')) {
            this.callbacks.preload.call(this);
          }
        }.bind(this),
        create: function () {
          this.player = new Player(0, 0);
          this.map = new Tilemap(this.name, this.player);
          this.width = this.map.map.widthInPixels;
          this.height = this.map.map.heightInPixels;
          game.world.setBounds(0, 0, this.width, this.height);
          this.player.sprite.position.setTo(game.world.centerX, game.world.height - 90);
          wellShader(game.world);

          var totalHeight = levels.slice(currentLevel, levels.length).
            reduce(function (total, current) {
              return total + current.height;
            }, 0);
          this.bottomSign = new DepthSign(game.world.centerX + 100, game.world.height - 100, totalHeight / 16);

          if (this.callbacks.hasOwnProperty('create')) {
            this.callbacks.create.call(this);
          }
          game.world.bringToTop(this.player.sprite);
          game.world.bringToTop(this.map.stoneLedges);
        }.bind(this),
        update: function() {
          game.camera.follow(this.player.sprite);

          // World Wrapping
          if (this.player.x > this.width / 3 * 2) {
            this.player.sprite.x = this.width / 3;
          } else if (this.player.x < this.width / 3) {
            this.player.sprite.x = this.width / 3 * 2;
          }

          // Level Completion
          if (this.player.sprite.y < 180) {
            if (currentLevel < levels.length - 1 ) {
              currentLevel++;
              game.state.start(levels[currentLevel].name);
            } else if (currentLevel = levels.length - 1) {
              game.state.start('victory');
            }
          }

          this.map.checkCollisions(this.player.sprite);
          this.player.update();
          if (this.callbacks.hasOwnProperty('update')) {
            this.callbacks.update.call(this);
          }
        }.bind(this),
        render: function () {
          // this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
        }
      }
    }
  }
});