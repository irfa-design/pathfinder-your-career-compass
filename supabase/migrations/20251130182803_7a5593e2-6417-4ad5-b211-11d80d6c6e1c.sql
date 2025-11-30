-- Create school profiles table
CREATE TABLE public.school_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  class_level TEXT NOT NULL CHECK (class_level IN ('10', '11', '12')),
  board TEXT,
  favorite_subjects TEXT[] NOT NULL,
  interests TEXT[] NOT NULL,
  average_mark DECIMAL(5,2) NOT NULL CHECK (average_mark >= 0 AND average_mark <= 100),
  preferred_location TEXT,
  achievements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create college profiles table
CREATE TABLE public.college_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  degree TEXT NOT NULL,
  year TEXT NOT NULL CHECK (year IN ('1', '2', '3', '4')),
  cgpa DECIMAL(3,2) CHECK (cgpa >= 0 AND cgpa <= 10),
  career_goal TEXT NOT NULL,
  current_skills TEXT[] NOT NULL,
  certificates TEXT[],
  achievements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recommendations table
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  profile_type TEXT NOT NULL CHECK (profile_type IN ('school', 'college')),
  recommendation_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses knowledge base
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  stream TEXT NOT NULL,
  related_interests TEXT[],
  related_subjects TEXT[],
  description TEXT
);

-- Create colleges knowledge base
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  courses_offered TEXT[],
  min_mark DECIMAL(5,2),
  fee_type TEXT
);

-- Create careers knowledge base
CREATE TABLE public.careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  required_skills TEXT[] NOT NULL,
  recommended_certifications TEXT[],
  description TEXT
);

-- Enable Row Level Security
ALTER TABLE public.school_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for school_profiles
CREATE POLICY "Users can view their own school profiles"
  ON public.school_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own school profiles"
  ON public.school_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own school profiles"
  ON public.school_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for college_profiles
CREATE POLICY "Users can view their own college profiles"
  ON public.college_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own college profiles"
  ON public.college_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own college profiles"
  ON public.college_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for recommendations
CREATE POLICY "Users can view recommendations for their profiles"
  ON public.recommendations FOR SELECT
  USING (
    profile_type = 'school' AND profile_id IN (SELECT id FROM public.school_profiles WHERE user_id = auth.uid())
    OR
    profile_type = 'college' AND profile_id IN (SELECT id FROM public.college_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "System can create recommendations"
  ON public.recommendations FOR INSERT
  WITH CHECK (true);

-- RLS Policies for knowledge base tables (publicly readable)
CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view colleges"
  ON public.colleges FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view careers"
  ON public.careers FOR SELECT
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_school_profiles_updated_at
  BEFORE UPDATE ON public.school_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_college_profiles_updated_at
  BEFORE UPDATE ON public.college_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample knowledge base data

-- Sample courses
INSERT INTO public.courses (name, stream, related_interests, related_subjects, description) VALUES
('Computer Science Engineering', 'Science', ARRAY['coding', 'technology', 'problem-solving'], ARRAY['Mathematics', 'Computer Science', 'Physics'], 'Learn software development, algorithms, and computer systems'),
('Medicine (MBBS)', 'Science', ARRAY['medicine', 'helping-people', 'biology'], ARRAY['Biology', 'Chemistry', 'Physics'], 'Become a medical doctor and save lives'),
('Business Administration (BBA)', 'Commerce', ARRAY['business', 'management', 'entrepreneurship'], ARRAY['Commerce', 'Economics', 'English'], 'Learn business management and leadership'),
('Data Science', 'Science', ARRAY['data', 'analytics', 'mathematics'], ARRAY['Mathematics', 'Computer Science', 'Statistics'], 'Analyze data and build predictive models'),
('Fine Arts', 'Arts', ARRAY['art', 'creativity', 'design'], ARRAY['Art', 'Design', 'History'], 'Express creativity through visual arts');

-- Sample colleges
INSERT INTO public.colleges (name, location, courses_offered, min_mark, fee_type) VALUES
('IIT Delhi', 'Delhi', ARRAY['Computer Science Engineering', 'Data Science'], 90.0, 'Government'),
('AIIMS Delhi', 'Delhi', ARRAY['Medicine (MBBS)'], 95.0, 'Government'),
('IIM Ahmedabad', 'Ahmedabad', ARRAY['Business Administration (BBA)'], 85.0, 'Government'),
('NIT Trichy', 'Trichy', ARRAY['Computer Science Engineering', 'Data Science'], 85.0, 'Government'),
('Delhi University', 'Delhi', ARRAY['Fine Arts', 'Business Administration (BBA)'], 70.0, 'Government');

-- Sample careers
INSERT INTO public.careers (name, required_skills, recommended_certifications, description) VALUES
('Software Developer', ARRAY['Programming', 'Data Structures', 'Algorithms', 'Git', 'Web Development'], ARRAY['AWS Certified Developer', 'Full Stack Web Development'], 'Build software applications and systems'),
('Data Scientist', ARRAY['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Visualization'], ARRAY['Google Data Analytics', 'IBM Data Science'], 'Analyze data and build ML models'),
('UI/UX Designer', ARRAY['Design Principles', 'Figma', 'Wireframing', 'User Research'], ARRAY['Google UX Design', 'Adobe Certified'], 'Design user interfaces and experiences'),
('Digital Marketer', ARRAY['SEO', 'Content Marketing', 'Social Media', 'Analytics'], ARRAY['Google Digital Marketing', 'HubSpot Certification'], 'Market products and services online'),
('Business Analyst', ARRAY['Excel', 'SQL', 'Data Analysis', 'Communication', 'Problem Solving'], ARRAY['Business Analysis Certification', 'Tableau Desktop'], 'Analyze business processes and data');