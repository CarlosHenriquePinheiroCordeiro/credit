import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ListContratosQueryDto } from '../../../../src/web/contrato/contrato.dto';

describe('ListContratosQueryDto', () => {
  it('converte page/limit para number e valida', async () => {
    const dto = plainToInstance(ListContratosQueryDto, {
      page: '2',
      limit: '5',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(5);
  });

  it('rejeita limit inválido', async () => {
    const dto = plainToInstance(ListContratosQueryDto, { limit: '0' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
