'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, Loader2, BarChart3, TrendingUp, Database, Lightbulb, X } from 'lucide-react';
import { askAboutData, generateConversationStarters, ConversationResponse } from '@/lib/conversational-ai';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  statistics?: Array<{ label: string; value: string | number }>;
  insights?: string[];
}

interface AIChatProps {
  data: Record<string, any>[];
  columns: string[];
}

export function AIChat({ data, columns }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const conversationStarters = generateConversationStarters(columns);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'ai',
        content: `Hello! I'm your AI data analyst. I can help you understand your data with ${data.length.toLocaleString()} records and ${columns.length} columns. What would you like to know?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [data.length, columns.length, messages.length]);

  const handleSubmit = async (question: string) => {
    if (!question.trim()) return;

    if (showStarters) {
      setShowStarters(false);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askAboutData(question, data, columns);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.answer,
        timestamp: new Date(),
        statistics: response.statistics,
        insights: response.insights,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (!response.success && response.error) {
        toast({
          title: 'AI Response Issue',
          description: 'The AI had trouble analyzing your question, but provided a response.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error asking AI:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content:
          'I apologize, but I encountered an error while analyzing your data. Please try rephrasing your question or try again later.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterClick = (starter: string) => {
    handleSubmit(starter);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(inputValue);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="flex flex-col h-[450px] sm:h-[550px] bg-background/50 backdrop-blur-sm border-border">
        <CardHeader className="border-b border-border pb-3 sm:pb-4 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            Chat with Your Data
            <Badge variant="secondary" className="ml-auto text-xs">
              {data.length.toLocaleString()} rows
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`flex max-w-[85%] sm:max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2 sm:gap-3`}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </div>

                  <div
                    className={`rounded-lg px-3 py-2 sm:px-4 sm:py-2 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-background/80 backdrop-blur-sm border border-border text-foreground'
                    }`}
                  >
                    <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.content}</p>

                    {message.statistics && message.statistics.length > 0 && (
                      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
                        {message.statistics.map((stat, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-border">
                            <BarChart3 className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                            {stat.label}: {stat.value}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {message.insights && message.insights.length > 0 && (
                      <div className="mt-2 sm:mt-3 space-y-1">
                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                          <Lightbulb className="h-2 w-2 sm:h-3 sm:w-3" />
                          Insights
                        </div>
                        {message.insights.map((insight, index) => (
                          <div
                            key={index}
                            className="text-xs p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-border"
                          >
                            {insight}
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-1 sm:mt-2">{formatTimestamp(message.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg px-3 py-2 sm:px-4 sm:py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Analyzing your data...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showStarters && conversationStarters.length > 0 && (
            <div className="border-t border-border p-2 sm:p-4 bg-background/30 backdrop-blur-sm flex-shrink-0 max-h-[120px] sm:max-h-none overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs sm:text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  Try asking:
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStarters(false)}
                  className="h-6 w-6 p-0 sm:hidden hover:bg-background/80"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex sm:grid sm:grid-cols-2 gap-1 sm:gap-2 overflow-x-auto sm:overflow-x-visible">
                <div className="flex gap-1 sm:contents">
                  {conversationStarters.slice(0, 2).map((starter, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleStarterClick(starter)}
                      disabled={isLoading}
                      className="text-xs h-6 sm:h-8 border-border hover:bg-background/80 flex-shrink-0 px-2 sm:px-3 sm:justify-start sm:text-left"
                    >
                      <span className="truncate max-w-[120px] sm:max-w-none">{starter}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="hidden sm:flex sm:grid sm:grid-cols-2 gap-2 mt-2">
                {conversationStarters.slice(2).map((starter, index) => (
                  <Button
                    key={index + 2}
                    variant="outline"
                    size="sm"
                    onClick={() => handleStarterClick(starter)}
                    disabled={isLoading}
                    className="text-xs h-8 border-border hover:bg-background/80 justify-start text-left"
                  >
                    <span className="truncate">{starter}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border p-3 sm:p-4 flex-shrink-0 bg-background/50 backdrop-blur-sm">
            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your data..."
                disabled={isLoading}
                className="flex-1 bg-background border-border text-xs sm:text-sm"
              />
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                variant="secondary"
                className="flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
            </form>

            <div className="mt-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-1">
                <Database className="h-2 w-2 sm:h-3 sm:w-3" />
                Analyzing {data.length.toLocaleString()} records across {columns.length} columns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
