import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseQuoteDescription(description: string) {
  const prompt = `Tu es un assistant expert pour les plombiers. À partir de la description suivante d'une intervention, génère une liste détaillée de lignes de devis au format JSON.

Description: "${description}"

Pour chaque ligne, fournis:
- description: description détaillée de la prestation ou pièce
- quantity: quantité (nombre)
- unit: unité (ex: "unité", "m", "m²", "heure", etc.)
- unitPrice: prix unitaire HT en euros (estime des prix réalistes pour un plombier en France)

Fournis au moins 2-4 lignes avec:
1. Les pièces/fournitures nécessaires
2. La main d'œuvre

Réponds UNIQUEMENT avec un objet JSON valide au format:
{
  "items": [
    {
      "description": "...",
      "quantity": 1,
      "unit": "unité",
      "unitPrice": 150.00
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en plomberie qui génère des devis détaillés et précis. Tu réponds uniquement en JSON valide.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    return parsed.items;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to generate quote items');
  }
}
