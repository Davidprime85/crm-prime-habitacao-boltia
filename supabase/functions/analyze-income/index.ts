import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalyzeIncomeRequest {
  documentUrl: string;
  documentId: string;
}

interface AnalyzedData {
  name?: string;
  cpf?: string;
  net_income?: number;
  gross_income?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { documentUrl, documentId }: AnalyzeIncomeRequest = await req.json();

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const prompt = `
Analise esta imagem de documento (holerite ou IRPF) e extraia as seguintes informações:

1. Nome completo
2. CPF (apenas números)
3. Renda líquida (valor numérico, sem símbolos)
4. Renda bruta (valor numérico, sem símbolos)

Retorne APENAS um JSON válido neste formato exato:
{
  "name": "Nome Completo",
  "cpf": "12345678900",
  "net_income": 5000.00,
  "gross_income": 7000.00
}

Se não encontrar algum valor, use null.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: documentUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI");
    }

    const analyzedData: AnalyzedData = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify({
        success: true,
        data: analyzedData,
        documentId,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error analyzing income:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro ao analisar documento",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
