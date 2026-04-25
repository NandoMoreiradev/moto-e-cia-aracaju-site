import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(AiService.name);

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn('GEMINI_API_KEY não configurada. Serviço de IA indisponível.');
    }
  }

  async generateMotoSpecs(marca: string, nome: string): Promise<any> {
    if (!this.genAI) {
      throw new HttpException(
        'Serviço de IA não configurado. Adicione a variável GEMINI_API_KEY no arquivo .env.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Você é um especialista em motocicletas. Quero que busque as especificações técnicas da moto "${marca} ${nome}".
Retorne ESTRITAMENTE um objeto JSON, sem nenhum texto antes ou depois (sem formatação markdown como \`\`\`json).
As chaves do JSON DEVEM ser exatas (em string):
- motor (ex: "Monocilíndrico, 4 tempos, DOHC")
- cilindrada (ex: "776 cm³")
- refrigeracao
- alimentacao
- relacaoCompressao
- potencia (ex: "83 cv a 8.500 rpm")
- torque (ex: "78 Nm a 6.500 rpm")
- partida
- embreagem
- cambio
- comprimento
- largura
- altura
- distanciaEntreEixos
- alturaAssento
- peso (ex: "193 kg")
- tanque (ex: "20 L")
- capacidadeOleo
- suspensaoD
- suspensaoT
- freioD
- freioT
- pneuDianteiro
- pneuTraseiro

Se não encontrar uma informação exata, deixe o valor como string vazia "".
MUITO IMPORTANTE: Não retorne absolutamente NADA além do JSON puro.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Limpeza de markdown caso a IA ignore a instrução
      if (text.startsWith('\`\`\`json')) {
        text = text.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
      } else if (text.startsWith('\`\`\`')) {
        text = text.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
      }

      try {
        const specs = JSON.parse(text);
        return specs;
      } catch (e) {
        this.logger.error('Falha ao parsear o JSON retornado pela IA:', text);
        throw new HttpException('A IA retornou um formato inválido.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      this.logger.error('Erro ao chamar o Gemini:', error);
      throw new HttpException('Erro ao comunicar com a IA.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
