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

    const systemPrompt = `You are an expert career counselor for college students. Provide comprehensive career guidance including skill gap analysis, learning roadmap, alternative career paths, and internship recommendations. Return in JSON format:
{
  "career_role": "primary target role",
  "alternative_roles": ["role1", "role2"],
  "required_skills": ["skill1", "skill2"],
  "skills_you_have": ["skill1"],
  "skills_to_learn": [
    {
      "skill": "skill name",
      "priority": "high|medium|low",
      "reason": "why important",
      "learning_time": "2-4 weeks"
    }
  ],
  "learning_roadmap": {
    "timeline_weeks": 16,
    "phases": [
      {
        "phase": "Beginner",
        "weeks": "1-4",
        "skills": ["skill1", "skill2"],
        "projects": ["project idea"],
        "resources": ["resource links"]
      },
      {
        "phase": "Intermediate",
        "weeks": "5-10",
        "skills": ["skill3", "skill4"],
        "projects": ["project idea"],
        "resources": ["resource links"]
      },
      {
        "phase": "Advanced",
        "weeks": "11-16",
        "skills": ["skill5"],
        "projects": ["capstone project"],
        "resources": ["resource links"]
      }
    ]
  },
  "recommended_certifications": [
    {
      "name": "cert name",
      "provider": "provider",
      "priority": "high|medium|low",
      "reason": "why it helps"
    }
  ],
  "internship_recommendations": [
    {
      "title": "role title",
      "required_skills": ["skill1", "skill2"],
      "readiness_level": "ready|2-months|4-months"
    }
  ],
  "readiness_percentage": 70,
  "certificate_analysis": "analysis of existing certificates and how they help",
  "guidance": "personalized career and next steps advice"
}`;

    const userPrompt = `Student Profile:
- Degree: ${profileData.degree}
- Year: ${profileData.year}
- CGPA: ${profileData.cgpa || 'Not provided'}
- Career Goal: ${profileData.career_goal}
- Current Skills: ${profileData.current_skills.join(', ')}
- Certificates: ${profileData.certificates?.join(', ') || 'None'}
- Achievements: ${profileData.achievements?.join(', ') || 'None'}

Perform comprehensive analysis:
1. Identify skill gaps for their career goal
2. Create a detailed learning roadmap (beginner → intermediate → advanced)
3. Suggest alternative career paths that match their profile
4. Analyze their existing certificates and achievements
5. Recommend suitable internship roles with readiness timeline
6. Provide actionable next steps`;

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