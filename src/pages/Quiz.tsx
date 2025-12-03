import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, ArrowRight, Brain, Code, Palette, Calculator, 
  Users, Microscope, BookOpen, Trophy, CheckCircle2, XCircle,
  Clock, Zap, Target
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
}

interface QuizCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  questions: Question[];
  xpReward: number;
}

const quizCategories: QuizCategory[] = [
  {
    id: "personality",
    name: "Career Personality",
    icon: Brain,
    color: "primary",
    description: "Discover your work style and ideal career environment",
    xpReward: 100,
    questions: [
      {
        id: 1,
        question: "When working on a project, you prefer to:",
        options: ["Work alone with full control", "Collaborate with a small team", "Lead a large group", "Support others' work"],
        correctAnswer: -1,
        category: "Work Style",
        explanation: "Understanding your work style helps match you with suitable career paths."
      },
      {
        id: 2,
        question: "You feel most energized when:",
        options: ["Solving complex problems", "Creating something new", "Helping others succeed", "Organizing and planning"],
        correctAnswer: -1,
        category: "Motivation",
        explanation: "Your energy sources indicate which careers will be most fulfilling."
      },
      {
        id: 3,
        question: "In a team conflict, you typically:",
        options: ["Analyze the facts objectively", "Find creative compromises", "Mediate between parties", "Follow established procedures"],
        correctAnswer: -1,
        category: "Conflict Resolution",
        explanation: "Conflict resolution styles influence your leadership potential."
      },
    ]
  },
  {
    id: "tech",
    name: "Tech Knowledge",
    icon: Code,
    color: "secondary",
    description: "Test your understanding of technology and programming",
    xpReward: 75,
    questions: [
      {
        id: 1,
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
        correctAnswer: 0,
        category: "Web Development",
        explanation: "HTML is the standard markup language for creating web pages."
      },
      {
        id: 2,
        question: "Which data structure uses LIFO (Last In, First Out)?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
        category: "Data Structures",
        explanation: "A Stack follows LIFO - the last element added is the first removed."
      },
      {
        id: 3,
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: 1,
        category: "Algorithms",
        explanation: "Binary search halves the search space each iteration, giving O(log n)."
      },
    ]
  },
  {
    id: "aptitude",
    name: "Aptitude Test",
    icon: Calculator,
    color: "accent",
    description: "Assess your logical reasoning and problem-solving skills",
    xpReward: 80,
    questions: [
      {
        id: 1,
        question: "If 2x + 5 = 15, what is x?",
        options: ["3", "5", "7", "10"],
        correctAnswer: 1,
        category: "Mathematics",
        explanation: "2x = 15 - 5 = 10, so x = 5"
      },
      {
        id: 2,
        question: "Complete the series: 2, 6, 18, 54, ?",
        options: ["108", "162", "216", "128"],
        correctAnswer: 1,
        category: "Pattern Recognition",
        explanation: "Each number is multiplied by 3. 54 × 3 = 162"
      },
      {
        id: 3,
        question: "A train travels 300km in 4 hours. What is its speed?",
        options: ["60 km/h", "75 km/h", "80 km/h", "70 km/h"],
        correctAnswer: 1,
        category: "Speed & Distance",
        explanation: "Speed = Distance/Time = 300/4 = 75 km/h"
      },
    ]
  },
  {
    id: "design",
    name: "Creative & Design",
    icon: Palette,
    color: "warning",
    description: "Explore your creative thinking and design sensibility",
    xpReward: 70,
    questions: [
      {
        id: 1,
        question: "Which color combination creates the highest contrast?",
        options: ["Blue and Green", "Black and White", "Red and Orange", "Yellow and White"],
        correctAnswer: 1,
        category: "Color Theory",
        explanation: "Black and white create the maximum possible contrast."
      },
      {
        id: 2,
        question: "What is the golden ratio approximately equal to?",
        options: ["1.414", "1.618", "2.718", "3.14"],
        correctAnswer: 1,
        category: "Design Principles",
        explanation: "The golden ratio (φ) ≈ 1.618, found throughout nature and art."
      },
      {
        id: 3,
        question: "Which design principle refers to visual weight distribution?",
        options: ["Contrast", "Balance", "Alignment", "Proximity"],
        correctAnswer: 1,
        category: "Layout Design",
        explanation: "Balance refers to how visual weight is distributed in a design."
      },
    ]
  },
];

export default function Quiz() {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState<QuizCategory | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleStartQuiz = (quiz: QuizCategory) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setQuizComplete(false);
    setSelectedAnswer(null);
  };

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast({ title: "Select an answer", description: "Please choose an option before continuing." });
      return;
    }

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setShowResult(true);

    setTimeout(() => {
      if (selectedQuiz && currentQuestion < selectedQuiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  const calculateScore = () => {
    if (!selectedQuiz) return { correct: 0, total: 0, percentage: 0 };
    const correct = answers.filter((ans, i) => 
      selectedQuiz.questions[i].correctAnswer === -1 || ans === selectedQuiz.questions[i].correctAnswer
    ).length;
    return {
      correct,
      total: selectedQuiz.questions.length,
      percentage: Math.round((correct / selectedQuiz.questions.length) * 100)
    };
  };

  if (quizComplete && selectedQuiz) {
    const score = calculateScore();
    const isPersonalityQuiz = selectedQuiz.id === "personality";
    
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
        </div>
        
        <div className="relative max-w-2xl mx-auto px-4 py-12">
          <Card className="glass text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-6">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
              <p className="text-muted-foreground mb-6">{selectedQuiz.name}</p>
              
              {!isPersonalityQuiz && (
                <div className="mb-8">
                  <p className="text-5xl font-bold text-gradient mb-2">{score.percentage}%</p>
                  <p className="text-muted-foreground">
                    {score.correct} out of {score.total} correct
                  </p>
                </div>
              )}
              
              <div className="flex justify-center gap-4 mb-8">
                <Badge className="bg-gradient-primary text-white px-4 py-2">
                  <Zap className="w-4 h-4 mr-1" />
                  +{selectedQuiz.xpReward} XP
                </Badge>
                {score.percentage >= 80 && !isPersonalityQuiz && (
                  <Badge variant="secondary" className="px-4 py-2">
                    <Trophy className="w-4 h-4 mr-1" />
                    Quiz Master
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setSelectedQuiz(null)}>
                  Try Another Quiz
                </Button>
                <Button onClick={() => navigate("/")}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedQuiz) {
    const question = selectedQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;
    const isPersonalityQuiz = selectedQuiz.id === "personality";
    
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
        </div>
        
        <div className="relative max-w-2xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => setSelectedQuiz(null)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
          
          <Card className="glass mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline">{question.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
              
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = question.correctAnswer === index;
                  const showCorrect = showResult && isCorrect && !isPersonalityQuiz;
                  const showWrong = showResult && isSelected && !isCorrect && !isPersonalityQuiz;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        showCorrect 
                          ? 'bg-success/20 border-success' 
                          : showWrong 
                            ? 'bg-destructive/20 border-destructive'
                            : isSelected 
                              ? 'bg-primary/20 border-primary' 
                              : 'bg-card hover:bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showCorrect && <CheckCircle2 className="w-5 h-5 text-success" />}
                        {showWrong && <XCircle className="w-5 h-5 text-destructive" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {showResult && !isPersonalityQuiz && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              )}
              
              <Button 
                className="w-full mt-6" 
                onClick={handleNext}
                disabled={selectedAnswer === null}
              >
                {currentQuestion < selectedQuiz.questions.length - 1 ? (
                  <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
                ) : (
                  <>Complete Quiz <CheckCircle2 className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl animate-float animation-delay-300" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Career Quizzes</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Test your knowledge, discover your strengths, and earn XP rewards!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {quizCategories.map((quiz) => (
            <Card 
              key={quiz.id}
              className="glass card-hover cursor-pointer group"
              onClick={() => handleStartQuiz(quiz)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <quiz.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{quiz.name}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {quiz.questions.length} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      ~{quiz.questions.length * 30}s
                    </span>
                  </div>
                  <Badge className="bg-gradient-primary text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    +{quiz.xpReward} XP
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
