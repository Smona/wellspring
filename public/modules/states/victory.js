var victory = {
  create: function () {
    var bg = game.add.sprite(0, 0, 'victory_bg');
    bg.scale.setTo(1.6);
    var player = new Player(camera.width * 0.3, camera.height * 0.9);
    player.sprite.body.gravity.y = 0;
    player.sprite.scale.setTo(0.1);
    player.sprite.animations.play('dance');

    var runtime = new Date().getTime() - startTime;

    var root = document.getElementById('game-root');
    var form = document.createElement('form');
    form.id = 'score-form';
    var header = document.createElement('h1');
    header.appendChild(document.createTextNode('YOU ESCAPED IN ' + runtime / 1000 + ' SECONDS!'));
    root.appendChild(header);
    var input = document.createElement('input');
    input.setAttribute('size', '1');
    input.id = 'name-field';
    var label = document.createElement('label');
    label.setAttribute('for', 'name-field');
    label.appendChild(document.createTextNode('NICKNAME'));
    var submit = document.createElement('button');
    submit.appendChild(document.createTextNode('UPLOAD SCORE'));

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // form validation
      if (input.value === '') return;

      // Create scores table
      var tableContainer = document.createElement('div');
      tableContainer.id = 'score-form';
      var scoresTable = document.createElement('table');
      tableContainer.appendChild(scoresTable);
      var header = document.createElement('th');
      header.appendChild(document.createTextNode('HIGH SCORES'));
      header.setAttribute('colspan', '2');
      scoresTable.appendChild(header);

      // Upload Score
      db.add({
        name: input.value,
        time: runtime,
      }).then(function () {
        db.orderBy('time').limit(10).get().then(function (docs) {
          docs.forEach(function (doc) {
            var data = doc.data();
            var row = document.createElement('tr');

            var name = document.createElement('td');
            name.appendChild(document.createTextNode(data.name));
            var score = document.createElement('td');
            var formattedTime = (data.time / 1000).toFixed(1);
            score.appendChild(document.createTextNode(formattedTime + 's'));

            row.appendChild(name);
            row.appendChild(score);
            scoresTable.appendChild(row);
          });

          root.removeChild(form);
          root.appendChild(tableContainer);
        });
      });
    });

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(submit);

    root.appendChild(form);
    input.focus();
  }
};