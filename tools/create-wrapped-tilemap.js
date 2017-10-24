const fs = require('fs');
const path = require('path');

const jsonPaths = process.argv.slice(2, process.argv.length);
jsonPaths.forEach(function (relPath) {
  const absPath = path.join(__dirname, '../public', relPath);
  fs.readFile(absPath, function (err, data) {
    if (err) {
      console.error(err);
      return 1;
    }
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
    fs.writeFile(absPath.replace(/.json$/, '-tripled.json'), JSON.stringify(data), 'utf8', function (err, data) {

    });
  });
});
