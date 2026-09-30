import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. AI Chatbot Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userContext } = req.body;

    if (!apiKey) {
      return res.status(200).json({
        reply:
          "PocketSmart AI Assistant: Based on your current financials, your monthly income is " +
          (userContext?.currency || '₹') +
          (userContext?.income?.toLocaleString('en-IN') || '75,000') +
          ", with total spending of " +
          (userContext?.currency || '₹') +
          (userContext?.totalExpenses?.toLocaleString('en-IN') || '42,000') +
          ". Your food expenses and entertainment are running near budget limits. What would you like to optimize next?",
      });
    }

    const systemInstruction = `You are PocketSmart AI, an empathetic, smart personal budget and recommendation assistant.
The user is viewing their personal finance dashboard.
CURRENT USER FINANCIAL CONTEXT:
${JSON.stringify(userContext || {}, null, 2)}

FINANCIAL SAFETY & COMPLIANCE GUIDELINES:
1. Provide budgeting and educational assistance rather than presenting yourself as a licensed financial advisor.
2. NEVER guarantee investment returns, promote high-risk investments, or recommend taking loans.
3. Clearly distinguish mathematical calculations (e.g., disposable balance = Income - Fixed - Variable) from general suggestions.
4. Keep advice practical, actionable, and grounded in the user's actual categories and numbers.
5. Use the user's currency (${userContext?.currency || '₹'}).
6. Keep replies structured, friendly, concise, and easy to read with bullet points or bold keys.`;

    const conversationHistory = (messages || []).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: conversationHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ reply: response.text || "I'm here to help you optimize your budget." });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({
      error: 'Failed to generate AI response',
      details: err?.message || String(err),
    });
  }
});

// 2. AI Spending Pattern Analysis
app.post('/api/ai/analyze-spending', async (req: Request, res: Response) => {
  try {
    const { financialData } = req.body;

    if (!apiKey) {
      return res.json({
        summary:
          "Spending is moderately balanced with a 24.3% savings surplus, but Food and Transportation are driving 62% of your discretionary outflow.",
        spendingSpikes: [
          {
            category: "Food",
            observation: "Gourmet dining & food deliveries reached ₹4,850 this month, which is 22% higher than your usual baseline.",
            percentageChange: "+22%",
            estimatedExcess: 1500,
          },
          {
            category: "Transportation",
            observation: "Cab rides and fuel increased by 18% due to late-night transit rides.",
            percentageChange: "+18%",
            estimatedExcess: 850,
          },
        ],
        frequentlyUsedCategories: ["Food (41% of variable)", "Transportation (21%)", "Shopping (17%)"],
        reductionOpportunities: [
          "Set a ₹2,000 weekend food delivery ceiling to capture ₹1,500 monthly savings.",
          "Use metro transit pass for weekday commutes rather than on-demand cabs.",
          "Audit digital subscriptions for dormant services.",
        ],
        behavioralTrend: "Discretionary spending surges primarily on Friday through Sunday evenings.",
      });
    }

    const prompt = `Analyze this user's monthly spending data:
${JSON.stringify(financialData, null, 2)}

Provide an intelligent spending pattern analysis identifying:
1. Unnecessary or unusually high spending spikes (with percentage comparison).
2. Frequently used categories.
3. Behavioral shifts in spending.
4. Specific areas where the user can reduce expenses realistically.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Executive 1-2 sentence summary of spending behavior',
            },
            spendingSpikes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  observation: { type: Type.STRING },
                  percentageChange: { type: Type.STRING },
                  estimatedExcess: { type: Type.NUMBER },
                },
                required: ['category', 'observation'],
              },
            },
            frequentlyUsedCategories: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            reductionOpportunities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            behavioralTrend: {
              type: Type.STRING,
              description: 'Observation about time, velocity, or recurring habits',
            },
          },
          required: [
            'summary',
            'spendingSpikes',
            'frequentlyUsedCategories',
            'reductionOpportunities',
            'behavioralTrend',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Analyze spending error:', err);
    return res.status(500).json({ error: 'Failed to analyze spending', details: err?.message });
  }
});

// 3. AI Recommendations Pipeline
app.post('/api/ai/recommendations', async (req: Request, res: Response) => {
  try {
    const { pipelineData } = req.body;

    if (!apiKey) {
      return res.json({
        recommendations: [
          {
            title: "Reduce entertainment spending by ₹500 this month",
            category: "Entertainment",
            reason: "Entertainment spending is currently 18% above your three-month average.",
            estimatedImpact: "Saves ₹500/month; increases savings rate by 1.2%.",
            suggestedAction: "Set a temporary entertainment limit of ₹2,000.",
            urgency: "medium",
          },
          {
            title: "Cap weekend dining and food deliveries",
            category: "Food",
            reason: "Food spending reached 82% of allocated budget with 9 days remaining.",
            estimatedImpact: "Prevents a ₹2,400 month-end budget overrun.",
            suggestedAction: "Prep meals at home this coming weekend and set a ₹1,200 food delivery cap.",
            urgency: "high",
          },
          {
            title: "Accelerate 6-Month Emergency Fund contribution",
            category: "Savings",
            reason: "Your disposable surplus of ₹18,400 allows an extra allocation without compromising lifestyle.",
            estimatedImpact: "Reaches emergency buffer goal 45 days earlier.",
            suggestedAction: "Auto-transfer ₹5,000 to liquid savings upon next paycheck.",
            urgency: "low",
          },
          {
            title: "Consolidate transit with public metro passes",
            category: "Transportation",
            reason: "On-demand cab charges peaked on weekday evening commute hours.",
            estimatedImpact: "Saves up to ₹1,100 per billing cycle.",
            suggestedAction: "Switch to metro smart card for return office trips.",
            urgency: "medium",
          },
        ],
      });
    }

    const prompt = `You are the PocketSmart AI Recommendation Engine.
Run the recommendation pipeline:
Income -> Fixed Expenses -> Variable Expenses -> Spending Patterns -> Savings Goals -> Budget Utilization -> AI Analysis -> Personalized Recommendations.

INPUT DATA:
${JSON.stringify(pipelineData, null, 2)}

Provide 3 to 5 clear, high-utility recommendations.
Every recommendation MUST include:
- title: concise action title
- category: e.g. Food, Transportation, Shopping, Bills, Entertainment, Savings
- reason: exact cause explaining why (e.g., 'Entertainment spending is currently 18% above your three-month average')
- estimatedImpact: measurable financial impact
- suggestedAction: actionable concrete step (e.g., 'Set a temporary entertainment limit of ₹2,000')
- urgency: 'high' | 'medium' | 'low'

Adhere strictly to budgeting safety: do not recommend stocks, crypto, loans, or speculative instruments.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  estimatedImpact: { type: Type.STRING },
                  suggestedAction: { type: Type.STRING },
                  urgency: {
                    type: Type.STRING,
                    description: "'high' | 'medium' | 'low'",
                  },
                },
                required: [
                  'title',
                  'category',
                  'reason',
                  'estimatedImpact',
                  'suggestedAction',
                  'urgency',
                ],
              },
            },
          },
          required: ['recommendations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{"recommendations": []}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Recommendations error:', err);
    return res.status(500).json({ error: 'Failed to generate recommendations', details: err?.message });
  }
});

// Setup Vite middlewares in development or static in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PocketSmart AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
