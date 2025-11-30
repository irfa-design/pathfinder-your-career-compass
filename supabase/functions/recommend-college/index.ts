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
    console.log('Generating skill recommendations for college student:', profileData);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert career counselor for college students. Based on the student's profile and career goal, perform a skill gap analysis and recommend skills to learn and certifications to pursue. Return recommendations in JSON format with this structure:
{
  "career_role": "target career",
  "required_skills": ["skill1", "skill2", ...],
  "skills_you_have": ["skill1", ...],
  "skills_to_learn": [
    {
      "skill": "skill name",
      "priority": "high|medium|low",
      "reason": "why this skill is important"
    }
  ],
  "recommended_certifications": [
    {
      "name": "certification name",
      "provider": "provider",
      "reason": "why this certification helps"
    }
  ],
  "readiness_percentage": 70,
  "guidance": "personalized career advice"
}`;

    const userPrompt = `Student Profile:
- Degree: ${profileData.degree}
- Year: ${profileData.year}
- CGPA: ${profileData.cgpa || 'Not provided'}
- Career Goal: ${profileData.career_goal}
- Current Skills: ${profileData.current_skills.join(', ')}
- Certificates: ${profileData.certificates?.join(', ') || 'None'}
- Achievements: ${profileData.achievements?.join(', ') || 'None'}

Please analyze their skill gap for their career goal and recommend skills to learn and certifications to pursue.`;

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

    console.log('Skill recommendations generated successfully');

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("recommend-college error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});