import { Quote, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SuccessStoryProps {
  name: string;
  role: string;
  company: string;
  story: string;
  avatar?: string;
  badge?: string;
  className?: string;
}

export function SuccessStory({ 
  name, 
  role, 
  company, 
  story, 
  avatar,
  badge,
  className = "" 
}: SuccessStoryProps) {
  return (
    <div className={`p-6 rounded-2xl bg-card border border-border/50 card-hover ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-14 h-14 ring-2 ring-primary/20">
          {avatar && <AvatarImage src={avatar} alt={name} />}
          <AvatarFallback className="bg-gradient-primary text-white font-bold">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold">{name}</h4>
            {badge && (
              <Badge className="bg-gradient-primary text-white text-xs">{badge}</Badge>
            )}
          </div>
          <p className="text-sm text-primary font-medium">{role}</p>
          <p className="text-xs text-muted-foreground">{company}</p>
        </div>
      </div>
      <div className="relative">
        <Quote className="absolute -top-2 -left-2 w-6 h-6 text-primary/20" />
        <p className="text-sm text-muted-foreground italic pl-4 leading-relaxed">
          "{story}"
        </p>
      </div>
    </div>
  );
}
