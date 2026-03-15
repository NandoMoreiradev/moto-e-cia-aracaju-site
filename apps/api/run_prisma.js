const { execSync } = require('child_process');
const fs = require('fs');
try {
  console.log("Starting Prisma Generation");
  const out = execSync("npx prisma generate --schema=prisma/schema.prisma", { cwd: "..\\..\\" , stdio: 'pipe' });
  fs.writeFileSync('prisma_out.txt', out.toString());
  console.log("Done");
} catch (e) {
  fs.writeFileSync('prisma_err.txt', e.toString() + '\\n' + (e.stdout ? e.stdout.toString() : '') + '\\n' + (e.stderr ? e.stderr.toString() : ''));
  console.log("Error");
}
