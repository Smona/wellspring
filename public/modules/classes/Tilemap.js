function Tilemap(key, player) {
  var map = game.add.tilemap(key);
  var that = this;

  function setupLayer(layerName, cb) {
    var hasLayer = map.layers.filter(function (layer) {
      return layer.name === layerName;
    }).length > 0;
    if (hasLayer) {
      console.log('has ' + layerName)
      // Generate array of non-0 indexes
      var indexes = new Array(400);
      for (var i = 0; i < indexes.length; i++) {
        indexes[i] = i + 1;
      }

      cb.call(that, indexes);
    }
  }

  map.addTilesetImage('grassLedgeTile');
  map.addTilesetImage('stoneLedgeTile');
  map.addTilesetImage('wellBottom');
  map.addTilesetImage('wallTile');
  this.wellTiles = map.createLayer('wall');
  this.ledges = map.createLayer('grassLedge');

  setupLayer('vines', function(indexes) {
    map.addTilesetImage('vineTile');
    this.vines = map.createLayer('vine');
    if (typeof player !== 'undefined') {
      map.setCollisionByExclusion([0], true, this.vines);
      var vineFallTimer;

      // Remove vine/player separation and add grabbing mechanic
      map.setTileIndexCallback(indexes, function () {
        if (!!vineFallTimer) {
          clearTimeout(vineFallTimer);
        }
        player.onVines = true;
        vineFallTimer = setTimeout(function () {
          player.onVines = false;
        }, 32);
      }, game, this.vines);
    }
  });

  setupLayer('ladder', function(indexes) {
    map.addTilesetImage('ladder');
    console.log(this)
    this.ladders = map.createLayer('ladder');
    if (typeof player !== 'undefined') {
      map.setCollisionByExclusion([0], true, this.ladders);
      map.setTileIndexCallback(indexes, function () {
        console.log('laddering');
      }, game, this.ladders);
    }
  });

  this.stoneLedges = map.createLayer('stoneLedge');
  this.wellBottom = map.createLayer('stone');
  if (typeof player !== 'undefined') {
    map.setCollisionByExclusion([0], true, this.ledges);
    map.setCollisionByExclusion([0], true, this.stoneLedges);
    map.setCollisionByExclusion([0], true, this.wellBottom);
  }

  this.map = map;
}

Tilemap.prototype.checkCollisions = function (body) {
  game.physics.arcade.collide(body, this.ledges, null, function (collidedBody, ledge) {
    // Allows the player to jump through the bottom of ledges
    var colliding = ledge.collides &&
      collidedBody.position.y - collidedBody.body.height * collidedBody.anchor.y <=
      ledge.worldY - ledge.height + 40;
    return colliding;
  });
  if (this.vines) {
    game.physics.arcade.collide(body, this.vines);
  }
  if (this.ladders) {
    game.physics.arcade.collide(body, this.ladders);
  }
  game.physics.arcade.collide(body, this.wellBottom);
};