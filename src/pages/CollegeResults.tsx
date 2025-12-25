import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Target, TrendingUp, Award, BookOpen, Briefcase, Clock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CollegeResults() {
  const [recommendations, setRecommendations] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // First check if recommendations were passed directly in state
    if (location.state?.recommendations) {
      setRecommendations(location.state.recommendations);
      return;
    }

    // Otherwise fetch from database
    const fetchData = async () => {
      const profileId = location.state?.profileId;
      if (!profileId) {
        navigate("/college-student");
        return;
      }

      const { data, error } = await supabase
        .from("recommendations")
        .select("*")
        .eq("profile_id", profileId)
        .eq("profile_type", "college")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching recommendation:", error);
      } else if (data) {
        setRecommendations(data.recommendation_data);
      }
    };

    fetchData();
  }, [location, navigate]);

  if (!recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading recommendations...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Career Development Plan
          </h1>
          <p className="text-muted-foreground text-lg">Comprehensive skill analysis and roadmap</p>
        </div>

        <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Career Readiness
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Your target: {recommendations.career_role}</p>
            </div>
            <Badge variant="secondary" className="text-2xl px-6 py-3">
              {recommendations.readiness_percentage}%
            </Badge>
          </div>
          <Progress value={recommendations.readiness_percentage} className="h-4" />
          
          {recommendations.alternative_roles && recommendations.alternative_roles.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium">Alternative Paths: </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {recommendations.alternative_roles.map((role: string, i: number) => (
                  <Badge key={i} variant="outline">{role}</Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Tabs defaultValue="skills" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="skills">Skill Gap</TabsTrigger>
            <TabsTrigger value="roadmap">Learning Path</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-4">
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Skills You Have
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendations.skills_you_have?.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-green-500/10 text-green-700 border-green-500/20">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Skills to Learn
                </h3>
                <div className="space-y-3">
                  {recommendations.skills_to_learn?.map((item: any, index: number) => (
                    <Card key={index} className="p-4 border-l-4 border-l-primary">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{item.skill}</h4>
                          {item.learning_time && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {item.learning_time}
                            </p>
                          )}
                        </div>
                        <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                          {item.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.reason}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {recommendations.certificate_analysis && (
                <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Your Certificate Analysis</h3>
                  <p className="text-sm text-muted-foreground">{recommendations.certificate_analysis}</p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-4">
            {recommendations.learning_roadmap?.phases && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Personalized Learning Roadmap</h2>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {recommendations.learning_roadmap.timeline_weeks} weeks
                  </Badge>
                </div>
                
                <div className="space-y-8">
                  {recommendations.learning_roadmap.phases.map((phase: any, index: number) => (
                    <div key={index} className="relative pl-8 pb-6 border-l-2 border-primary/30 last:border-l-0">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary" />
                      
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold">{phase.phase}</h3>
                          <Badge variant="secondary">{phase.weeks}</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-semibold">Skills to Master:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {phase.skills.map((skill: string, i: number) => (
                              <Badge key={i} variant="outline">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        {phase.projects && phase.projects.length > 0 && (
                          <div>
                            <span className="text-sm font-semibold">Practice Projects:</span>
                            <ul className="list-disc list-inside mt-1 text-sm text-muted-foreground">
                              {phase.projects.map((project: string, i: number) => (
                                <li key={i}>{project}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {phase.resources && phase.resources.length > 0 && (
                          <div>
                            <span className="text-sm font-semibold">Resources:</span>
                            <ul className="list-disc list-inside mt-1 text-sm text-muted-foreground">
                              {phase.resources.map((resource: string, i: number) => (
                                <li key={i}>{resource}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Recommended Certifications
              </h2>
              <div className="space-y-3">
                {recommendations.recommended_certifications?.map((cert: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">{cert.provider}</p>
                      </div>
                      {cert.priority && (
                        <Badge variant={cert.priority === 'high' ? 'destructive' : cert.priority === 'medium' ? 'default' : 'secondary'}>
                          {cert.priority}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{cert.reason}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="internships" className="space-y-4">
            {recommendations.internship_recommendations && recommendations.internship_recommendations.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Suitable Internship Roles
                </h2>
                <div className="space-y-4">
                  {recommendations.internship_recommendations.map((internship: any, index: number) => (
                    <Card key={index} className="p-4 border-l-4 border-l-secondary">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-lg">{internship.title}</h4>
                        <Badge 
                          variant={internship.readiness_level === 'ready' ? 'default' : 'outline'}
                          className={internship.readiness_level === 'ready' ? 'bg-green-500' : ''}
                        >
                          {internship.readiness_level === 'ready' ? 'Apply Now!' : `Ready in ${internship.readiness_level}`}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-sm font-semibold">Required Skills:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {internship.required_skills.map((skill: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Personalized Guidance & Next Steps
          </h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{recommendations.guidance}</p>
        </Card>
      </div>
    </div>
  );
}