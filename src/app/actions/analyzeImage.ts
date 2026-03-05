"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface VintedResult {
    titre: string;
    prix: string;
    description: string;
    hashtags: string[];
}

export async function analyzeImage(
    base64Image: string,
    mimeType: string
): Promise<{ success: true; data: VintedResult } | { success: false; error: string }> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("La clé d'API GEMINI_API_KEY n'est pas configurée.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Tu es un expert en revente de vêtements de seconde main sur Vinted. Analyse cette image de vêtement et retourne UNIQUEMENT un objet JSON valide avec la structure suivante, sans aucun formatage Markdown autour (pas de \`\`\`json) :
{
  "titre": "Un titre optimisé et accrocheur (max 40 caractères)",
  "prix": "Une estimation de prix réaliste de revente en euros (ex: 15€ - 20€)",
  "description": "Une description vendeuse, très structurée (sauts de ligne), incluant l'état supposé, la coupe, et les mesures potentielles à vérifier",
  "hashtags": ["#tag1", "#tag2", "#tag3"]
}
Ne retourne absolument que le JSON parsable.`;

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();

        // Clean up potential markdown formatting if the model disobeys instructions
        let cleanedText = responseText.trim();
        if (cleanedText.startsWith("```json")) {
            cleanedText = cleanedText.replace(/^```json\n/, "").replace(/\n```$/, "");
        } else if (cleanedText.startsWith("```")) {
            cleanedText = cleanedText.replace(/^```\n/, "").replace(/\n```$/, "");
        }

        const parsedData: VintedResult = JSON.parse(cleanedText);

        // Basic validation
        if (!(parsedData as any).title && !parsedData.titre) throw new Error("Format JSON invalide: titre manquant.");
        if (!parsedData.prix) throw new Error("Format JSON invalide: prix manquant.");

        // Handle potential english keys edge cases from LLMs
        return {
            success: true,
            data: {
                titre: parsedData.titre || (parsedData as any).title,
                prix: parsedData.prix,
                description: parsedData.description,
                hashtags: parsedData.hashtags || [],
            },
        };
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return {
            success: false,
            error: error.message || "Impossible d'analyser l'image avec l'IA.",
        };
    }
}
