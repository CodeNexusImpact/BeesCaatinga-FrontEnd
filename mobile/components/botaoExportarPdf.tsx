import React, { useState } from 'react';
import Botao from '@/components/formulario/botao';
import { exportarRelatorioPdf, FiltroRelatorio, TipoRelatorio } from '@/services/relatorioService';
import { alerta } from '@/utils/alerta';
import { mensagemDeErro } from '@/utils/erros';

interface Props {
  tipo: TipoRelatorio;
  filtro?: FiltroRelatorio;
  titulo?: string;
  style?: object;
}

/** Gera o PDF no backend (POST /relatorios/{tipo}/pdf) e baixa (web) ou compartilha (celular). */
export default function BotaoExportarPdf({ tipo, filtro = {}, titulo = 'Exportar PDF', style }: Props) {
  const [gerando, setGerando] = useState(false);
  const exportar = async () => {
    if (gerando) return;
    try {
      setGerando(true);
      const nome = await exportarRelatorioPdf(tipo, filtro);
      alerta('PDF gerado', `O arquivo ${nome} foi gerado.`);
    } catch (e) {
      alerta('Erro', mensagemDeErro(e, 'Não foi possível exportar o PDF.'));
    } finally {
      setGerando(false);
    }
  };
  return <Botao title={gerando ? 'Gerando PDF...' : titulo} iconName="fileDocument" onPress={exportar} cor="secundaria" style={style} />;
}
