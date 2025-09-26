import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

function sleep(ms: number) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

type GeneratedTextOptions = {
   model?: string;
   prompt: string;
   temperature?: number;
   maxOutputTokens?: number;
};

export const llmClient = {
   async generateText({
      model = 'gemini-2.5-flash-lite',
      prompt,
      temperature = 0.2,
      maxOutputTokens = 300,
   }: GeneratedTextOptions) {
      const generativeModel = client.getGenerativeModel({ model });
      let lastErr: any = null;

      for (let attempt = 0; attempt < 3; attempt++) {
         try {
            const result = await generativeModel.generateContent({
               contents: [{ role: 'user', parts: [{ text: prompt }] }],
               generationConfig: {
                  temperature,
                  maxOutputTokens,
               },
            });
            return result.response.text();
         } catch (err: any) {
            lastErr = err;

            // If it's a 429 error and we have retry info, wait and retry
            if (err.code === 429 && err.retryInfo && attempt < 2) {
               const retryDelaySeconds = err.retryInfo.retryDelaySeconds ?? 1;
               console.warn(
                  `Rate limit hit, retrying in ${retryDelaySeconds}s…`
               );
               await sleep(retryDelaySeconds * 1000);
               continue;
            }

            // Not a retryable error or out of attempts — rethrow
            throw err;
         }
      }

      // If all retries failed
      throw lastErr;
   },
};
