export type ParcelaStreamItem = {
  valorvencimento: number;
  datavencimento: string;
  totalpago?: number;
};

export interface ParcelaStreamGateway {
  iterateFromJsonStream(
    input: NodeJS.ReadableStream,
  ): AsyncIterable<ParcelaStreamItem>;
}
