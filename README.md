# Contratos e Parcelas

Versão do Node: 22.17.1
Versão do yarn: 4.9.4
Desenvolvido sobre o sistema operacional Linux Mint 22.1

## Como executar os projetos?

### Backend (api)

1. Após clonar o projeto, navegue até a pasta "api"

Não deixe de consultar o endpoint "/docs", onde está localizada a documentação Swagger (OpenAPI) do desenvolvido, podendo testar por lá também.

### Frontend (web)

# API Endpoints

## Contratos

Base URL: `/contratos`

---

## Listar contratos — `GET /contratos`

Retorna uma lista paginada de contratos com filtros opcionais.

### Query params

| Parâmetro       | Tipo                 | Validador            | Descrição                                                                                        |
| --------------- | -------------------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| `contratoLike`  | `string`             | `@IsString()`        | Filtro por parte do identificador do contrato (ILIKE).                                           |
| `dataFrom`      | `string` (ISO date)  | `@IsDateString()`    | Data mínima (inclusive) no formato ISO `YYYY-MM-DD`.                                             |
| `dataTo`        | `string` (ISO date)  | `@IsDateString()`    | Data máxima (inclusive) no formato ISO `YYYY-MM-DD`.                                             |
| `minValorTotal` | `string` numérica    | `@IsNumberString()`  | Valor total mínimo (use ponto como separador decimal).                                           |
| `maxValorTotal` | `string` numérica    | `@IsNumberString()`  | Valor total máximo.                                                                              |
| `hasEntrada`    | `string` booleana    | `@IsBooleanString()` | Filtra por contratos com/sem entrada. Aceita **`"true"`** ou **`"false"`** (atenção: string).    |
| `page`          | `number` inteiro ≥ 1 | `@IsInt() @Min(1)`   | Página (default definido pela aplicação).                                                        |
| `limit`         | `number` inteiro ≥ 1 | `@IsInt() @Min(1)`   | Itens por página.                                                                                |
| `sort`          | `string` enum        | `@IsString()`        | Campo de ordenação: `data` \| `contrato` \| `valortotal` \| `valorentrada` \| `valorfinanciado`. |
| `order`         | `string` enum        | `@IsString()`        | Direção: `ASC` \| `DESC`.                                                                        |

> Observação: `hasEntrada` é **string** por conta do `@IsBooleanString()`. Use `hasEntrada=true` ou `hasEntrada=false` (sem aspas no query string, mas o valor chega como string).

### Exemplo de requisição

```bash
# cURL
curl -s "http://localhost:3000/contratos?contratoLike=2025&dataFrom=2025-01-01&dataTo=2025-12-31&minValorTotal=1000&hasEntrada=true&page=1&limit=20&sort=data&order=DESC"
```

```bash
# HTTPie
http GET :3000/contratos contratoLike==2025 dataFrom==2025-01-01 dataTo==2025-12-31 minValorTotal==1000 hasEntrada==true page==1 limit==20 sort==data order==DESC
```

### Exemplo de resposta `200 OK`

```json
{
  "items": [
    {
      "contrato": "CTR-2025-0001",
      "data": "2025-04-15",
      "valortotal": 15000.5,
      "valorentrada": 3000.0,
      "valorfinanciado": 12000.5,
      "createdAt": "2025-04-16T12:34:56.789Z",
      "updatedAt": "2025-06-01T10:00:00.000Z",
      "qtdParcelas": 12,
      "totalPago": 4500.0
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

---

## Endividamento total — `GET /contratos/endividamento-total`

Retorna o valor agregado de endividamento (soma devidos/abertos conforme sua regra de negócio no use case).

### Exemplo de requisição

```bash
curl -s "http://localhost:3000/contratos/endividamento-total"
```

### Exemplo de resposta `200 OK`

```json
{ "endividamento_total": 2545.14 }
```

---

## Tipos de dados e formato de resposta

A API utiliza um *presenter* para padronizar a saída.

### `ContratoHttp` (itens da listagem)

| Campo             | Tipo                    | Origem/observação                                    |
| ----------------- | ----------------------- | ---------------------------------------------------- |
| `contrato`        | `string`                | Identificador do contrato.                           |
| `data`            | `string` (YYYY-MM-DD)   | Derivado de `Date` com `.toISOString().slice(0,10)`. |
| `valortotal`      | `number`                | Valor total do contrato.                             |
| `valorentrada`    | `number`                | Valor de entrada.                                    |
| `valorfinanciado` | `number`                | Valor financiado.                                    |
| `createdAt`       | `string` (ISO datetime) | `.toISOString()` do domínio.                         |
| `updatedAt`       | `string` (ISO datetime) | `.toISOString()` do domínio.                         |
| `qtdParcelas`     | `number` (opcional)     | Quantidade de parcelas.                              |
| `totalPago`       | `number` (opcional)     | Total já pago.                                       |

### `EndividamentoTotalResponseDto`

```ts
{ endividamento_total: number }
```

> Nota de consistência: todos os **datetimes** são emitidos em ISO 8601 (`.toISOString()`); a **data** do contrato é sempre normalizada para `YYYY-MM-DD`.

---

## Paginação e ordenação

* `page` e `limit` controlam a janela da consulta.
* `total` indica a quantidade total de registros que atendem ao filtro.
* Ordenação controlada por `sort` + `order`, conforme enum suportado.

### Boas práticas

* Use `limit` adequado (ex.: 20–100) para evitar respostas muito grandes.
* Combine filtros por data e `contratoLike` para buscas eficientes.

---

## Erros comuns

### 400 — Validação

Acontece quando algum parâmetro viola os validators do DTO.

Exemplos de causas:

* `dataFrom=2025/01/01` (formato inválido; use `YYYY-MM-DD`)
* `hasEntrada=yes` (não passa em `IsBooleanString`; use `true`/`false`)
* `page=0` (falha em `@Min(1)`)

Exemplo de payload de erro (padrão NestJS ValidationPipe):

```json
{
  "statusCode": 400,
  "message": [
    "hasEntrada must be a boolean string",
    "page must not be less than 1"
  ],
  "error": "Bad Request"
}
```

### 500 — Erro interno

Falhas inesperadas no processamento da consulta.

---

## Parcelas

Base URL: `/parcelas`

---

## Listar parcelas — `GET /parcelas`

Retorna uma lista paginada de parcelas de um contrato.
⚠️ **Obrigatório** informar o parâmetro `contratoId`.

### Query params

| Parâmetro        | Tipo            | Validador            | Descrição                                                                                                     |
| ---------------- | --------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `contratoId`     | `string`        | `@IsString()`        | **Obrigatório**. Identificador do contrato ao qual as parcelas pertencem.                                     |
| `vencFrom`       | `string` (date) | `@IsDateString()`    | Data mínima de vencimento (inclusive). Formato `YYYY-MM-DD`.                                                  |
| `vencTo`         | `string` (date) | `@IsDateString()`    | Data máxima de vencimento (inclusive). Formato `YYYY-MM-DD`.                                                  |
| `hasPayment`     | `string` bool   | `@IsBooleanString()` | Filtrar parcelas **pagas** ou **não pagas**. Aceita `"true"` ou `"false"`.                                    |
| `hasOpenCapital` | `string` bool   | `@IsBooleanString()` | Filtrar por parcelas que ainda possuem capital em aberto. `"true"` ou `"false"`.                              |
| `page`           | `number` int ≥1 | `@IsInt() @Min(1)`   | Página da paginação.                                                                                          |
| `limit`          | `number` int ≥1 | `@IsInt() @Min(1)`   | Limite de itens por página.                                                                                   |
| `sort`           | `string` enum   | `@IsString()`        | Campo para ordenação: `datavencimento` \| `valorvencimento` \| `totalpago` \| `capitalaberto` \| `createdAt`. |
| `order`          | `string` enum   | `@IsString()`        | Direção de ordenação: `ASC` \| `DESC`.                                                                        |

---

### Exemplo de requisição

```bash
curl -s "http://localhost:3000/parcelas?contratoId=CTR-2025-0001&vencFrom=2025-01-01&vencTo=2025-12-31&hasPayment=true&page=1&limit=10&sort=datavencimento&order=ASC"
```

---

### Exemplo de resposta `200 OK`

```json
{
  "items": [
    {
      "contratoId": "CTR-2025-0001",
      "datavencimento": "2025-04-15",
      "valorvencimento": 1250.50,
      "dataultimopagamento": "2025-04-20",
      "totalpago": 1250.50,
      "capitalaberto": 0,
      "createdAt": "2025-04-01T10:00:00.000Z",
      "updatedAt": "2025-04-20T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

## Tipos de dados e formato de resposta

### `ParcelaHttp`

| Campo                 | Tipo                  | Observação                                        |
| --------------------- | --------------------- | ------------------------------------------------- |
| `contratoId`          | `string`              | Identificador do contrato.                        |
| `datavencimento`      | `string` (YYYY-MM-DD) | Data de vencimento da parcela.                    |
| `valorvencimento`     | `number`              | Valor da parcela.                                 |
| `dataultimopagamento` | `string \| null`      | Data do último pagamento (ou `null` se não pago). |
| `totalpago`           | `number`              | Total pago na parcela até o momento.              |
| `capitalaberto`       | `number`              | Capital ainda em aberto.                          |
| `createdAt`           | `string` (datetime)   | Data de criação (ISO).                            |
| `updatedAt`           | `string` (datetime)   | Data da última atualização (ISO).                 |

---

## Paginação e ordenação

* `page` e `limit` controlam a paginação.
* `total` indica o total de registros que atendem aos filtros.
* Ordenação feita com `sort` + `order`.

---

## Erros comuns

### 400 — Validação

* Omissão de `contratoId` (campo obrigatório).
* `vencFrom` ou `vencTo` em formato inválido.
* Valores não aceitos em `hasPayment` ou `hasOpenCapital`.

Exemplo:

```json
{
  "statusCode": 400,
  "message": [
    "contratoId must be a string",
    "hasPayment must be a boolean string"
  ],
  "error": "Bad Request"
}
```

---

## Máximo em Aberto

Base URL: `/maximo-aberto`

---

## Upload e cálculo — `POST /maximo-aberto`

Recebe um arquivo com dados (JSON puro ou **JSON compactado em Gzip**), processa o conteúdo e retorna o **mês** e o **total em aberto** calculado a partir do dataset.

* **Campo obrigatório (multipart/form-data):** `file`
* **Tipos aceitos:**

  * `application/json` (extensões comuns: `.json`)
  * `application/gzip` ou `application/x-gzip` (extensão `.gz`) contendo um JSON válido

> Observação (implementação): o arquivo é salvo temporariamente em `/tmp` e removido após o processamento; se o nome original terminar em `.gz`, o conteúdo é descompactado em *stream* durante a leitura.

---

## Formato do arquivo aceito

* Um **JSON** compatível com a sua infraestrutura de histórico (o *use case* lê via *stream* e realiza o cálculo internamente).
* Não há um schema público exposto neste controller; use o mesmo formato de histórico que já é utilizado na sua base de testes/seed.

---

## Exemplos de requisição

### cURL — JSON puro

```bash
curl -X POST "http://localhost:3000/maximo-aberto" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/caminho/para/historico.json;type=application/json"
```

### cURL — JSON em `.gz`

```bash
curl -X POST "http://localhost:3000/maximo-aberto" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/caminho/para/historico.json.gz;type=application/gzip"
```

### HTTPie

```bash
http -f POST :3000/maximo-aberto file@/caminho/para/historico.json
# ou
http -f POST :3000/maximo-aberto file@/caminho/para/historico.json.gz
```

> Certifique-se de usar `multipart/form-data` e o **nome do campo** exatamente como `file`.

---

## Resposta

### `200 OK`

```json
{
  "mes": "04/2023",
  "total_aberto": 2545.14
}
```

**Tipo:** `MaximoAbertoResponseDto`

| Campo          | Tipo     | Descrição                                 |
| -------------- | -------- | ----------------------------------------- |
| `mes`          | `string` | Mês de referência no formato `MM/YYYY`.   |
| `total_aberto` | `number` | Total em aberto calculado para o período. |

---

## Erros comuns

### `400 Bad Request`

* **Arquivo não enviado:** quando o campo `file` não está presente.
  **Mensagem:** `Arquivo não enviado (campo "file")`

### `415/422` (dependente da infraestrutura)

* Arquivo não-parsável como JSON válido (após descompactação, quando aplicável).
* Conteúdo incompatível com o formato esperado pelo *use case*.

> O controller faz a validação mínima (presença do `file`) e delega parsing e regras ao *use case*. Falhas de parsing podem emergir como `4xx`/`5xx` dependendo do *error handling* global.

### `500 Internal Server Error`

* Qualquer falha inesperada durante o processamento do *stream*.

---

## Notas de implementação

* **Controller:** `MaximoAbertoController` (`/maximo-aberto`)

  * `POST /` com `FileInterceptor('file')` (campo **file**) usando `multer` com `diskStorage` em `/tmp`.
  * Se o nome original termina em `.gz`, o *stream* é passado por `createGunzip()`; caso contrário, é lido direto.
  * Chama `MaximoAbertoFromStreamUseCase.execute(stream)` e retorna `MaximoAbertoPresenter.maximoAberto(...)`.
  * Remove o arquivo temporário após o processamento.

# Máximo em Aberto — Visão Geral

**Objetivo:** dado um arquivo de histórico de contratos/parcelas (JSON ou JSON.gz), calcular **em qual mês** houve o **maior valor em aberto acumulado** e **quanto** foi esse valor.

* **Endpoint:** `POST /maximo-aberto` (multipart/form-data com campo `file`)
* **Entrada:** JSON (opcionalmente compactado em Gzip)
* **Saída:** `{ "mes": "MM/YYYY", "total_aberto": number }`

---

## O que o sistema faz (passo a passo)

1. **Upload & Descompactação**

   * O controller salva o arquivo em `/tmp` e detecta pela extensão:

     * `*.json` → lê direto via stream.
     * `*.gz` → descompacta no fluxo com `createGunzip()` e lê via stream.
   * Se o campo `file` não for enviado, responde `400 Bad Request`.

2. **Leitura em Stream (sem carregar tudo na memória)**

   * O `StreamJsonParcelaGateway` usa **stream-json** para percorrer o arquivo:

     * Navega até `contratos` → `[].parcelas`.
     * Para cada parcela válida, emite um item com:

       * `datavencimento: string (ISO)`
       * `valorvencimento: number`
       * `totalpago: number` (0 se ausente)
   * Se alguma parcela estiver inválida, o fluxo é interrompido com
     `BadRequestException('Parcela inválida no JSON')`.

3. **Agregação Mensal**

   * O `MaximoAbertoFromStreamUseCase` lê cada parcela do stream e acumula, **por mês** (`YYYY-MM`):

     * `amount`  += `valorvencimento`
     * `paid`    += `totalpago`

4. **Cálculo do pico de aberto**

   * Ordena os meses (`YYYY-MM`) e caminha em ordem crescente:

     * `cumulativeAmount` (somando todos os `amount` até o mês atual)
     * `cumulativePaid`   (somando todos os `paid` até o mês atual)
     * `open = round2(cumulativeAmount - cumulativePaid)`
   * O **pico** é o mês em que `open` atingiu o **maior valor**.
   * Resultado final:

     * `mes` em formato brasileiro `MM/YYYY`
     * `total_aberto` arredondado com 2 casas decimais (nunca negativo)

5. **Limpeza**

   * O arquivo temporário é **sempre** removido ao final (com `unlink`).

---

## Por que “acumulado”?

Porque a dívida/aberto real se **acumula** ao longo do tempo:

* Some todos os valores de vencimento até cada mês (`amount` cumulativo).
* Subtraia tudo que foi pago até cada mês (`paid` cumulativo).
* O maior valor dessa diferença ao longo da linha do tempo é o **pico**.

### Exemplo rápido

| Mês     | amount (mês) | paid (mês) | cumul. amount | cumul. paid | open (=amount-paid) |
| ------- | ------------ | ---------- | ------------- | ----------- | ------------------- |
| 2023-04 | 1000         | 200        | 1000          | 200         | **800**             |
| 2023-05 | 500          | 100        | 1500          | 300         | **1200** ← **pico** |
| 2023-06 | 200          | 300        | 1700          | 600         | **1100**            |

Retorno: `{ "mes": "05/2023", "total_aberto": 1200 }`.

---

## Estrutura de arquivo esperada

O parser espera algo como:

```json
{
  "contratos": [
    {
      "id": "CTR-001",
      "parcelas": [
        {
          "datavencimento": "2023-04-10",
          "valorvencimento": 1000.0,
          "totalpago": 200.0
        },
        {
          "datavencimento": "2023-05-10",
          "valorvencimento": 500.0,
          "totalpago": 100.0
        }
      ]
    },
    {
      "id": "CTR-002",
      "parcelas": [
        {
          "datavencimento": "2023-06-05",
          "valorvencimento": 200.0,
          "totalpago": 300.0
        }
      ]
    }
  ]
}
```

> Somente os campos necessários para o cálculo são lidos do stream:
> `datavencimento`, `valorvencimento`, `totalpago` (opcional → 0).

---

## Detalhes técnicos (resumo por componente)

* **Controller (`MaximoAbertoController`)**

  * Rota `POST /maximo-aberto` com `FileInterceptor('file')`.
  * Salva em `/tmp`, usa Gzip quando necessário, chama o use case via stream.
  * Retorna `200` com `{ mes, total_aberto }`.

* **Use Case (`MaximoAbertoFromStreamUseCase`)**

  * `aggregateByMonth(stream)` → `Map<YYYY-MM, { amount, paid }>`
  * `findPeakOpen(map)` → varre meses em ordem, calcula aberto acumulado e encontra o pico.
  * Converte `YYYY-MM` → `MM/YYYY` e arredonda (`round2`).

* **Gateway (`StreamJsonParcelaGateway`)**

  * Usa `stream-json` + `Pick('contratos')` + `StreamArray` para iterar **sem carregar tudo**.
  * Valida estrutura mínima da parcela; em caso de erro, encerra o pipeline com `BadRequestException`.

* **Presenter (`MaximoAbertoPresenter`)**

  * Passa adiante `{ mes, total_aberto }` já pronto (contrato de resposta).

---

## Precisão, data e arredondamento

* As datas são convertidas com `new Date(iso)` e o **mês chave** é `YYYY-MM` usando **UTC**:

  * `year = d.getUTCFullYear()`
  * `month = d.getUTCMonth() + 1`
* O retorno formata para `MM/YYYY`.
* `round2(n)` garante duas casas decimais.
* Se não houver parcelas, retorna `{ mes: "01/1970", total_aberto: 0 }`.

---

## Complexidade e desempenho

* **Tempo:** O(n), onde **n = total de parcelas** (lido uma vez).
* **Memória:** O(m), onde **m = número de meses distintos** (mapa de agregação).
* **Stream-first:** apropriado para arquivos grandes; evita `OutOfMemory`.

---

## Erros e mensagens

* `400 Bad Request`:

  * `Arquivo não enviado (campo "file")`
  * `Parcela inválida no JSON` (quando `datavencimento` não é string, `valorvencimento` ausente ou inválido etc.)
* `500 Internal Server Error`:

  * Falhas inesperadas de IO/parse/infra (conforme `ExceptionFilter` global).

---

## Exemplos de chamada

### JSON puro

```bash
curl -X POST "http://localhost:3000/maximo-aberto" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/caminho/historico.json;type=application/json"
```

### JSON.gz

```bash
curl -X POST "http://localhost:3000/maximo-aberto" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/caminho/historico.json.gz;type=application/gzip"
```

---

## Boas práticas para quem integra

* **Inclua `totalpago` sempre que possível** para melhorar a acurácia do aberto.
* **Garanta `datavencimento` em ISO (ex.: `YYYY-MM-DD`)**; outros formatos podem falhar.
* **Evite números como string com vírgula** (ex.: `"1.234,56"`). Use ponto como separador decimal.
* **Compacte em `.gz`** para reduzir latência de upload em arquivos grandes.

---

## Contrato de resposta

```ts
type MaximoAbertoResponseDto = {
  mes: string;          // "MM/YYYY"
  total_aberto: number; // 2 casas decimais
};
```

---