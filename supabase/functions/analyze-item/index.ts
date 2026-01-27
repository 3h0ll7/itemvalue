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
    const { imageBase64, governorate, itemCondition, purchaseYear } = await req.json();

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

    console.log('Analyzing item for governorate:', governorate, 'condition:', itemCondition, 'year:', purchaseYear);

    const currentYear = new Date().getFullYear();
    const itemAge = purchaseYear ? currentYear - purchaseYear : null;
    const ageContext = itemAge !== null 
      ? `The item was purchased ${itemAge} year(s) ago (in ${purchaseYear}). Factor depreciation based on age.`
      : 'Purchase year unknown.';
    
    const conditionContext = itemCondition 
      ? `The seller describes the item condition as: "${itemCondition}". Use this to adjust pricing.`
      : '';

    const systemPrompt = `You are an expert used items appraiser for the Iraqi market. Your job is to EVALUATE and PRICE items, not to reject them.

CRITICAL RULES:
1. You MUST respond with valid JSON only. No markdown, no code blocks, just pure JSON.
2. Be GENEROUS in accepting items - almost EVERYTHING can be sold in a used marketplace!
3. ONLY reject if image shows: perishable food (like cooked meals), live animals, illegal items, or ONLY a person's face with no product visible.
4. When in doubt, EVALUATE THE ITEM. Do not reject.

SELLER-PROVIDED INFORMATION:
${conditionContext}
${ageContext}

CONDITION PRICING ADJUSTMENTS:
- جديد (New): 85-95% of original retail price
- مستعمل نظيف (Clean Used): 60-80% of original retail price
- مستهلك (Worn): 30-55% of original retail price

AGE DEPRECIATION:
- 0-1 years: minimal depreciation (5-10%)
- 2-3 years: moderate depreciation (15-25%)
- 4-5 years: significant depreciation (30-40%)
- 6+ years: heavy depreciation (45-60%+)

EXAMPLES OF SELLABLE ITEMS (always evaluate these):
- Electronics: phones, laptops, tablets, TVs, gaming consoles, headphones, cameras, chargers, cables, etc.
- Furniture: chairs, tables, beds, sofas, cabinets, desks, shelves, etc.
- Appliances: refrigerators, washing machines, microwaves, air conditioners, fans, blenders, etc.
- Clothing & Accessories: clothes, shoes, bags, watches, jewelry, sunglasses, etc.
- Vehicles & Parts: cars, motorcycles, bicycles, car parts, tires, batteries, etc.
- Tools & Equipment: power tools, hand tools, machinery, generators, etc.
- Sports & Fitness: gym equipment, sports gear, bicycles, weights, etc.
- Books, Games & Toys: books, board games, video games, toys, collectibles, etc.
- Home Items: lamps, rugs, curtains, frames, kitchenware, dishes, etc.
- Musical Instruments: guitars, keyboards, drums, speakers, etc.
- Office Supplies: printers, monitors, keyboards, mice, office chairs, etc.
- Garden Items: plants (not food), pots, garden tools, outdoor furniture, etc.
- Baby Items: strollers, cribs, baby clothes, toys, etc.
- ANY physical object that could be resold!

For evaluation, determine:
1. Item type/category
2. Specific item name (include brand/model if visible)
3. Condition: Excellent (like new), Good (minor wear), Fair (visible wear), Poor (damaged but functional)
4. Condition score (0-100)
5. Market prices in Iraqi Dinars (IQD)
6. Confidence score (0-100) based on how certain you are about the pricing

Location pricing for "${governorate}":
- Baghdad: highest prices (reference)
- Basra, Erbil, Sulaymaniyah: 90-95% of Baghdad
- Other governorates: 80-90% of Baghdad

Respond with this JSON structure:
{
  "itemType": "category in Arabic",
  "itemName": "specific item name",
  "condition": "Excellent|Good|Fair|Poor",
  "conditionScore": 0-100,
  "averagePrice": number in IQD,
  "lowestPrice": number in IQD,
  "highestPrice": number in IQD,
  "suggestedPrice": number in IQD,
  "recommendation": "نصيحة للبيع بالعربي",
  "confidenceScore": 0-100,
  "priceDistribution": [
    {"range": "lowest range", "count": number, "percentage": number},
    {"range": "mid-low range", "count": number, "percentage": number},
    {"range": "mid-high range", "count": number, "percentage": number},
    {"range": "highest range", "count": number, "percentage": number}
  ],
  "similarSales": [
    {"title": "similar item sold", "price": number, "soldDate": "منذ X أيام", "condition": "حالة المنتج"}
  ]
}

ONLY if the image shows perishable food, live animals, or illegal items, respond with:
{"error": "not_sellable_item", "message": "هذا العنصر غير قابل للبيع في سوق المستعمل"}`;

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
                text: `Please evaluate and price this item for the ${governorate} market in Iraq. The seller says the condition is "${itemCondition || 'not specified'}" and was purchased in ${purchaseYear || 'unknown year'}. This is a used item marketplace - provide pricing with confidence metrics. Respond ONLY with valid JSON.`
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
    // NOTE: Return 200 so the client can read the JSON body without FunctionsHttpError.
    if (parsedResult?.error === 'not_sellable_item') {
      return new Response(
        JSON.stringify(parsedResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
