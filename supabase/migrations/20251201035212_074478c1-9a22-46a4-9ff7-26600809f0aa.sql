-- Add personality assessment and preferences to school profiles
ALTER TABLE public.school_profiles
ADD COLUMN IF NOT EXISTS personality_type text,
ADD COLUMN IF NOT EXISTS budget_range text,
ADD COLUMN IF NOT EXISTS distance_preference text;

-- Enhance colleges table with detailed filters
ALTER TABLE public.colleges
ADD COLUMN IF NOT EXISTS budget_min numeric,
ADD COLUMN IF NOT EXISTS budget_max numeric,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS facilities text[],
ADD COLUMN IF NOT EXISTS placement_percentage numeric,
ADD COLUMN IF NOT EXISTS scholarship_available boolean DEFAULT false;

-- Add course roadmap table
CREATE TABLE IF NOT EXISTS public.course_roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_name text NOT NULL,
  stream text NOT NULL,
  milestones jsonb NOT NULL,
  entrance_exams text[],
  resources jsonb,
  career_outcomes text[],
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.course_roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view course roadmaps"
ON public.course_roadmaps
FOR SELECT
USING (true);

-- Add learning paths table for college students
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name text NOT NULL,
  skill_levels jsonb NOT NULL,
  timeline_weeks integer,
  certifications text[],
  tools text[],
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view learning paths"
ON public.learning_paths
FOR SELECT
USING (true);

-- Add internship opportunities table
CREATE TABLE IF NOT EXISTS public.internship_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  required_skills text[] NOT NULL,
  recommended_for text[],
  experience_level text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.internship_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view internship roles"
ON public.internship_roles
FOR SELECT
USING (true);

-- Add career clusters table
CREATE TABLE IF NOT EXISTS public.career_clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_name text NOT NULL,
  personality_types text[] NOT NULL,
  matching_careers text[] NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.career_clusters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view career clusters"
ON public.career_clusters
FOR SELECT
USING (true);