import { Play, FileText, Download, ExternalLink, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ResourceCardProps {
  title: string;
  description: string;
  type: "video" | "article" | "ebook" | "course";
  duration?: string;
  rating?: number;
  url?: string;
  free?: boolean;
  className?: string;
}

const typeConfig = {
  video: { icon: Play, color: "text-accent", bg: "bg-accent/10" },
  article: { icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  ebook: { icon: Download, color: "text-secondary", bg: "bg-secondary/10" },
  course: { icon: ExternalLink, color: "text-success", bg: "bg-success/10" }
};

export function ResourceCard({ 
  title, 
  description, 
  type,
  duration,
  rating,
  url,
  free = false,
  className = "" 
}: ResourceCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl bg-card border border-border/50 card-hover ${className}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${config.bg} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold truncate">{title}</h4>
            {free && (
              <Badge className="bg-success/10 text-success border-0 text-xs">Free</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {duration}
              </span>
            )}
            {rating && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-warning text-warning" />
                {rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        {url && (
          <Button variant="ghost" size="icon" className="flex-shrink-0" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
