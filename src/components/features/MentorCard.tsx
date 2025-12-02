import { MessageCircle, Star, Calendar, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MentorCardProps {
  name: string;
  role: string;
  company: string;
  expertise: string[];
  rating: number;
  sessions: number;
  available?: boolean;
  className?: string;
}

export function MentorCard({ 
  name, 
  role, 
  company, 
  expertise,
  rating,
  sessions,
  available = true,
  className = "" 
}: MentorCardProps) {
  return (
    <div className={`p-6 rounded-2xl bg-card border border-border/50 card-hover ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-14 h-14 ring-2 ring-primary/20">
          <AvatarFallback className="bg-gradient-primary text-white font-bold">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold">{name}</h4>
            {available && (
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            )}
          </div>
          <p className="text-sm text-primary font-medium">{role}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {company}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {expertise.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
      
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span className="font-medium">{rating.toFixed(1)}</span>
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {sessions} sessions
        </span>
      </div>
      
      <Button className="w-full bg-gradient-primary" disabled={!available}>
        <MessageCircle className="w-4 h-4 mr-2" />
        {available ? 'Request Session' : 'Unavailable'}
      </Button>
    </div>
  );
}
