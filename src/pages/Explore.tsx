import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Search, Building, Briefcase, GraduationCap, 
  MapPin, DollarSign, TrendingUp, Award, Users, Star,
  BookOpen, Filter, ExternalLink
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Explore() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [collegesRes, careersRes, coursesRes, internshipsRes] = await Promise.all([
        supabase.from("colleges").select("*"),
        supabase.from("careers").select("*"),
        supabase.from("courses").select("*"),
        supabase.from("internship_roles").select("*"),
      ]);

      setColleges(collegesRes.data || []);
      setCareers(careersRes.data || []);
      setCourses(coursesRes.data || []);
      setInternships(internshipsRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredColleges = colleges.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(c => !locationFilter || c.state?.toLowerCase().includes(locationFilter.toLowerCase()));

  const filteredCareers = careers.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = courses.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.stream?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInternships = internships.filter(i =>
    i.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl animate-float animation-delay-300" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Explore Opportunities</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover colleges, careers, courses, and internships all in one place
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass p-4 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search colleges, careers, courses..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All States</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="tamil nadu">Tamil Nadu</SelectItem>
                <SelectItem value="telangana">Telangana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="colleges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="colleges" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Colleges</span>
              <Badge variant="secondary" className="ml-1">{filteredColleges.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="careers" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Careers</span>
              <Badge variant="secondary" className="ml-1">{filteredCareers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
              <Badge variant="secondary" className="ml-1">{filteredCourses.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="internships" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Internships</span>
              <Badge variant="secondary" className="ml-1">{filteredInternships.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colleges" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredColleges.map((college, index) => (
                <Card key={index} className="glass card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1">{college.name}</CardTitle>
                    {college.location && (
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {college.location}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {college.budget_min && college.budget_max && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>₹{college.budget_min.toLocaleString()} - ₹{college.budget_max.toLocaleString()}/yr</span>
                        </div>
                      )}
                      {college.placement_percentage && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span>{college.placement_percentage}% Placement</span>
                        </div>
                      )}
                      {college.scholarship_available && (
                        <Badge variant="secondary" className="mt-2">
                          <Award className="h-3 w-3 mr-1" />
                          Scholarships Available
                        </Badge>
                      )}
                    </div>
                    {college.courses_offered && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {college.courses_offered.slice(0, 3).map((course: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">{course}</Badge>
                        ))}
                        {college.courses_offered.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{college.courses_offered.length - 3}</Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredColleges.length === 0 && (
              <div className="text-center py-12">
                <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No colleges found matching your search</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="careers" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCareers.map((career, index) => (
                <Card key={index} className="glass card-hover">
                  <CardHeader>
                    <CardTitle className="text-lg">{career.name}</CardTitle>
                    {career.description && (
                      <CardDescription className="line-clamp-2">{career.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {career.required_skills && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {career.required_skills.slice(0, 5).map((skill: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {career.recommended_certifications && career.recommended_certifications.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Certifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {career.recommended_certifications.slice(0, 3).map((cert: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">{cert}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredCareers.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No careers found matching your search</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course, index) => (
                <Card key={index} className="glass card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <Badge>{course.stream}</Badge>
                    </div>
                    {course.description && (
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {course.related_subjects && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Related Subjects:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.related_subjects.slice(0, 4).map((subject: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">{subject}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {course.related_interests && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Best for:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.related_interests.slice(0, 3).map((interest: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">{interest}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No courses found matching your search</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="internships" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInternships.map((internship, index) => (
                <Card key={index} className="glass card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{internship.title}</CardTitle>
                      <Badge variant="secondary">{internship.experience_level}</Badge>
                    </div>
                    {internship.description && (
                      <CardDescription className="line-clamp-2">{internship.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {internship.required_skills && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {internship.required_skills.slice(0, 5).map((skill: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {internship.recommended_for && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Recommended for:</p>
                        <div className="flex flex-wrap gap-1">
                          {internship.recommended_for.slice(0, 3).map((rec: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">{rec}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredInternships.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No internships found matching your search</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
