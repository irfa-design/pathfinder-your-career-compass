import { MessageSquare, ChevronRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  answered?: boolean;
}

interface InterviewPrepProps {
  questions: Question[];
  className?: string;
}

const difficultyColors = {
  easy: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  hard: "bg-destructive/10 text-destructive"
};

export function InterviewPrep({ questions, className = "" }: InterviewPrepProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className={`space-y-3 ${className}`}>
      {questions.map((q) => (
        <div
          key={q.id}
          className={`p-4 rounded-xl bg-card border border-border/50 transition-all duration-300 ${
            expandedId === q.id ? 'ring-2 ring-primary/50' : ''
          }`}
        >
          <button
            onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
            className="w-full flex items-center gap-3 text-left"
          >
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium line-clamp-1">{q.question}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{q.category}</Badge>
                <Badge className={`text-xs border-0 ${difficultyColors[q.difficulty]}`}>
                  {q.difficulty}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {q.answered && (
                <CheckCircle2 className="w-5 h-5 text-success" />
              )}
              <ChevronRight 
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  expandedId === q.id ? 'rotate-90' : ''
                }`} 
              />
            </div>
          </button>
          
          {expandedId === q.id && (
            <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
              <p className="text-sm text-muted-foreground mb-4">
                Practice answering this question out loud. Focus on structure, examples, and conciseness.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Skip</Button>
                <Button size="sm" className="bg-gradient-primary">
                  Mark as Practiced
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
