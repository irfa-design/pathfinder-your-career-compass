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
  GraduationCap, Award, Code, Brain, CheckCircle2 
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
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-float animation-delay-300" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Career Profile</h1>
              <p className="text-sm text-muted-foreground">Share your journey to discover your next steps</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCompletion steps={completionSteps} />
            
            {/* Tips Card */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Quick Tips
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Be honest about your skills for accurate recommendations
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Include all relevant certificates - they boost your profile
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Add achievements like hackathons, projects, or leadership roles
                </li>
              </ul>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-8 animate-fade-in">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Info Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-primary" />
                      </div>
                      <h2 className="font-semibold">Basic Information</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" className="bg-background" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="degree"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Degree/Program</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., B.E CSE, B.Com, BBA" className="bg-background" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Year</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">1st Year</SelectItem>
                                <SelectItem value="2">2nd Year</SelectItem>
                                <SelectItem value="3">3rd Year</SelectItem>
                                <SelectItem value="4">4th Year</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cgpa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CGPA (Optional)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="e.g., 8.5" className="bg-background" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Career Goal Section */}
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Target className="w-4 h-4 text-accent" />
                      </div>
                      <h2 className="font-semibold">Career Goal</h2>
                    </div>

                    <FormField
                      control={form.control}
                      name="career_goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your dream career?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select career goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {careers.map((career) => (
                                <SelectItem key={career} value={career}>{career}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <Code className="w-4 h-4 text-success" />
                      </div>
                      <h2 className="font-semibold">Current Skills</h2>
                    </div>

                    <FormField
                      control={form.control}
                      name="current_skills"
                      render={() => (
                        <FormItem>
                          <FormLabel>Select skills you have</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            {skills.map((skill) => (
                              <FormField
                                key={skill}
                                control={form.control}
                                name="current_skills"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2 space-y-0">
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
                                    <FormLabel className="font-normal cursor-pointer text-sm">{skill}</FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Achievements Section */}
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                        <Award className="w-4 h-4 text-warning" />
                      </div>
                      <h2 className="font-semibold">Achievements & Certificates</h2>
                    </div>

                    <FormField
                      control={form.control}
                      name="certificates"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificates (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Comma separated: Python Course, Web Dev Bootcamp, AWS Certified..." 
                              className="bg-background resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="achievements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Achievements (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Comma separated: Hackathon Winner, Paper Presentation, Club President..." 
                              className="bg-background resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-gradient-primary hover:opacity-90" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Your Profile...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-5 w-5" />
                        Get AI Career Recommendations
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
