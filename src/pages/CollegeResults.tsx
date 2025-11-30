import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Target, TrendingUp, Award, CheckCircle2, Circle } from "lucide-react";
import { useEffect } from "react";

export default function CollegeResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendations, profile } = location.state || {};

  useEffect(() => {
    if (!recommendations) {
      navigate('/college-student');
    }
  }, [recommendations, navigate]);

  if (!recommendations) return null;

  const priorityColors = {
    high: "destructive",
    medium: "default",
    low: "secondary"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Career Roadmap
          </h1>
          <p className="text-muted-foreground text-lg">Skill analysis for {profile?.name}</p>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Target Role: {recommendations.career_role}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.readiness_percentage !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Career Readiness</span>
                    <span className="text-2xl font-bold text-primary">{recommendations.readiness_percentage}%</span>
                  </div>
                  <Progress value={recommendations.readiness_percentage} className="h-3" />
                </div>
              )}
              {recommendations.guidance && (
                <p className="text-muted-foreground mt-4">{recommendations.guidance}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.skills_you_have && recommendations.skills_you_have.length > 0 && (
              <Card className="border-green-500/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    Skills You Have
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.skills_you_have.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="border-green-500/50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {recommendations.required_skills && recommendations.required_skills.length > 0 && (
              <Card className="border-accent/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Circle className="h-5 w-5" />
                    All Required Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.required_skills.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {recommendations.skills_to_learn && recommendations.skills_to_learn.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Skills to Learn Next
              </h2>
              {recommendations.skills_to_learn.map((item: any, idx: number) => (
                <Card key={idx} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{item.skill}</CardTitle>
                      <Badge variant={priorityColors[item.priority as keyof typeof priorityColors] as any}>
                        {item.priority} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {recommendations.recommended_certifications && recommendations.recommended_certifications.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Award className="h-6 w-6 text-accent" />
                Recommended Certifications
              </h2>
              {recommendations.recommended_certifications.map((cert: any, idx: number) => (
                <Card key={idx} className="shadow-lg hover:shadow-xl transition-shadow border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-xl">{cert.name}</CardTitle>
                    <CardDescription>{cert.provider}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{cert.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-4 pt-8">
            <Button onClick={() => navigate('/college-student')} variant="outline">
              Create New Profile
            </Button>
            <Button onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}