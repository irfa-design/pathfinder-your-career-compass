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
import { Loader2, BookOpen, GraduationCap } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-3xl mx-auto py-12 px-4">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Student Profile
          </h1>
          <p className="text-muted-foreground text-lg">Tell us about yourself to get personalized recommendations</p>
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
                name="class_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="10">10th Grade</SelectItem>
                        <SelectItem value="11">11th Grade</SelectItem>
                        <SelectItem value="12">12th Grade</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="board"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CBSE, ICSE, State Board" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="favorite_subjects"
                render={() => (
                  <FormItem>
                    <FormLabel>Favorite Subjects</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {subjects.map((subject) => (
                        <FormField
                          key={subject}
                          control={form.control}
                          name="favorite_subjects"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(subject)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, subject])
                                      : field.onChange(field.value?.filter((value) => value !== subject))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">{subject}</FormLabel>
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
                name="interests"
                render={() => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {interests.map((interest) => (
                        <FormField
                          key={interest}
                          control={form.control}
                          name="interests"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(interest)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, interest])
                                      : field.onChange(field.value?.filter((value) => value !== interest))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer capitalize">{interest.replace('-', ' ')}</FormLabel>
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
                name="average_mark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Mark (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 85" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Delhi, Mumbai" {...field} />
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
                      <Textarea placeholder="Comma separated: Hackathon, Sports, NCC..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget_range"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>College Budget Range</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="low" />
                          <Label htmlFor="low" className="font-normal cursor-pointer">Low (Under ₹50,000/year)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium" className="font-normal cursor-pointer">Medium (₹50,000 - ₹2,00,000/year)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="high" />
                          <Label htmlFor="high" className="font-normal cursor-pointer">High (Above ₹2,00,000/year)</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="distance_preference"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Travel Distance Preference</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="local" id="local" />
                          <Label htmlFor="local" className="font-normal cursor-pointer">Local (Same city)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="state" id="state" />
                          <Label htmlFor="state" className="font-normal cursor-pointer">Within state</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="national" id="national" />
                          <Label htmlFor="national" className="font-normal cursor-pointer">Anywhere in India</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Get My Path
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