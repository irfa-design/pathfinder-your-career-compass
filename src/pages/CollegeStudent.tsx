import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, Briefcase, Target, Sparkles, ChevronLeft, 
  GraduationCap, Award, Code, Brain, CheckCircle2, User
} from "lucide-react";
import { ProfileCompletion } from "@/components/features/ProfileCompletion";

const skills = [
  "Programming", "Data Structures", "Web Development", "Python", 
  "JavaScript", "SQL", "Machine Learning", "Design", "Communication", 
  "Excel", "Java", "React", "Node.js", "Cloud Computing"
];

const careers = [
  "Software Developer", "Data Scientist", "UI/UX Designer", 
  "Digital Marketer", "Business Analyst", "Product Manager",
  "DevOps Engineer", "Full Stack Developer", "AI/ML Engineer"
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  degree: z.string().min(2, "Degree is required"),
  year: z.enum(["1", "2", "3", "4"]),
  cgpa: z.coerce.number().min(0).max(10, "CGPA must be between 0 and 10").optional(),
  career_goal: z.string().min(2, "Career goal is required"),
  current_skills: z.array(z.string()).min(1, "Select at least one skill"),
  certificates: z.string().optional(),
  achievements: z.string().optional(),
});

export default function CollegeStudent() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      degree: "",
      year: "2",
      cgpa: undefined,
      career_goal: "",
      current_skills: [],
      certificates: "",
      achievements: "",
    },
  });

  const watchedFields = form.watch();
  const completionSteps = [
    { id: "name", label: "Add your name", completed: !!watchedFields.name },
    { id: "degree", label: "Enter degree/program", completed: !!watchedFields.degree },
    { id: "career_goal", label: "Select career goal", completed: !!watchedFields.career_goal },
    { id: "current_skills", label: "Choose skills", completed: watchedFields.current_skills?.length > 0 },
    { id: "certificates", label: "Add certificates (optional)", completed: !!watchedFields.certificates },
  ];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
        navigate("/auth");
        return;
      }

      const profileData = {
        name: values.name,
        user_id: user.id,
        degree: values.degree,
        year: values.year,
        cgpa: values.cgpa || null,
        career_goal: values.career_goal,
        current_skills: values.current_skills,
        certificates: values.certificates ? values.certificates.split(',').map(c => c.trim()) : [],
        achievements: values.achievements ? values.achievements.split(',').map(a => a.trim()) : [],
      };

      const { data: profile, error: profileError } = await supabase
        .from('college_profiles')
        .insert([profileData])
        .select()
        .single();

      if (profileError) throw profileError;

      const { data: recommendations, error: recError } = await supabase.functions.invoke('recommend-college', {
        body: { profileData }
      });

      if (recError) throw recError;

      await supabase.from('recommendations').insert({
        profile_id: profile.id,
        profile_type: 'college',
        recommendation_data: recommendations
      });

      toast({ title: "Success!", description: "Your career path is ready" });
      navigate('/college-results', { state: { recommendations, profileId: profile.id, profile: profileData } });
    } catch (error: any) {
      console.error('Error:', error);
      toast({ title: "Error", description: error.message || "Failed to generate recommendations", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 md:w-80 md:h-80 rounded-full bg-secondary/5 blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-32 w-56 h-56 md:w-72 md:h-72 rounded-full bg-primary/5 blur-3xl animate-float animation-delay-300" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header */}
        <header className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="shrink-0 h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-muted"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-md shrink-0">
              <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-secondary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-foreground truncate">
                Career Profile
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                Share your journey to discover your next steps
              </p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar - Sticky on desktop */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4 md:space-y-6">
            <div className="lg:sticky lg:top-6">
              <ProfileCompletion steps={completionSteps} />
              
              <div className="mt-4 md:mt-6 bg-card rounded-xl border border-border p-4 md:p-5 shadow-sm">
                <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4 flex items-center gap-2 text-foreground">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  Quick Tips
                </h3>
                <ul className="space-y-2.5 md:space-y-3">
                  {[
                    "Be honest about your skills for accurate recommendations",
                    "Include all relevant certificates - they boost your profile",
                    "Add achievements like hackathons, projects, or leadership roles"
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-success mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Form */}
          <main className="lg:col-span-8 xl:col-span-9">
            <div className="bg-card rounded-xl border border-border p-4 sm:p-6 md:p-8 shadow-sm animate-fade-in">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                  
                  {/* Section: Basic Info */}
                  <section className="space-y-4 md:space-y-5">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <h2 className="font-semibold text-base md:text-lg text-foreground">Basic Information</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your name" 
                                className="h-10 md:h-11 bg-background border-input" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="degree"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">Degree/Program</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., B.E CSE, B.Com, BBA" 
                                className="h-10 md:h-11 bg-background border-input" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">Current Year</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-10 md:h-11 bg-background border-input">
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-popover border-border">
                                <SelectItem value="1">1st Year</SelectItem>
                                <SelectItem value="2">2nd Year</SelectItem>
                                <SelectItem value="3">3rd Year</SelectItem>
                                <SelectItem value="4">4th Year</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cgpa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              CGPA <span className="text-muted-foreground font-normal">(Optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="e.g., 8.5" 
                                className="h-10 md:h-11 bg-background border-input" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  {/* Section: Career Goal */}
                  <section className="space-y-4 md:space-y-5 pt-2">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Target className="w-4 h-4 text-accent" />
                      </div>
                      <h2 className="font-semibold text-base md:text-lg text-foreground">Career Goal</h2>
                    </div>

                    <FormField
                      control={form.control}
                      name="career_goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">What's your dream career?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10 md:h-11 bg-background border-input">
                                <SelectValue placeholder="Select career goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-popover border-border">
                              {careers.map((career) => (
                                <SelectItem key={career} value={career}>{career}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </section>

                  {/* Section: Skills */}
                  <section className="space-y-4 md:space-y-5 pt-2">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                        <Code className="w-4 h-4 text-success" />
                      </div>
                      <h2 className="font-semibold text-base md:text-lg text-foreground">Current Skills</h2>
                    </div>

                    <FormField
                      control={form.control}
                      name="current_skills"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Select skills you have</FormLabel>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                            {skills.map((skill) => (
                              <FormField
                                key={skill}
                                control={form.control}
                                name="current_skills"
                                render={({ field }) => (
                                  <FormItem className="flex items-center gap-2.5 space-y-0 p-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors cursor-pointer">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(skill)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, skill])
                                            : field.onChange(field.value?.filter((value) => value !== skill))
                                        }}
                                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer text-sm text-foreground leading-none">
                                      {skill}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage className="text-xs mt-2" />
                        </FormItem>
                      )}
                    />
                  </section>

                  {/* Section: Achievements */}
                  <section className="space-y-4 md:space-y-5 pt-2">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                      <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4 text-warning" />
                      </div>
                      <h2 className="font-semibold text-base md:text-lg text-foreground">Achievements & Certificates</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:gap-5">
                      <FormField
                        control={form.control}
                        name="certificates"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              Certificates <span className="text-muted-foreground font-normal">(Optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Comma separated: Python Course, Web Dev Bootcamp, AWS Certified..." 
                                className="bg-background border-input resize-none min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="achievements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              Achievements <span className="text-muted-foreground font-normal">(Optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Comma separated: Hackathon Winner, Paper Presentation, Club President..." 
                                className="bg-background border-input resize-none min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-11 md:h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold text-sm md:text-base shadow-md transition-all duration-200" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
                          Analyzing Your Profile...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                          Get AI Career Recommendations
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
