import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

type GeneratedTextOptions = {
   model?: string;
   prompt: string;
   temperature?: number;
   maxOutputTokens?: number;
};

export const llmClient = {
   async generateText({
      model = 'gemini-1.5-flash',
      prompt,
      temperature = 0.2,
      maxOutputTokens = 300,
   }: GeneratedTextOptions) {
      const generativeModel = client.getGenerativeModel({ model });
      const result = await generativeModel.generateContent({
         contents: [{ role: 'user', parts: [{ text: prompt }] }],
         generationConfig: {
            temperature,
            maxOutputTokens,
         },
      });

      return result.response.text();
   },
};
