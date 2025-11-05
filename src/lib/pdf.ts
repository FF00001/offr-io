import { jsPDF } from 'jspdf';
import { Quote } from '@/types/quote';

export function generateQuotePDF(quote: Quote): Buffer {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = '#2563eb';
  const darkGray = '#374151';
  const lightGray = '#6b7280';
  
  let yPos = 20;
  
  // Header - DEVIS
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  doc.text('DEVIS', 20, yPos);
  
  yPos += 10;
  
  // Quote info
  doc.setFontSize(10);
  doc.setTextColor(lightGray);
  doc.text(`N° ${quote.quoteNumber}`, 20, yPos);
  yPos += 5;
  doc.text(`Date: ${quote.date}`, 20, yPos);
  yPos += 5;
  doc.text(`Valable jusqu'au: ${quote.validUntil}`, 20, yPos);
  
  yPos += 15;
  
  // Artisan info
  doc.setFontSize(12);
  doc.setTextColor(darkGray);
  doc.text('ARTISAN', 20, yPos);
  yPos += 7;
  
  doc.setFontSize(10);
  doc.text(quote.artisan.company || quote.artisan.name, 20, yPos);
  yPos += 5;
  doc.text(quote.artisan.address, 20, yPos);
  yPos += 5;
  doc.text(`Tél: ${quote.artisan.phone}`, 20, yPos);
  yPos += 5;
  doc.text(`Email: ${quote.artisan.email}`, 20, yPos);
  
  if (quote.artisan.siret) {
    yPos += 5;
    doc.text(`SIRET: ${quote.artisan.siret}`, 20, yPos);
  }
  
  // Client info (right side)
  let clientYPos = yPos - (quote.artisan.siret ? 30 : 25);
  doc.setFontSize(12);
  doc.setTextColor(darkGray);
  doc.text('CLIENT', 120, clientYPos);
  clientYPos += 7;
  
  doc.setFontSize(10);
  doc.text(quote.client.name, 120, clientYPos);
  clientYPos += 5;
  doc.text(quote.client.address, 120, clientYPos);
  
  if (quote.client.phone) {
    clientYPos += 5;
    doc.text(`Tél: ${quote.client.phone}`, 120, clientYPos);
  }
  if (quote.client.email) {
    clientYPos += 5;
    doc.text(`Email: ${quote.client.email}`, 120, clientYPos);
  }
  
  yPos += 20;
  
  // Items table
  doc.setFontSize(11);
  doc.setFillColor(37, 99, 235); // primary blue
  doc.rect(20, yPos - 5, 170, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.text('Description', 22, yPos);
  doc.text('Qté', 130, yPos);
  doc.text('P.U. HT', 150, yPos);
  doc.text('Total HT', 175, yPos);
  
  yPos += 8;
  
  // Table rows
  doc.setFontSize(9);
  doc.setTextColor(darkGray);
  
  quote.items.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, yPos - 5, 170, 7, 'F');
    }
    
    // Truncate long descriptions
    const maxDescLength = 45;
    const desc = item.description.length > maxDescLength 
      ? item.description.substring(0, maxDescLength) + '...'
      : item.description;
    
    doc.text(desc, 22, yPos);
    doc.text(`${item.quantity} ${item.unit}`, 130, yPos);
    doc.text(`${item.unitPrice.toFixed(2)}€`, 150, yPos);
    doc.text(`${item.total.toFixed(2)}€`, 175, yPos);
    
    yPos += 7;
  });
  
  yPos += 5;
  
  // Totals
  doc.setFontSize(10);
  doc.text('Sous-total HT:', 140, yPos);
  doc.text(`${quote.subtotal.toFixed(2)}€`, 175, yPos);
  
  yPos += 6;
  doc.text(`TVA (${quote.tvaRate}%):`, 140, yPos);
  doc.text(`${quote.tva.toFixed(2)}€`, 175, yPos);
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  doc.text('TOTAL TTC:', 140, yPos);
  doc.setFontSize(14);
  doc.text(`${quote.total.toFixed(2)}€`, 175, yPos);
  
  // Notes
  if (quote.notes) {
    yPos += 15;
    doc.setFontSize(9);
    doc.setTextColor(lightGray);
    doc.text('Notes:', 20, yPos);
    yPos += 5;
    doc.setTextColor(darkGray);
    const splitNotes = doc.splitTextToSize(quote.notes, 170);
    doc.text(splitNotes, 20, yPos);
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(lightGray);
  doc.text(
    'Devis généré automatiquement - À retourner signé avec la mention "Bon pour accord"',
    105,
    280,
    { align: 'center' }
  );
  
  // Convert to Buffer
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}
