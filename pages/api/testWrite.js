const fs = require('fs');
const path = require('path');

const testFilePath = path.join(__dirname, '../../../loop_data/profile_pictures/test.txt');

fs.writeFile(testFilePath, 'Hello, world!', function(err) {
  if (err) {
    console.error('Could not write to file:', err);
  } else {
    console.log('Successfully wrote to file');
  }
});