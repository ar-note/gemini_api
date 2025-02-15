// api/index.js
import { GoogleGenerativeAI } from 'generative-ai';

export default async function handler(req, res) {
  // CORS ヘッダーを設定
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // プリフライト（OPTIONS）リクエストの処理
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { prompt, api_key } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }
      if (!api_key) {
        return res.status(400).json({ error: 'API Key is required.' });
      }
      
      // クライアントから送られてきた API キーを利用
      const genAI = new GoogleGenerativeAI(api_key);
      
      // 利用するモデル名は、利用可能な正しいものに更新してください
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const responseObj = await result.response;
      const text = responseObj.text();
      
      res.status(200).json({ result: text });
    } catch (error) {
      console.error('Gemini API 呼び出しエラー:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).end("Method Not Allowed");
  }
}
