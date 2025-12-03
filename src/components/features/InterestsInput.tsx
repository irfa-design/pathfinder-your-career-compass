import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, Sparkles } from "lucide-react";

interface InterestsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  suggestions?: string[];
}

const defaultSuggestions = [
  "Technology", "Science", "Mathematics", "Arts", "Music", "Sports",
  "Writing", "Programming", "Design", "Business", "Medicine", "Law",
  "Psychology", "Engineering", "Finance", "Marketing", "Education",
  "Research", "Gaming", "Photography", "Travel", "Environment",
  "AI/ML", "Data Science", "Robotics", "Biotechnology", "Healthcare",
  "Social Media", "E-commerce", "Startups", "Public Speaking"
];

export function InterestsInput({
  value,
  onChange,
  placeholder = "Type an interest and press Enter",
  maxItems = 10,
  suggestions = defaultSuggestions
}: InterestsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions
    .filter(s => 
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(s)
    )
    .slice(0, 8);

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !value.includes(trimmed) && value.length < maxItems) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeInterest = (interest: string) => {
    onChange(value.filter(i => i !== interest));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeInterest(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Selected interests */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((interest, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="pl-3 pr-2 py-1.5 text-sm animate-scale-in"
            >
              {interest}
              <button
                onClick={() => removeInterest(interest)}
                className="ml-2 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input field */}
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={value.length >= maxItems ? `Maximum ${maxItems} interests` : placeholder}
          disabled={value.length >= maxItems}
          className="pr-10"
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => addInterest(inputValue)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addInterest(suggestion)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick add suggestions */}
      {value.length < maxItems && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Popular interests:</p>
          <div className="flex flex-wrap gap-1">
            {suggestions
              .filter(s => !value.includes(s))
              .slice(0, 12)
              .map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addInterest(suggestion)}
                  className="px-2 py-1 text-xs rounded-full bg-muted hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {value.length}/{maxItems} interests selected
      </p>
    </div>
  );
}
