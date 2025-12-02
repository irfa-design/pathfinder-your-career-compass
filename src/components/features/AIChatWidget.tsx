import { Bot, Send, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const quickResponses = [
  "How can I improve my resume?",
  "What skills should I learn?",
  "Tips for interview prep",
  "Career path suggestions"
];

interface AIChatWidgetProps {
  className?: string;
}

export function AIChatWidget({ className = "" }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hi! I'm your AI Career Coach. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now().toString(), text: input, isBot: false }]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "That's a great question! Based on your profile, I'd recommend focusing on strengthening your technical skills and building a portfolio of projects. Would you like specific resources?",
        isBot: true
      }]);
    }, 1000);
  };

  const handleQuickResponse = (text: string) => {
    setInput(text);
    handleSend();
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-primary shadow-lg hover:scale-110 transition-all z-50 ${className}`}
      >
        <Bot className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-80 h-[450px] bg-card rounded-2xl shadow-2xl border border-border/50 flex flex-col z-50 animate-scale-in ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">AI Career Coach</p>
            <p className="text-xs text-success">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.isBot 
                ? 'bg-muted text-foreground rounded-bl-none' 
                : 'bg-gradient-primary text-white rounded-br-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick responses */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {quickResponses.map((text) => (
            <button
              key={text}
              onClick={() => handleQuickResponse(text)}
              className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              {text}
            </button>
          ))}
        </div>
      )}
      
      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-gradient-primary">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
