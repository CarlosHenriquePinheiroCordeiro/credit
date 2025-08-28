import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { createReadStream, unlink } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { MaximoAbertoFromStreamUseCase } from '../../application/maximo-aberto/maximo-aberto-from-stream.usecase';
import {
  MaximoAbertoPresenter,
  MaximoAbertoResponseDto,
} from './maximo-aberto.presenter';
import { MaximoAbertoResponseDtoSwagger } from './maximo-aberto.presenter.swagger';

@ApiTags('Máximo em Aberto')
@Controller('maximo-aberto')
export class MaximoAbertoController {
  constructor(private readonly useCase: MaximoAbertoFromStreamUseCase) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '/tmp',
        filename: (_, file, cb) =>
          cb(null, `maria-${Date.now()}${extname(file.originalname)}`),
      }),
    }),
  )
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ type: MaximoAbertoResponseDtoSwagger })
  async upload(
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<MaximoAbertoResponseDto> {
    if (!file)
      throw new BadRequestException('Arquivo não enviado (campo "file")');

    const base = createReadStream(file.path);
    const stream = file.originalname.endsWith('.gz')
      ? base.pipe(createGunzip())
      : base;

    try {
      const result = await this.useCase.execute(stream);
      return MaximoAbertoPresenter.maximoAberto(result);
    } finally {
      unlink(file.path, () => undefined);
    }
  }
}
