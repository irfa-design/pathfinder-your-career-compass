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
  Brain, Wallet, CheckCircle2, Heart, Target, User, MapPin
} from "lucide-react";
import { ProfileCompletion } from "@/components/features/ProfileCompletion";
import { InterestsInput } from "@/components/features/InterestsInput";

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Commerce", "Economics", "English", "History", "Art"];

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
      {/* Subtle animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 md:w-80 md:h-80 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-32 w-56 h-56 md:w-72 md:h-72 rounded-full bg-secondary/5 blur-3xl animate-float animation-delay-300" />
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
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md shrink-0">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-foreground truncate">
                Student Profile
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                Tell us about yourself to get personalized recommendations
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
                    "Select subjects you genuinely enjoy, not just the ones you're good at",
                    "Your interests help us find career paths you'll love",
                    "Budget and location help filter the best colleges for you"
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
                      <FormField control={form.control} name="name" render={({ field }) => (
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
                      )} />

                      <FormField control={form.control} name="class_level" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Class</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10 md:h-11 bg-background border-input">
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="10">10th Grade</SelectItem>
                              <SelectItem value="11">11th Grade</SelectItem>
                              <SelectItem value="12">12th Grade</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="board" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Board <span className="text-muted-foreground font-normal">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., CBSE, ICSE" 
                              className="h-10 md:h-11 bg-background border-input" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="average_mark" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Average Mark (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 85" 
                              className="h-10 md:h-11 bg-background border-input" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )} />
                    </div>
                  </section>

                  {/* Section: Subjects */}
                  <section className="space-y-4 md:space-y-5 pt-2">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Target className="w-4 h-4 text-accent" />
                      </div>
                      <h2 className="font-semibold text-base md:text-lg text-foreground">Favorite Subjects</h2>
                    </div>
                    
                    <FormField control={form.control} name="favorite_subjects" render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {subjects.map((subject) => (
                            <FormField key={subject} control={form.control} name="favorite_subjects" render={({ field }) => (
                              <FormItem className="flex items-center gap-2.5 space-y-0 p-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors cursor-pointer">
                                <FormControl>
                                  <Checkbox 
                                    checked={field.value?.includes(subject)} 
                                    onCheckedChange={(checked) => 
                                      checked 
                                        ? field.onChange([...field.value, subject]) 
                                        : field.onChange(field.value?.filter((v) => v !== subject))
                                    } 
                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-sm text-foreground leading-none">
                                  {subject}
                                </FormLabel>
                              </FormItem>
                            )} />
                          ))}
                        </div>
                        <FormMessage className="text-xs mt-2" />
                      </FormItem>
                    )} />
                  </section>

                  {/* Section: Interests */}
                  <section className="space-y-4 md:space-y-5 pt-2">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                        <Heart className="w-4 h-4 text-success" />
                      </div>
                      <h2 className="font-semibold text-base md:text-lg text-foreground">Your Interests</h2>
                    </div>
                    
                    <FormField control={form.control} name="interests" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Type or select your interests
                        </FormLabel>
                        <FormControl>
                          <InterestsInput
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Type an interest and press Enter..."
                            maxItems={10}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )} />
                  </section>

                  {/* Section: Preferences */}
                  <section className="space-y-4 md:space-y-5 pt-2">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                      <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                        <Wallet className="w-4 h-4 text-warning" />
                      </div>
                      <h2 className="font-semibold text-base md:text-lg text-foreground">College Preferences</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                      <FormField control={form.control} name="budget_range" render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium text-foreground">Budget Range</FormLabel>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value} 
                            className="space-y-2"
                          >
                            {[
                              { value: "low", label: "Under ₹50K/year" },
                              { value: "medium", label: "₹50K - ₹2L/year" },
                              { value: "high", label: "Above ₹2L/year" }
                            ].map((option) => (
                              <div 
                                key={option.value} 
                                className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors"
                              >
                                <RadioGroupItem value={option.value} id={option.value} />
                                <Label 
                                  htmlFor={option.value} 
                                  className="font-normal cursor-pointer text-sm text-foreground flex-1"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="distance_preference" render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium text-foreground">Distance Preference</FormLabel>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value} 
                            className="space-y-2"
                          >
                            {[
                              { value: "local", label: "Same city" },
                              { value: "state", label: "Within state" },
                              { value: "national", label: "Anywhere in India" }
                            ].map((option) => (
                              <div 
                                key={option.value} 
                                className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors"
                              >
                                <RadioGroupItem value={option.value} id={`distance-${option.value}`} />
                                <Label 
                                  htmlFor={`distance-${option.value}`} 
                                  className="font-normal cursor-pointer text-sm text-foreground flex-1"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:gap-5">
                      <FormField control={form.control} name="preferred_location" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              Preferred Location <span className="text-muted-foreground font-normal">(Optional)</span>
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Delhi, Mumbai, Bangalore" 
                              className="h-10 md:h-11 bg-background border-input" 
                              {...field} 
                            />
                          </FormControl>
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="achievements" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Achievements <span className="text-muted-foreground font-normal">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Hackathon wins, sports achievements, NCC, clubs, etc. (comma-separated)" 
                              className="bg-background border-input resize-none min-h-[80px]" 
                              {...field} 
                            />
                          </FormControl>
                        </FormItem>
                      )} />
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
                          Get AI Recommendations
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
