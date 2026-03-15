const { execSync } = require('child_process');
const path = require('path');

const prismaBin = path.resolve(__dirname, 'node_modules', 'prisma', 'build', 'index.js');
const args = process.argv.slice(2).join(' ');

try {
  console.log(`Running Prisma: ${args}`);
  const out = execSync(`node ${prismaBin} ${args}`, { 
    stdio: 'pipe',
    env: process.env 
  });
  console.log("SUCCESS:\\n", out.toString());
} catch (e) {
  console.error("ERROR:\\n", e.stdout ? e.stdout.toString() : e.message);
  console.error("STDERR:\\n", e.stderr ? e.stderr.toString() : "");
}
