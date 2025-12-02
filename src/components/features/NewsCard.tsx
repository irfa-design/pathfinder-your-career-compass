import { Newspaper, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  title: string;
  source: string;
  time: string;
  category: string;
  url?: string;
  className?: string;
}

export function NewsCard({ title, source, time, category, url, className = "" }: NewsCardProps) {
  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-4 rounded-xl bg-card border border-border/50 card-hover group ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
          <Newspaper className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h4>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>{source}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {time}
            </span>
            <Badge variant="outline" className="text-xs">{category}</Badge>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    </a>
  );
}
