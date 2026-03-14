const { execSync } = require('child_process');

console.log('Iniciando prisma db push...');
try {
  const result = execSync('npx prisma db push --schema=../../prisma/schema.prisma --accept-data-loss', {
    cwd: __dirname,
    env: { ...process.env, DATABASE_URL: "postgresql://moto_e_cia_website_user:bbnhjweYuLZXTV8RiYAQV4yBOt3Al00U@dpg-d6qqd6h4tr6s73fv4mg0-a.oregon-postgres.render.com/moto_e_cia_website" },
    stdio: 'inherit'
  });
  console.log('Sucesso!');
} catch (e) {
  console.error('Erro na execução:', e.message);
}
