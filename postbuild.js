const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, 'dist');
const destination = path.resolve(__dirname, 'public');

// Check if 'dist' exists before renaming
if (fs.existsSync(source)) {
  fs.renameSync(source, destination, err => {
    if (err) throw err;
    console.log('Successfully renamed the directory from "dist" to "public".');
  });
}
