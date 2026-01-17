# Mock de Excel (Base de OS)

O arquivo `os_base_mock.xlsx` deve ser gerado localmente para evitar versionar binários no repositório.

## Colunas esperadas

| Coluna | Descrição |
| --- | --- |
| `os_numero` | Identificador único da OS (obrigatório). |
| `descricao` | Descrição principal da OS. |
| `descricao_posicao` | Posição/local da execução. |
| `previsao_inicio` | Data prevista de início (YYYY-MM-DD). |
| `previsao_termino` | Data prevista de término (YYYY-MM-DD). |
| `inicio_efetivo` | Data real de início (pode ser vazia). |
| `termino_efetivo` | Data real de término (pode ser vazia). |

## Script de geração

Para gerar o mock com o mesmo layout, rode:

```bash
npm run generate:mock
```
