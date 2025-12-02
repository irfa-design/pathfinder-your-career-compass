import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  BookOpen, Briefcase, Compass, LogOut, Sparkles, Rocket, 
  TrendingUp, Users, Star, Zap, Award, Target, ChevronRight,
  GraduationCap, Brain, LineChart
} from "lucide-react";
import { AnimatedCounter } from "@/components/features/AnimatedCounter";
import { LiveUsersCounter } from "@/components/features/LiveUsersCounter";
import { TrendingCareers } from "@/components/features/TrendingCareers";
import { SuccessStory } from "@/components/features/SuccessStory";
import { DailyTip } from "@/components/features/DailyTip";
import { BadgeDisplay, Badge as BadgeType } from "@/components/features/BadgeDisplay";
import { XPBar } from "@/components/features/XPBar";
import { StreakCounter } from "@/components/features/StreakCounter";
import { AIChatWidget } from "@/components/features/AIChatWidget";

const trendingCareers = [
  { name: "AI/ML Engineer", growth: 45, seekers: 12450, category: "Tech" },
  { name: "Data Scientist", growth: 38, seekers: 9800, category: "Analytics" },
  { name: "Full Stack Developer", growth: 32, seekers: 15200, category: "Tech" },
  { name: "Product Manager", growth: 28, seekers: 7600, category: "Business" },
];

const sampleBadges: BadgeType[] = [
  { id: "1", name: "Profile Pioneer", description: "Complete your first profile", icon: "star", color: "primary", earned: true },
  { id: "2", name: "Quick Learner", description: "Complete 5 learning modules", icon: "zap", color: "secondary", earned: true },
  { id: "3", name: "Career Explorer", description: "Explore 10 career paths", icon: "target", color: "accent", earned: false },
  { id: "4", name: "Skill Master", description: "Master 5 skills", icon: "trophy", color: "success", earned: false },
];

const stats = [
  { icon: Users, label: "Students Guided", value: 50000, suffix: "+" },
  { icon: Target, label: "Career Matches", value: 25000, suffix: "+" },
  { icon: Award, label: "Success Rate", value: 94, suffix: "%" },
  { icon: Star, label: "Avg Rating", value: 4.9, suffix: "" },
];

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary animate-pulse-scale flex items-center justify-center">
            <Compass className="w-8 h-8 text-white animate-spin-slow" />
          </div>
          <p className="text-muted-foreground animate-pulse">Loading PathFinder...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background overflow-hidden">
        {/* Hero Section */}
        <div className="relative">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float" />
            <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-secondary/20 blur-3xl animate-float animation-delay-200" />
            <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full bg-accent/20 blur-3xl animate-float animation-delay-500" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <header className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-display font-bold text-gradient">PathFinder</span>
              </div>
              <div className="flex items-center gap-4">
                <LiveUsersCounter />
                <Button onClick={() => navigate('/auth')} className="bg-gradient-primary hover:opacity-90 transition-opacity">
                  Get Started
                </Button>
              </div>
            </header>

            {/* Hero content */}
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
              <div className="space-y-8 animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">AI-Powered Career Guidance</span>
                </div>
                
                <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-tight">
                  Find Your
                  <span className="block text-gradient-hero">Perfect Career</span>
                  <span className="block">Path Today</span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                  Confused about your future? Let AI analyze your interests, skills, and goals 
                  to recommend the ideal career path, courses, and colleges.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/auth')} 
                    className="bg-gradient-primary hover:opacity-90 transition-all hover:scale-105 shadow-lg group"
                  >
                    Start Free Assessment
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline" className="group">
                    Watch Demo
                    <Rocket className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border/50">
                  {stats.map((stat, index) => (
                    <div 
                      key={stat.label} 
                      className="text-center animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature cards */}
              <div className="space-y-6 animate-slide-in-right">
                <Card className="glass card-hover border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <CardHeader className="relative">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">School Students</CardTitle>
                        <CardDescription>10th - 12th Grade</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <ul className="space-y-3 mb-6">
                      {["Stream recommendations", "Personality assessment", "College matching", "Career roadmaps"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-primary" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-gradient-primary" disabled>
                      Login to Explore
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass card-hover border-secondary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent" />
                  <CardHeader className="relative">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg">
                        <Briefcase className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">College Students</CardTitle>
                        <CardDescription>Undergrad & Postgrad</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <ul className="space-y-3 mb-6">
                      {["Skill gap analysis", "Learning roadmaps", "Internship matching", "Certificate guidance"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-secondary" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant="secondary" disabled>
                      Login to Explore
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Careers Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                <TrendingUp className="inline w-8 h-8 text-primary mr-2" />
                Trending Careers in 2024
              </h2>
              <p className="text-muted-foreground">Discover what career paths are growing the fastest</p>
            </div>
            <TrendingCareers careers={trendingCareers} />
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                <Star className="inline w-8 h-8 text-warning mr-2" />
                Success Stories
              </h2>
              <p className="text-muted-foreground">Hear from students who found their path</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <SuccessStory 
                name="Priya Sharma"
                role="Data Scientist"
                company="Google"
                story="PathFinder helped me realize my passion for data science. The skill roadmap was exactly what I needed to transition from computer science."
                badge="Top Achiever"
              />
              <SuccessStory 
                name="Rahul Kumar"
                role="Product Manager"
                company="Microsoft"
                story="I was confused between MBA and tech. PathFinder's personality test showed I'd excel in product management. Best decision ever!"
              />
              <SuccessStory 
                name="Ananya Patel"
                role="UX Designer"
                company="Adobe"
                story="Coming from arts, I didn't know design could be a career. PathFinder opened my eyes to UX design and I've never looked back."
                badge="Rising Star"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Ready to Discover Your Path?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who've found their dream careers with PathFinder.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')} 
              className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 shadow-lg hover:scale-105 transition-all"
            >
              Start Free - No Credit Card Required
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2024 PathFinder. Empowering students to find their perfect career path.</p>
          </div>
        </footer>

        <AIChatWidget />
      </div>
    );
  }

  // Logged in state
  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl animate-float animation-delay-300" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient">PathFinder</span>
          </div>
          <div className="flex items-center gap-4">
            <LiveUsersCounter />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* User Stats Bar */}
        <div className="glass rounded-2xl p-6 mb-8 animate-slide-down">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <XPBar currentXP={750} levelXP={1000} level={5} />
            <div className="flex justify-center">
              <StreakCounter streak={12} maxStreak={15} />
            </div>
            <BadgeDisplay badges={sampleBadges} className="justify-end" />
          </div>
        </div>

        {/* Daily Tip */}
        <DailyTip className="mb-8 animate-fade-in" />

        {/* Welcome Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Welcome Back! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            Ready to continue your journey? Choose your path below.
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card 
            className="glass card-hover border-primary/20 cursor-pointer group overflow-hidden"
            onClick={() => navigate('/school-student')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">School Student</CardTitle>
              <CardDescription className="text-center">
                Find your ideal stream, course, and college
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-3 mb-6">
                {[
                  { icon: Brain, text: "Personality assessment" },
                  { icon: Target, text: "Stream recommendations" },
                  { icon: BookOpen, text: "Course explorer" },
                  { icon: LineChart, text: "Career roadmaps" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-gradient-primary group-hover:opacity-90" size="lg">
                Start Journey
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="glass card-hover border-secondary/20 cursor-pointer group overflow-hidden"
            onClick={() => navigate('/college-student')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">College Student</CardTitle>
              <CardDescription className="text-center">
                Build skills for your dream career
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-3 mb-6">
                {[
                  { icon: Zap, text: "Skill gap analysis" },
                  { icon: LineChart, text: "Learning roadmaps" },
                  { icon: Award, text: "Certification guidance" },
                  { icon: Rocket, text: "Internship matching" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-secondary" />
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="secondary" size="lg">
                Plan Career
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trending Careers */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Trending Careers
          </h2>
          <TrendingCareers careers={trendingCareers} />
        </div>
      </div>

      <AIChatWidget />
    </div>
  );
};

export default Index;
