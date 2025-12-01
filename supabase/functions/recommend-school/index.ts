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
    const { profileData } = await req.json();
    console.log('Generating recommendations for school student:', profileData);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert career counselor for school students. Based on the student's profile including personality traits, recommend suitable streams, courses, career paths, and college options. Return recommendations in JSON format with this structure:
{
  "personality_type": "RIASEC type (R/I/A/S/E/C)",
  "personality_description": "brief description of personality",
  "recommended_streams": ["Science", "Commerce", "Arts"],
  "courses": [
    {
      "name": "course name (e.g., B.E CSE, MBBS, BBA)",
      "stream": "stream",
      "reason": "why this matches the student",
      "match_score": 85,
      "career_outcomes": ["career1", "career2"],
      "entrance_exams": ["exam1", "exam2"]
    }
  ],
  "roadmap": {
    "milestones": [
      {"stage": "12th Grade", "focus": "what to focus on", "timeline": "now"},
      {"stage": "Entrance Prep", "focus": "exam preparation", "timeline": "6-12 months"},
      {"stage": "Degree", "focus": "college education", "timeline": "3-4 years"},
      {"stage": "Career Entry", "focus": "first job/internship", "timeline": "after graduation"}
    ]
  },
  "college_preferences": {
    "suggested_budget": "low/medium/high",
    "location_importance": "high/medium/low"
  },
  "guidance": "personalized career advice"
}`;

    const userPrompt = `Student Profile:
- Class: ${profileData.class_level}
- Favorite Subjects: ${profileData.favorite_subjects.join(', ')}
- Interests: ${profileData.interests.join(', ')}
- Average Mark: ${profileData.average_mark}%
- Achievements: ${profileData.achievements?.join(', ') || 'None'}
- Budget Range: ${profileData.budget_range || 'Not specified'}
- Location Preference: ${profileData.distance_preference || 'Not specified'}

Analyze their personality type (RIASEC model) based on interests and subjects, then recommend the best 3-5 degree courses with detailed career paths and a step-by-step roadmap from 12th grade to career entry.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const recommendations = JSON.parse(data.choices[0].message.content);

    console.log('Recommendations generated successfully');

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("recommend-school error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});