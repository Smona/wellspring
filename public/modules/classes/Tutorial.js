var tutFont = {
  fontSize: '25px',
  fill: 'white',
  font: gameFont,
  align: 'center',
  wordWrap: true,
  wordWrapWidth: 500
};

function Tutorial(args) {
  this.end = args.end;
  this.text = args.text || '';
  this.sprites = args.sprites || false;
  if (args.hasOwnProperty('begin')) {
    this.begin = args.begin;
    this.created = false;
  } else {
    this.render();
  }
}

Tutorial.prototype.render = function () {
  var group = game.add.group();

  // Add tutorial text
  var text = game.add.text(camera.width / 2, camera.height * 0.5,
    this.text, tutFont);
  text.anchor.setTo(0.5);
  group.add(text);

  // Add tutorial sprites
  if (this.sprites) {
    var sprites = this.sprites;
    Object.keys(this.sprites).forEach(function (key) {
      var settings = sprites[key];
      var x = settings.x || 0.5;
      var y = settings.y || 0.5;
      var sprite = game.add.sprite(camera.width * x, camera.height * y, key);
      sprite.anchor.setTo(0.5);
      group.add(sprite);
    });
  }

  group.fixedToCamera = true;
  this.group = group;
  this.created = true;
};

Tutorial.prototype.complete = function () {
  if (this.hasOwnProperty('group')) {
    this.group.removeChildren();
  }
};