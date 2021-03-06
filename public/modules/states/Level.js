var levels = [ ];
var currentLevel = 0;

function Level(args) {
  this.name = args.name;
  this.tutorials = args.tutorials;
  this.callbacks = Object.assign({}, args.hooks);
  this.animation = false; // Level transition animation started
}

// Width and height getters allow access to width and height
// before level is initialized
Object.defineProperties(Level.prototype, {
  width: {
    get: function () {
      if (!this.hasOwnProperty('map')) {
        var map = new Tilemap(this.name);
        var width = map.map.widthInPixels;
        map.destroy();
        return width;
      } else {
        return this.map.map.widthInPixels;
      }
    }
  },
  height: {
    get: function () {
      if (!this.hasOwnProperty('map')) {
        var map = new Tilemap(this.name);
        var height = map.map.heightInPixels;
        map.destroy();
        return height;
      } else {
        return this.map.map.heightInPixels;
      }
    }
  },
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
          // Setup world
          this.player = new Player(0, 0);
          this.map = new Tilemap(this.name, this.player);
          this.width = this.map.map.widthInPixels;
          this.height = this.map.map.heightInPixels;
          game.world.setBounds(0, 0, this.width, this.height);
          this.player.sprite.position.setTo(game.world.centerX, game.world.height - 90);
          wellShader(game.world);

          // Add depth sign
          var totalHeight = levels.slice(currentLevel, levels.length).
            reduce(function (total, current) {
              return total + current.height;
            }, 0);
          this.bottomSign = new DepthSign(game.world.centerX + 100, game.world.height - 130, totalHeight / 16);

          // Initialize tutorials
          if (this.tutorials) {
            this.tutorials = this.tutorials.map(function (options) {
              return new Tutorial(options);
            })
          }

          if (this.callbacks.hasOwnProperty('create')) {
            this.callbacks.create.call(this);
          }
          game.world.bringToTop(this.player.sprite);

        }.bind(this),
        update: function() {
          // Check tutorials for creation
          if (this.tutorials) {
            this.tutorials.forEach(function (tut) {
              if (!tut.created && tut.begin.call(this)) {
                tut.render();
              }
            }.bind(this));

            // Check tutorials for completion
            this.tutorials = this.tutorials.filter(function (tut) {
              var completed = tut.created && tut.end.call(this);
              if (completed) {
                tut.complete();
              }
              return !completed;
            }.bind(this));
          }

          game.camera.follow(this.player.sprite);

          // World Wrapping
          if (this.player.x > this.width / 3 * 2) {
            this.player.sprite.x = this.width / 3;
          } else if (this.player.x < this.width / 3) {
            this.player.sprite.x = this.width / 3 * 2;
          }

          // Level Completion
          if (this.player.sprite.y < 180 && !this.animation) {
            var transition = game.add.graphics(0,0);
            transition.beginFill(0, 0.1);
            transition.drawRect(0,0,game.world.width,game.world.height);
            var frame = 0;
            function animation() {
              if (frame >= 35) {
                window.clearInterval(this.animation);
                if (currentLevel < levels.length - 1 ) {
                  currentLevel++;
                  game.state.start(levels[currentLevel].name);
                } else if (currentLevel = levels.length - 1) {
                  game.state.start('victory');
                }
              } else {
                transition.drawRect(0,0,game.world.width,game.world.height);
                frame++;
                this.animation = window.requestAnimationFrame(animation);
              }
            }
            this.animation = window.requestAnimationFrame(animation);
          }

          // Action
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