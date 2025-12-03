import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, Settings, Award, Target, BookOpen, Briefcase, 
  TrendingUp, Calendar, ArrowLeft, Edit2, Save, Trophy,
  Zap, Star, Clock, CheckCircle2
} from "lucide-react";
import { XPBar } from "@/components/features/XPBar";
import { BadgeDisplay, Badge as BadgeType } from "@/components/features/BadgeDisplay";
import { StreakCounter } from "@/components/features/StreakCounter";
import { ProgressRing } from "@/components/features/ProgressRing";
import { toast } from "@/hooks/use-toast";

const userBadges: BadgeType[] = [
  { id: "1", name: "Profile Pioneer", description: "Complete your first profile", icon: "star", color: "primary", earned: true },
  { id: "2", name: "Quick Learner", description: "Complete 5 learning modules", icon: "zap", color: "secondary", earned: true },
  { id: "3", name: "Quiz Master", description: "Score 80%+ in 3 quizzes", icon: "trophy", color: "accent", earned: true },
  { id: "4", name: "Career Explorer", description: "Explore 10 career paths", icon: "target", color: "success", earned: false },
  { id: "5", name: "Skill Champion", description: "Master 10 skills", icon: "award", color: "warning", earned: false },
  { id: "6", name: "Consistency King", description: "30-day login streak", icon: "flame", color: "warning", earned: false },
];

const recentActivity = [
  { action: "Completed Python basics quiz", date: "2 hours ago", xp: 50 },
  { action: "Updated career preferences", date: "Yesterday", xp: 25 },
  { action: "Explored Data Science path", date: "2 days ago", xp: 30 },
  { action: "Completed profile assessment", date: "3 days ago", xp: 100 },
];

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [schoolProfile, setSchoolProfile] = useState<any>(null);
  const [collegeProfile, setCollegeProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setDisplayName(session.user.email?.split("@")[0] || "User");

      // Fetch school profile
      const { data: schoolData } = await supabase
        .from("school_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setSchoolProfile(schoolData);

      // Fetch college profile
      const { data: collegeData } = await supabase
        .from("college_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setCollegeProfile(collegeData);

      // Fetch recommendations
      const { data: recData } = await supabase
        .from("recommendations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecommendations(recData || []);

      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleSaveProfile = () => {
    setEditing(false);
    toast({ title: "Profile Updated", description: "Your changes have been saved." });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const profileCompletion = schoolProfile || collegeProfile ? 75 : 25;
  const activeProfile = collegeProfile || schoolProfile;

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl animate-float animation-delay-300" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Profile Header */}
        <Card className="glass mb-8 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary via-secondary to-accent" />
          <CardContent className="-mt-16 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="w-32 h-32 rounded-2xl bg-background border-4 border-background shadow-xl flex items-center justify-center">
                <User className="w-16 h-16 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {editing ? (
                    <Input 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="max-w-xs"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold">{displayName}</h1>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                  >
                    {editing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-muted-foreground mb-4">{user?.email}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {collegeProfile ? "College Student" : schoolProfile ? "School Student" : "New User"}
                  </Badge>
                  <Badge variant="outline">Level 5</Badge>
                  <Badge className="bg-gradient-primary text-white">Pro Member</Badge>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <ProgressRing progress={profileCompletion} size={80} strokeWidth={6}>
                    <span className="text-lg font-bold">{profileCompletion}%</span>
                  </ProgressRing>
                  <p className="text-xs text-muted-foreground mt-2">Profile</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass text-center p-4">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-bold">750</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </Card>
          <Card className="glass text-center p-4">
            <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </Card>
          <Card className="glass text-center p-4">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-muted-foreground">Quizzes Done</p>
          </Card>
          <Card className="glass text-center p-4">
            <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Badges Earned</p>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* XP Progress */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <XPBar currentXP={750} levelXP={1000} level={5} />
                  <p className="text-sm text-muted-foreground mt-4">250 XP to next level</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quizzes Completed</span>
                      <span className="font-medium">8/15</span>
                    </div>
                    <Progress value={53} />
                    <div className="flex justify-between text-sm">
                      <span>Skills Explored</span>
                      <span className="font-medium">12/20</span>
                    </div>
                    <Progress value={60} />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                        <Badge variant="secondary">+{activity.xp} XP</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Career Profile Summary */}
              {activeProfile && (
                <Card className="glass md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Your Career Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <Label className="text-muted-foreground">Name</Label>
                        <p className="font-medium">{activeProfile.name}</p>
                      </div>
                      {collegeProfile ? (
                        <>
                          <div>
                            <Label className="text-muted-foreground">Degree</Label>
                            <p className="font-medium">{collegeProfile.degree}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Career Goal</Label>
                            <p className="font-medium">{collegeProfile.career_goal}</p>
                          </div>
                        </>
                      ) : schoolProfile && (
                        <>
                          <div>
                            <Label className="text-muted-foreground">Class</Label>
                            <p className="font-medium">{schoolProfile.class_level}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Interests</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {schoolProfile.interests?.slice(0, 3).map((int: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">{int}</Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <Button 
                      className="mt-6" 
                      variant="outline"
                      onClick={() => navigate(collegeProfile ? "/college-student" : "/school-student")}
                    >
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Badges & Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {userBadges.map((badge) => (
                    <div 
                      key={badge.id}
                      className={`text-center p-4 rounded-xl border transition-all ${
                        badge.earned 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'bg-muted/50 border-border opacity-50'
                      }`}
                    >
                      <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                        badge.earned ? 'bg-gradient-primary' : 'bg-muted'
                      }`}>
                        {badge.icon === 'star' && <Star className="w-8 h-8 text-white" />}
                        {badge.icon === 'zap' && <Zap className="w-8 h-8 text-white" />}
                        {badge.icon === 'trophy' && <Trophy className="w-8 h-8 text-white" />}
                        {badge.icon === 'target' && <Target className="w-8 h-8 text-white" />}
                        {badge.icon === 'award' && <Award className="w-8 h-8 text-white" />}
                        {badge.icon === 'flame' && <Zap className="w-8 h-8 text-white" />}
                      </div>
                      <p className="font-medium text-sm">{badge.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Recommendation History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No recommendations yet</p>
                    <Button className="mt-4" onClick={() => navigate("/school-student")}>
                      Get Your First Recommendation
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((rec, i) => (
                      <Card key={i} className="p-4 border-l-4 border-l-primary">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant="secondary" className="mb-2">
                              {rec.profile_type === 'school' ? 'School' : 'College'}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {new Date(rec.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(
                              rec.profile_type === 'school' ? '/school-results' : '/college-results',
                              { state: { profileId: rec.profile_id } }
                            )}
                          >
                            View Results
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
