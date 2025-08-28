import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ListParcelasQueryDto } from '../../../../src/web/parcela/parcela.dto';

describe('ListParcelasQueryDto', () => {
  it('contratoId é obrigatório', async () => {
    const dto = plainToInstance(ListParcelasQueryDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('page/limit transformam para number e validam', async () => {
    const dto = plainToInstance(ListParcelasQueryDto, {
      contratoId: 'C1',
      page: '2',
      limit: '10',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(10);
  });
});
