import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class R2Service {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(private configService: ConfigService) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID') || '';
    this.bucket = this.configService.get<string>('R2_BUCKET_NAME') || 'moto-e-cia';
    this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL') || '';

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        // Acesso público se o bucket estiver configurado com domínio público
      }),
    );

    return `${this.publicUrl}/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      // Log do erro mas não lança exceção (arquivo pode já não existir)
      console.error(`Erro ao deletar arquivo R2 "${key}":`, error);
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn });
  }
}
