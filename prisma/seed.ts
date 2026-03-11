import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Criar usuário admin padrão
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@motoeciaaracaju.com.br' },
    update: {},
    create: {
      email: 'admin@motoeciaaracaju.com.br',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin criado: ${admin.email}`);

  // Criar configurações iniciais do site
  await prisma.siteConfig.upsert({
    where: { key: 'contato' },
    update: {},
    create: {
      key: 'contato',
      value: {
        whatsapp: '5579999999999',
        email: 'contato@motoeciaaracaju.com.br',
        endereco: 'Aracaju, SE',
        horario: 'Seg-Sex 8h-18h | Sab 8h-13h',
      },
    },
  });
  console.log('✅ Configurações do site criadas');

  console.log('🎉 Seed concluído!');
  console.log('\n📋 Credenciais do admin:');
  console.log('   Email: admin@motoeciaaracaju.com.br');
  console.log('   Senha: admin123');
  console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login em produção!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
