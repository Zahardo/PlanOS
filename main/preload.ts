import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  dbInit: () => ipcRenderer.invoke('db:init'),
  osBaseList: () => ipcRenderer.invoke('osBase:list'),
  osBaseUpdate: (payload: unknown) => ipcRenderer.invoke('osBase:update', payload),
  osBaseImportExcel: () => ipcRenderer.invoke('osBase:importExcel'),
  osBaseExportExcel: () => ipcRenderer.invoke('osBase:exportExcel'),
  planejamentoListByEquipe: (equipeId: number) =>
    ipcRenderer.invoke('planejamento:listByEquipe', equipeId),
  planejamentoAddItem: (payload: unknown) =>
    ipcRenderer.invoke('planejamento:addItem', payload),
  planejamentoUpdateItem: (payload: unknown) =>
    ipcRenderer.invoke('planejamento:updateItem', payload),
  planejamentoReorder: (payload: unknown) =>
    ipcRenderer.invoke('planejamento:reorder', payload),
  planejamentoRemoveItem: (payload: unknown) =>
    ipcRenderer.invoke('planejamento:removeItem', payload),
  planejamentoExportExcel: () =>
    ipcRenderer.invoke('planejamento:exportExcel'),
  equipesList: () => ipcRenderer.invoke('equipes:list'),
  equipesCreate: (nome: string) => ipcRenderer.invoke('equipes:create', nome),
  equipesUpdate: (payload: unknown) => ipcRenderer.invoke('equipes:update', payload),
  equipesDelete: (id: number) => ipcRenderer.invoke('equipes:delete', id),
  configSetLogo: (logoPath: string | null) =>
    ipcRenderer.invoke('config:setLogo', logoPath),
  configGet: (key: string) => ipcRenderer.invoke('config:get', key),
  dbReset: () => ipcRenderer.invoke('db:reset'),
  cronogramaExportExcel: () =>
    ipcRenderer.invoke('cronograma:exportExcel')
});
