import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

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
    .slice(0, 6);

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
              className="pl-2.5 pr-1.5 py-1 text-xs md:text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors"
            >
              {interest}
              <button
                type="button"
                onClick={() => removeInterest(interest)}
                className="ml-1.5 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                aria-label={`Remove ${interest}`}
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
          placeholder={value.length >= maxItems ? `Maximum ${maxItems} interests reached` : placeholder}
          disabled={value.length >= maxItems}
          className="h-10 md:h-11 pr-10 bg-background border-input"
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-primary/10"
            onClick={() => addInterest(inputValue)}
            aria-label="Add interest"
          >
            <Plus className="h-4 w-4 text-primary" />
          </Button>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addInterest(suggestion)}
                className="w-full px-3 py-2.5 text-left text-sm hover:bg-muted transition-colors text-foreground flex items-center gap-2"
              >
                <Plus className="h-3.5 w-3.5 text-primary shrink-0" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick add suggestions */}
      {value.length < maxItems && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Popular interests:</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions
              .filter(s => !value.includes(s))
              .slice(0, 10)
              .map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addInterest(suggestion)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                >
                  <Plus className="h-3 w-3" />
                  {suggestion}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Counter */}
      <p className="text-xs text-muted-foreground">
        {value.length}/{maxItems} interests selected
      </p>
    </div>
  );
}
