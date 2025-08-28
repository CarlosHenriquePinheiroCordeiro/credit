export type MaximoAbertoResponseDto = { mes: string; total_aberto: number };

export class MaximoAbertoPresenter {
  static maximoAberto(resp: MaximoAbertoResponseDto): MaximoAbertoResponseDto {
    return resp;
  }
}
