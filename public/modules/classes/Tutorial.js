var tutFont = {
  fontSize: '30px',
  fill: 'white',
  font: gameFont,
  align: 'center',
  wordWrap: true,
  wordWrapWidth: 500
};

function Tutorial(args) {
  this.condition = args.condition;
  var group = game.add.group();

  // Add tutorial text
  if (args.hasOwnProperty('text')) {
    var text = game.add.text(camera.width / 2, camera.height * 0.5,
      args.text, tutFont);
    text.anchor.setTo(0.5);
    group.add(text);
  }

  // Add tutorial sprites
  if (args.hasOwnProperty('sprites')) {
    Object.keys(args.sprites).forEach(function (key) {
      var settings = args.sprites[key];
      var x = settings.x || 0.5;
      var y = settings.y || 0.5;
      var sprite = game.add.sprite(camera.width * x, camera.height * y, key);
      sprite.anchor.setTo(0.5);
      group.add(sprite);
    });
  }

  group.fixedToCamera = true;
  this.group = group;
}

Tutorial.prototype.complete = function () {
  this.group.removeChildren();
};