import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Briefcase, Compass, LogOut, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-accent/10 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-primary to-accent">
              <Compass className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              Welcome to PathFinder
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Confused About Your Future? Let AI Guide You.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12">
            <Card className="border-primary/20 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <BookOpen className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">School Students</CardTitle>
                <CardDescription className="text-base">
                  Discover the right stream, course, and college for your future
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Stream recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Course suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Matching colleges
                  </li>
                </ul>
                <Button className="w-full" size="lg" disabled>
                  Login to Continue
                </Button>
              </CardContent>
            </Card>

            <Card className="border-accent/20 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-accent/10">
                    <Briefcase className="w-10 h-10 text-accent" />
                  </div>
                </div>
                <CardTitle className="text-2xl">College Students</CardTitle>
                <CardDescription className="text-base">
                  Get personalized skill recommendations for your career path
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Skill gap analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Career roadmap
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Certification guidance
                  </li>
                </ul>
                <Button className="w-full" size="lg" variant="secondary" disabled>
                  Login to Continue
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="pt-8">
            <Button size="lg" onClick={() => navigate('/auth')} className="px-8">
              Get Started - Login or Sign Up
            </Button>
          </div>

          <div className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Join thousands of students finding their perfect path
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-accent/10">
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-primary to-accent">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PathFinder
            </h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Journey
          </h2>
          <p className="text-xl text-muted-foreground">
            Select your profile to get AI-powered recommendations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-primary/20 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate('/school-student')}>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl text-center">School Student</CardTitle>
              <CardDescription className="text-center text-base">
                Find your ideal stream, course, and college
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>AI-powered stream recommendations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Personalized course suggestions</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>College matching based on your profile</span>
                </li>
              </ul>
              <Button className="w-full" size="lg">
                Start Your Journey
              </Button>
            </CardContent>
          </Card>

          <Card className="border-accent/20 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate('/college-student')}>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-accent/10">
                  <Briefcase className="w-12 h-12 text-accent" />
                </div>
              </div>
              <CardTitle className="text-3xl text-center">College Student</CardTitle>
              <CardDescription className="text-center text-base">
                Build skills for your dream career
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>Comprehensive skill gap analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>Personalized career roadmap</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>Certification and course recommendations</span>
                </li>
              </ul>
              <Button className="w-full" size="lg" variant="secondary">
                Plan Your Career
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
