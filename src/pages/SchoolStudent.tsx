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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, BookOpen, GraduationCap, ChevronLeft, Sparkles,
  Brain, MapPin, Wallet, CheckCircle2, Heart, Target
} from "lucide-react";
import { ProfileCompletion } from "@/components/features/ProfileCompletion";

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Commerce", "Economics", "English", "History", "Art"];
const interests = ["coding", "design", "medicine", "business", "arts", "engineering", "teaching", "research", "sports", "social-work"];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  class_level: z.enum(["10", "11", "12"]),
  board: z.string().optional(),
  favorite_subjects: z.array(z.string()).min(1, "Select at least one subject"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  average_mark: z.coerce.number().min(0).max(100, "Mark must be between 0 and 100"),
  preferred_location: z.string().optional(),
  achievements: z.string().optional(),
  budget_range: z.string().optional(),
  distance_preference: z.string().optional(),
});

export default function SchoolStudent() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      class_level: "12",
      board: "",
      favorite_subjects: [],
      interests: [],
      average_mark: 0,
      preferred_location: "",
      achievements: "",
      budget_range: "",
      distance_preference: "",
    },
  });

  const watchedFields = form.watch();
  const completionSteps = [
    { id: "name", label: "Add your name", completed: !!watchedFields.name },
    { id: "subjects", label: "Select favorite subjects", completed: watchedFields.favorite_subjects?.length > 0 },
    { id: "interests", label: "Choose interests", completed: watchedFields.interests?.length > 0 },
    { id: "mark", label: "Enter average mark", completed: watchedFields.average_mark > 0 },
    { id: "budget", label: "Set budget preference", completed: !!watchedFields.budget_range },
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
        class_level: values.class_level,
        board: values.board || null,
        favorite_subjects: values.favorite_subjects,
        interests: values.interests,
        average_mark: values.average_mark,
        preferred_location: values.preferred_location || null,
        achievements: values.achievements ? values.achievements.split(',').map(a => a.trim()) : [],
        budget_range: values.budget_range || null,
        distance_preference: values.distance_preference || null,
      };

      const { data: profile, error: profileError } = await supabase
        .from('school_profiles')
        .insert([profileData])
        .select()
        .single();

      if (profileError) throw profileError;

      const { data: recommendations, error: recError } = await supabase.functions.invoke('recommend-school', {
        body: { profileData }
      });

      if (recError) throw recError;

      await supabase.from('recommendations').insert({
        profile_id: profile.id,
        profile_type: 'school',
        recommendation_data: recommendations
      });

      toast({ title: "Success!", description: "Your recommendations are ready" });
      navigate('/school-results', { state: { profileId: profile.id } });
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
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl animate-float animation-delay-300" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Student Profile</h1>
              <p className="text-sm text-muted-foreground">Tell us about yourself to get personalized recommendations</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCompletion steps={completionSteps} />
            
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Quick Tips
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Select subjects you genuinely enjoy, not just the ones you're good at
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Your interests help us find career paths you'll love
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Budget and location help filter the best colleges for you
                </li>
              </ul>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-8 animate-fade-in">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-primary" />
                      </div>
                      <h2 className="font-semibold">Basic Information</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input placeholder="Enter your name" className="bg-background" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="class_level" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Select class" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="10">10th Grade</SelectItem>
                              <SelectItem value="11">11th Grade</SelectItem>
                              <SelectItem value="12">12th Grade</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="board" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Board (Optional)</FormLabel>
                          <FormControl><Input placeholder="e.g., CBSE, ICSE" className="bg-background" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="average_mark" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Mark (%)</FormLabel>
                          <FormControl><Input type="number" placeholder="e.g., 85" className="bg-background" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Target className="w-4 h-4 text-accent" />
                      </div>
                      <h2 className="font-semibold">Favorite Subjects</h2>
                    </div>
                    <FormField control={form.control} name="favorite_subjects" render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {subjects.map((subject) => (
                            <FormField key={subject} control={form.control} name="favorite_subjects" render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox checked={field.value?.includes(subject)} onCheckedChange={(checked) => checked ? field.onChange([...field.value, subject]) : field.onChange(field.value?.filter((v) => v !== subject))} className="data-[state=checked]:bg-primary" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-sm">{subject}</FormLabel>
                              </FormItem>
                            )} />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {/* Interests */}
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-success" />
                      </div>
                      <h2 className="font-semibold">Interests</h2>
                    </div>
                    <FormField control={form.control} name="interests" render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {interests.map((interest) => (
                            <FormField key={interest} control={form.control} name="interests" render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox checked={field.value?.includes(interest)} onCheckedChange={(checked) => checked ? field.onChange([...field.value, interest]) : field.onChange(field.value?.filter((v) => v !== interest))} className="data-[state=checked]:bg-success" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-sm capitalize">{interest.replace('-', ' ')}</FormLabel>
                              </FormItem>
                            )} />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {/* Preferences */}
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-warning" />
                      </div>
                      <h2 className="font-semibold">College Preferences</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="budget_range" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Range</FormLabel>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="low" id="low" /><Label htmlFor="low" className="font-normal cursor-pointer text-sm">Under ₹50K/year</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="medium" id="medium" /><Label htmlFor="medium" className="font-normal cursor-pointer text-sm">₹50K - ₹2L/year</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="high" id="high" /><Label htmlFor="high" className="font-normal cursor-pointer text-sm">Above ₹2L/year</Label></div>
                          </RadioGroup>
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="distance_preference" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distance Preference</FormLabel>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="local" id="local" /><Label htmlFor="local" className="font-normal cursor-pointer text-sm">Same city</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="state" id="state" /><Label htmlFor="state" className="font-normal cursor-pointer text-sm">Within state</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="national" id="national" /><Label htmlFor="national" className="font-normal cursor-pointer text-sm">Anywhere in India</Label></div>
                          </RadioGroup>
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="preferred_location" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Location (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., Delhi, Mumbai, Bangalore" className="bg-background" {...field} /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="achievements" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achievements (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="Hackathon wins, sports, NCC, clubs..." className="bg-background resize-none" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-gradient-primary hover:opacity-90" disabled={loading}>
                    {loading ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Analyzing Your Profile...</>
                    ) : (
                      <><Brain className="mr-2 h-5 w-5" />Get AI Recommendations</>
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
