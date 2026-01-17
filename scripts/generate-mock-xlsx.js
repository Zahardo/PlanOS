import * as XLSX from 'xlsx';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rows = [
  {
    os_numero: 'OS-1001',
    descricao: 'Montagem tanque A',
    descricao_posicao: 'Área 3',
    previsao_inicio: '2024-10-01',
    previsao_termino: '2024-10-03',
    inicio_efetivo: '',
    termino_efetivo: ''
  },
  {
    os_numero: 'OS-1002',
    descricao: 'Desmontagem torre',
    descricao_posicao: 'Área 7',
    previsao_inicio: '2024-10-02',
    previsao_termino: '2024-10-04',
    inicio_efetivo: '2024-10-02',
    termino_efetivo: ''
  },
  {
    os_numero: 'OS-1003',
    descricao: 'Montagem ponte',
    descricao_posicao: 'Área 1',
    previsao_inicio: '2024-09-28',
    previsao_termino: '2024-10-01',
    inicio_efetivo: '2024-09-28',
    termino_efetivo: '2024-09-30'
  }
];

const worksheet = XLSX.utils.json_to_sheet(rows);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'OS');

const output = path.resolve(__dirname, '../examples/os_base_mock.xlsx');
XLSX.writeFile(workbook, output);
console.log(`Mock Excel gerado em ${output}`);
