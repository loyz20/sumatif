const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

/**
 * Generate Tujuan Pembelajaran (TP) based on CP data
 */
async function generateTP(data) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured in .env');
    }

    const prompt = `
Anda adalah guru profesional Indonesia.
Tugas: Buatkan Tujuan Pembelajaran (TP) berdasarkan CP berikut.

Data:
Mapel: ${data.mapel}
Kelas/Fase: ${data.fase}
CP:
${data.cp}

Instruksi:
- Buat 5–10 TP
- Gunakan bahasa sederhana
- Spesifik dan bisa diukur
- Urutkan dari mudah ke sulit
- Gunakan kata kerja operasional

Output JSON:
{
  "tp": [
    {
      "kode": "TP 1",
      "deskripsi": "..."
    }
  ]
}
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text;
        console.log('Gemini-2.5 Raw Text:', text);
        
        // Cari bagian JSON di dalam teks (dari { sampai })
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('AI tidak memberikan format JSON yang valid');
        }
        
        const cleanJson = jsonMatch[0];
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error('Gemini-2.5 AI Error Detail:', error);
        throw new Error(`AI Error: ${error.message}`);
    }
}

module.exports = {
    generateTP
};
