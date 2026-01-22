import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, governorate } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing item for governorate:', governorate);

    const systemPrompt = `You are an expert used items appraiser for the Iraqi market. You analyze images of items to determine their category, name, condition, and estimated market prices.

IMPORTANT: You MUST respond with valid JSON only. No markdown, no code blocks, just pure JSON.

When analyzing an image, you must determine:
1. Item type/category (e.g., Electronics, Furniture, Clothing, Appliances, Vehicles, etc.)
2. Specific item name (e.g., "iPhone 13 Pro Max 256GB", "Samsung Smart TV 55-inch")
3. Condition assessment (Excellent, Good, Fair, or Poor) based on visible wear
4. Condition score (0-100)
5. Market price estimates in Iraqi Dinars (IQD) based on typical Iraqi marketplace prices

Consider the governorate "${governorate}" for localized pricing - Baghdad typically has higher prices, while smaller governorates may have lower prices.

If the image is NOT a used item that can be sold (like food, random objects, people, etc.), respond with:
{"error": "not_sellable_item", "message": "هذا العنصر غير قابل للبيع في سوق المستعمل"}

For valid items, respond with this exact JSON structure:
{
  "itemType": "category name",
  "itemName": "specific item name",
  "condition": "Excellent|Good|Fair|Poor",
  "conditionScore": number between 0-100,
  "averagePrice": number in IQD,
  "lowestPrice": number in IQD,
  "highestPrice": number in IQD,
  "suggestedPrice": number in IQD,
  "recommendation": "selling strategy recommendation in Arabic"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this item and provide pricing information for the ${governorate} market in Iraq. Respond ONLY with valid JSON.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response content:', content);

    // Parse the JSON response, handling potential markdown wrapping
    let parsedResult;
    try {
      // Try to extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsedResult = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Check if it's a non-sellable item
    if (parsedResult.error === 'not_sellable_item') {
      return new Response(
        JSON.stringify(parsedResult),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add mock similar listings (in production, you'd fetch real data)
    parsedResult.listingLinks = [
      { 
        title: `${parsedResult.itemName} - مستعمل`,
        price: parsedResult.averagePrice,
        url: '#'
      },
      { 
        title: `${parsedResult.itemName} - حالة جيدة`,
        price: Math.round(parsedResult.averagePrice * 1.1),
        url: '#'
      },
      { 
        title: `${parsedResult.itemName} - للبيع`,
        price: Math.round(parsedResult.averagePrice * 0.9),
        url: '#'
      },
    ];

    console.log('Analysis complete:', parsedResult);

    return new Response(
      JSON.stringify(parsedResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error analyzing item:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to analyze item' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
