const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../public', process.argv[2]);
fs.readFile(jsonPath, function (err, data) {
  data = JSON.parse(data);

  // triple overall map width
  data.width *= 3;

  data.layers.forEach(function (t) {
    // triple tile data
    var tripledData = [];
    for (var row = 0; row < t.height; row++) {
      const rowData = t.data.slice(row * t.width, row * t.width + t.width);
      const tripledRowData = rowData.concat(rowData, rowData);
      tripledData = tripledData.concat(tripledRowData);
    }
    t.data = tripledData;

    // triple each layer width
    t.width *= 3;
  });
  fs.writeFile(jsonPath.replace(/.json$/, '-tripled.json'), JSON.stringify(data), 'utf8', function (err, data) {

  });
});