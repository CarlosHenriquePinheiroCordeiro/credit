/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { writeFileSync } from 'fs';
import { dump as toYAML } from 'js-yaml';

async function generate() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
    abortOnError: false,
  });

  try {
    await app.init();

    const config = new DocumentBuilder()
      .setTitle('MyCred API')
      .setDescription('Contratos, Parcelas e Máximo em Aberto')
      .setVersion('1.0.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    writeFileSync('openapi.json', JSON.stringify(document, null, 2));
    writeFileSync('openapi.yml', toYAML(document));
    console.log('✅ OpenAPI gerado: openapi.json e openapi.yml');
  } catch (err) {
    process.exitCode = 1;
    console.error('❌ Falha ao gerar OpenAPI:', err);
  } finally {
    await app.close();
    process.exit(process.exitCode ?? 0);
  }
}

generate();
