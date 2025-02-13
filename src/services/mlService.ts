export interface ModelResult {
  prediction: string;
  confidence?: number;
  details?: string;
}

// Função para enviar a imagem para a API Flask e obter a previsão
export const runModel = async (modelId: string, imageUrl: string): Promise<ModelResult> => {
  let porta_modelo: string;

  // Determina o endpoint com base no modelo escolhido
  if (modelId === 'deteccao_fratura_x_ray') {
    porta_modelo = '/predict';
  } else if (modelId === 'deteccao_fratura_O_C_M') {
    porta_modelo = '/predict_fratura_2';
  } else if (modelId === 'deteccao_tumor_cerebral') {
    porta_modelo = '/classificar_tumor';
  }
    else if (modelId === 'deteccao_segmentacao_recontrucao_tumor_cerebral') {
    porta_modelo = '/reconstruir_imagem';
  } else {
    throw new Error('Unsupported model ID');
  }

  const formData = new FormData();

  // Converte a URL da imagem em um blob
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  formData.append('image', blob, 'xray.jpg');

  try {
    // Envia a imagem para a API Flask
    const apiResponse = await fetch(`http://127.0.0.1:5000${porta_modelo}`, {
      method: 'POST',
      body: formData,
    });

    if (!apiResponse.ok) {
      throw new Error(`API error: ${apiResponse.statusText}`);
    }

    const result = await apiResponse.json();

    // Retorna o resultado no formato ModelResult
    return {
      prediction: result.prediction,
      confidence: result.confidence || undefined, // Adapte se sua API retornar confiança
    };
  } catch (error) {
    console.error('Error running the model:', error);
    throw error;
  }
};

import { jsPDF } from 'jspdf';

// Função para gerar um PDF com os resultados
export const generatePdfReport = async (result: ModelResult, imageUrl: string): Promise<Blob> => {
  // Criar uma instância do jsPDF
  const doc = new jsPDF();

  // Configurar o título principal centralizado
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('MedFinder', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  // Subtítulo centralizado
  doc.setFontSize(18);
  doc.text('Laudo da Análise de Imagem', doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });

  // Linha de separação abaixo do subtítulo
  doc.setLineWidth(0.5);
  doc.line(20, 40, doc.internal.pageSize.getWidth() - 20, 40);

  // Informações do laudo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 60);
  doc.text(`Resultado: ${result.prediction}`, 20, 70);
  // doc.text(`Confiança: ${result.confidence ? `${result.confidence.toFixed(2)}%` : "N/A"}`, 20, 70);

  // Seção da imagem
  if (imageUrl) {
    const imgResponse = await fetch(imageUrl);
    const imgBlob = await imgResponse.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;

        // Adicionar imagem ao PDF (centralizada horizontalmente)
        const imgX = (doc.internal.pageSize.getWidth() - 100) / 2; // Centraliza horizontalmente
        doc.addImage(base64data, 'JPEG', imgX, 80, 100, 100); // Ajuste as dimensões conforme necessário

        // Adicionar nota abaixo da imagem
        doc.setFontSize(10);
        doc.text('Imagem analisada', doc.internal.pageSize.getWidth() / 2, 190, { align: 'center' });

        // Finalizar o PDF
        const pdfBlob = doc.output('blob');
        resolve(pdfBlob);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imgBlob);
    });
  }

  // Retornar o PDF caso nenhuma imagem tenha sido adicionada
  return doc.output('blob');
};

// // Função para gerar um PDF com os resultados
// export const generatePdfReport = async (result: ModelResult, imageUrl: string): Promise<Blob> => {
//   // Criação do conteúdo do PDF
//   const pdfContent = `
//     X-Ray Analysis Report
//     Date: ${new Date().toLocaleDateString()}
//     Result: ${result.prediction}
//     Confidence: ${result.confidence || "N/A"}
//     Image URL: ${imageUrl}
//   `;

//   // Retorna o conteúdo como um arquivo Blob no formato PDF
//   return new Blob([pdfContent], { type: 'application/pdf' });
// };














// teste 1
// export interface ModelResult {
//   prediction: string;
//   confidence?: number;
//   details?: string;
// }

// export const runModel = async (modelId: string, imageUrl: string): Promise<ModelResult> => {
//   if (modelId !== 'deteccao_fratura_x_ray') {
//     throw new Error('Unsupported model ID');
//   }

//   const formData = new FormData();
//   const response = await fetch(imageUrl);
//   const blob = await response.blob();
//   formData.append('image', blob, 'xray.jpg');

//   try {
//     const apiResponse = await fetch('http://127.0.0.1:5000/predict', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!apiResponse.ok) {
//       throw new Error(`API error: ${apiResponse.statusText}`);
//     }

//     const result = await apiResponse.json();

//     return {
//       prediction: result.prediction,
//     };
//   } catch (error) {
//     console.error('Error running the model:', error);
//     throw error;
//   }
// };













// modelo inicial


// export interface ModelResult {
//   prediction: string;
//   confidence?: number;
//   details?: string;
// }

// export const runModel = async (modelId: string, imageUrl: string): Promise<ModelResult> => {
//   // This is a mock implementation - replace with actual API call
//   console.log(`Running model ${modelId} with image ${imageUrl}`);
  
//   // Simulate API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       if (modelId === 'deteccao_fratura_x_ray') {
//         resolve({
//           prediction: "No exame selecionado foi detectada uma fratura",
//           confidence: 0.92
//         });
//       } else {
//         resolve({
//           prediction: "O exame selecionado foi analisado e não foi encontrada nenhuma anormalidade",
//           confidence: 0.88
//         });
//       }
//     }, 1500);
//   });
// };

// export const generatePdfReport = async (result: ModelResult, imageUrl: string): Promise<Blob> => {
//   // This is a mock implementation - replace with actual PDF generation
//   console.log('Generating PDF report for:', result);
  
//   // Simulate PDF generation
//   const mockPdfContent = `
//     X-Ray Analysis Report
//     Date: ${new Date().toLocaleDateString()}
//     Result: ${result.prediction}
//     Confidence: ${result.confidence}
//   `;
  
//   return new Blob([mockPdfContent], { type: 'application/pdf' });
// };