const { exec } = require('child_process');
const fs = require('fs');

console.log('Starting TypeScript build...');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Compile TypeScript files
exec('npx tsc -p .', (error, stdout, stderr) => {
  if (error) {
    console.error(`Build error: ${error}`);
    return;
  }
  
  if (stderr) {
    console.error(`Build stderr: ${stderr}`);
    return;
  }
  
  console.log(`Build stdout: ${stdout}`);
  console.log('Build completed successfully');
});