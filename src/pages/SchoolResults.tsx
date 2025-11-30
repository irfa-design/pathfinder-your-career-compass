import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, GraduationCap, BookOpen, MapPin } from "lucide-react";
import { useEffect } from "react";

export default function SchoolResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendations, profile } = location.state || {};

  useEffect(() => {
    if (!recommendations) {
      navigate('/school-student');
    }
  }, [recommendations, navigate]);

  if (!recommendations) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Personalized Path
          </h1>
          <p className="text-muted-foreground text-lg">Here's what we recommend for {profile?.name}</p>
        </div>

        <div className="space-y-6">
          {recommendations.explanation && (
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Guidance for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{recommendations.explanation}</p>
              </CardContent>
            </Card>
          )}

          {recommendations.streams && recommendations.streams.length > 0 && (
            <Card className="border-accent/20 shadow-lg">
              <CardHeader>
                <CardTitle>Recommended Streams</CardTitle>
                <CardDescription>Based on your interests and subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recommendations.streams.map((stream: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-base px-4 py-2">
                      {stream}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {recommendations.courses && recommendations.courses.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Top Course Recommendations
              </h2>
              {recommendations.courses.map((course: any, idx: number) => (
                <Card key={idx} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{course.name}</CardTitle>
                        <CardDescription className="mt-1">
                          <Badge variant="outline">{course.stream}</Badge>
                        </CardDescription>
                      </div>
                      {course.match_score && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{course.match_score}%</div>
                          <p className="text-xs text-muted-foreground">Match</p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {course.match_score && (
                      <Progress value={course.match_score} className="mb-4" />
                    )}
                    <p className="text-muted-foreground mb-4">{course.reason}</p>
                    
                    {course.colleges && course.colleges.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Matching Colleges
                        </h4>
                        <div className="space-y-2">
                          {course.colleges.map((college: any, cIdx: number) => (
                            <div key={cIdx} className="p-3 bg-secondary/50 rounded-lg flex justify-between items-center">
                              <div>
                                <p className="font-medium">{college.name}</p>
                                <p className="text-sm text-muted-foreground">{college.location}</p>
                              </div>
                              <Badge variant="outline">{college.fee_type}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-4 pt-8">
            <Button onClick={() => navigate('/school-student')} variant="outline">
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