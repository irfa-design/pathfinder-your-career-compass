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
import { Loader2, Briefcase, Target } from "lucide-react";

const skills = ["Programming", "Data Structures", "Web Development", "Python", "JavaScript", "SQL", "Machine Learning", "Design", "Communication", "Excel"];
const careers = ["Software Developer", "Data Scientist", "UI/UX Designer", "Digital Marketer", "Business Analyst"];

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
      navigate('/college-results', { state: { recommendations, profile: profileData } });
    } catch (error: any) {
      console.error('Error:', error);
      toast({ title: "Error", description: error.message || "Failed to generate recommendations", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-3xl mx-auto py-12 px-4">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-accent/10">
              <Briefcase className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Career Profile
          </h1>
          <p className="text-muted-foreground text-lg">Share your journey to discover your next steps</p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
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
                      <Input placeholder="e.g., B.E CSE, B.Com, BBA" {...field} />
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
                        <SelectTrigger>
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
                      <Input type="number" step="0.01" placeholder="e.g., 8.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="career_goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Goal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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

              <FormField
                control={form.control}
                name="current_skills"
                render={() => (
                  <FormItem>
                    <FormLabel>Current Skills</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mt-2">
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
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">{skill}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificates (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Comma separated: Python Course, Web Dev Bootcamp..." {...field} />
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
                      <Textarea placeholder="Comma separated: Hackathon Winner, Paper Presentation..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Your Skills...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4" />
                    Show My Future Skills
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}