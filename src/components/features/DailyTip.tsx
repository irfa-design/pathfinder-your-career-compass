import { Lightbulb, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const tips = [
  "Practice coding for at least 30 minutes daily to build muscle memory.",
  "Network on LinkedIn - connect with professionals in your dream field.",
  "Start a side project to showcase your skills to recruiters.",
  "Read industry blogs to stay updated with latest trends.",
  "Take online courses during weekends to upskill faster.",
  "Attend virtual meetups and webinars in your field.",
  "Build a portfolio website to showcase your best work.",
  "Learn Git and GitHub - essential for any tech career.",
  "Practice mock interviews with friends or online platforms.",
  "Write technical blogs to establish your expertise.",
];

interface DailyTipProps {
  className?: string;
}

export function DailyTip({ className = "" }: DailyTipProps) {
  const [tipIndex, setTipIndex] = useState(() => {
    const today = new Date().getDate();
    return today % tips.length;
  });

  const refreshTip = () => {
    setTipIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-gradient-primary flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-primary mb-1">Tip of the Day</h4>
            <p className="text-sm text-foreground leading-relaxed">{tips[tipIndex]}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshTip}
          className="flex-shrink-0 hover:bg-primary/10"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
