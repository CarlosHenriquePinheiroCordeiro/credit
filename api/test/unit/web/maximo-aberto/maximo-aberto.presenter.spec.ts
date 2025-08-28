import { MaximoAbertoPresenter } from '../../../../src/web/maximo-aberto/maximo-aberto.presenter';

it('MaximoAbertoPresenter.maximoAberto → passthrough', () => {
  const input = { mes: '2025-01', total_aberto: 321.99 };
  expect(MaximoAbertoPresenter.maximoAberto(input)).toBe(input);
});
