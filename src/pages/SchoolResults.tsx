import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, TrendingUp, MapPin, DollarSign, Award, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SchoolResults() {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [colleges, setColleges] = useState<any[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<any[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const profileId = location.state?.profileId;
      if (!profileId) {
        navigate("/school-student");
        return;
      }

      const { data: recData, error: recError } = await supabase
        .from("recommendations")
        .select("*")
        .eq("profile_id", profileId)
        .eq("profile_type", "school")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (recError) {
        console.error("Error fetching recommendation:", recError);
      } else if (recData) {
        setRecommendations(recData.recommendation_data);
      }

      const { data: collegeData } = await supabase
        .from("colleges")
        .select("*");
      
      if (collegeData) {
        setColleges(collegeData);
        setFilteredColleges(collegeData);
      }
    };

    fetchData();
  }, [location, navigate]);

  useEffect(() => {
    let filtered = [...colleges];
    
    if (locationFilter) {
      filtered = filtered.filter(c => 
        c.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        c.state?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        c.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    if (budgetFilter && budgetFilter !== "all") {
      filtered = filtered.filter(c => {
        if (!c.budget_max) return true;
        if (budgetFilter === "low") return c.budget_max <= 50000;
        if (budgetFilter === "medium") return c.budget_min >= 50000 && c.budget_max <= 200000;
        if (budgetFilter === "high") return c.budget_min >= 200000;
        return true;
      });
    }
    
    setFilteredColleges(filtered);
  }, [locationFilter, budgetFilter, colleges]);

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
            Your Personalized Career Path
          </h1>
          <p className="text-muted-foreground text-lg">Comprehensive recommendations based on your profile</p>
        </div>

        {recommendations.personality_type && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
            <h2 className="text-2xl font-semibold mb-3">Your Personality Profile</h2>
            <div className="flex items-center gap-4 mb-3">
              <Badge variant="secondary" className="text-xl px-4 py-2">
                {recommendations.personality_type}
              </Badge>
            </div>
            <p className="text-muted-foreground">{recommendations.personality_description}</p>
          </Card>
        )}

        <Tabs defaultValue="courses" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="colleges">Colleges</TabsTrigger>
            <TabsTrigger value="explorer">Course Info</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Recommended Streams
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {recommendations.recommended_streams?.map((stream: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-lg px-4 py-2">
                    {stream}
                  </Badge>
                ))}
              </div>

              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Best Match Courses
              </h3>
              <div className="space-y-4">
                {recommendations.courses?.map((course: any, index: number) => (
                  <Card key={index} className="p-4 border-l-4 border-l-primary">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{course.name}</h3>
                      <Badge>{course.stream}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{course.reason}</p>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Match Score:</span>
                        <Badge variant="outline">{course.match_score}%</Badge>
                      </div>
                      <Progress value={course.match_score} className="flex-1 max-w-[200px]" />
                    </div>
                    {course.career_outcomes && (
                      <div className="mb-2">
                        <span className="text-sm font-semibold">Career Paths: </span>
                        <span className="text-sm text-muted-foreground">{course.career_outcomes.join(", ")}</span>
                      </div>
                    )}
                    {course.entrance_exams && course.entrance_exams.length > 0 && (
                      <div>
                        <span className="text-sm font-semibold">Entrance Exams: </span>
                        <span className="text-sm text-muted-foreground">{course.entrance_exams.join(", ")}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-4">
            {recommendations.roadmap?.milestones && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Your Learning Roadmap</h2>
                <div className="space-y-6">
                  {recommendations.roadmap.milestones.map((milestone: any, index: number) => (
                    <div key={index} className="relative pl-8 pb-6 border-l-2 border-primary/30 last:border-l-0">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary" />
                      <div className="mb-1">
                        <Badge variant="outline" className="mb-2">{milestone.timeline}</Badge>
                        <h3 className="text-lg font-semibold">{milestone.stage}</h3>
                      </div>
                      <p className="text-muted-foreground">{milestone.focus}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="colleges" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Find Your Perfect College</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="location">Filter by Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter city or state..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Budgets</SelectItem>
                      <SelectItem value="low">Under ₹50,000/year</SelectItem>
                      <SelectItem value="medium">₹50,000 - ₹2,00,000/year</SelectItem>
                      <SelectItem value="high">Above ₹2,00,000/year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredColleges.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No colleges match your filters</p>
                ) : (
                  filteredColleges.map((college, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">{college.name}</h3>
                        {college.scholarship_available && (
                          <Badge variant="secondary">
                            <Award className="h-3 w-3 mr-1" />
                            Scholarship
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {college.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{college.location}</span>
                          </div>
                        )}
                        {college.budget_min && college.budget_max && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>₹{college.budget_min.toLocaleString()} - ₹{college.budget_max.toLocaleString()}/year</span>
                          </div>
                        )}
                        {college.placement_percentage && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span>{college.placement_percentage}% Placements</span>
                          </div>
                        )}
                        {college.min_mark && (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span>Min. {college.min_mark}% required</span>
                          </div>
                        )}
                      </div>
                      
                      {college.facilities && college.facilities.length > 0 && (
                        <div className="mt-3 flex items-start gap-2">
                          <Building className="h-4 w-4 text-muted-foreground mt-1" />
                          <div className="flex flex-wrap gap-1">
                            {college.facilities.map((facility: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">{facility}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {college.courses_offered && college.courses_offered.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm font-medium">Courses: </span>
                          <span className="text-sm text-muted-foreground">{college.courses_offered.join(", ")}</span>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="explorer" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Course Information Explorer</h2>
              <p className="text-muted-foreground mb-6">
                Detailed information about each recommended course to help you make informed decisions.
              </p>
              
              <div className="space-y-6">
                {recommendations.courses?.map((course: any, index: number) => (
                  <Card key={index} className="p-5 bg-secondary/20">
                    <h3 className="text-xl font-bold mb-3">{course.name}</h3>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold">Duration: </span>
                        <span className="text-muted-foreground">3-4 years (typical undergraduate)</span>
                      </div>
                      
                      {course.career_outcomes && course.career_outcomes.length > 0 && (
                        <div>
                          <span className="font-semibold">Career Outcomes: </span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {course.career_outcomes.map((career: string, i: number) => (
                              <Badge key={i} variant="secondary">{career}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <span className="font-semibold">Why Choose This? </span>
                        <p className="text-muted-foreground mt-1">{course.reason}</p>
                      </div>
                      
                      {course.entrance_exams && course.entrance_exams.length > 0 && (
                        <div>
                          <span className="font-semibold">Entrance Exams Required: </span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {course.entrance_exams.map((exam: string, i: number) => (
                              <Badge key={i} variant="outline">{exam}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-3 border-t">
                        <span className="font-semibold">Future Job Demand: </span>
                        <span className="text-muted-foreground">
                          {course.match_score > 80 ? "Very High" : course.match_score > 60 ? "High" : "Moderate"}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Personalized Guidance</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{recommendations.guidance}</p>
        </Card>
      </div>
    </div>
  );
}