'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, Loader2, BarChart3, TrendingUp, Database, Lightbulb } from 'lucide-react';
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
      <Card className="flex flex-col h-[550px]">
        <CardHeader className="border-b pb-4 flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Chat with Your Data
            <Badge variant="secondary" className="ml-auto">
              {data.length.toLocaleString()} rows
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                    }`}
                  >
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-muted border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                    {/* Statistics */}
                    {message.statistics && message.statistics.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.statistics.map((stat, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            {stat.label}: {stat.value}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Insights */}
                    {message.insights && message.insights.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                          <Lightbulb className="h-3 w-3" />
                          Insights
                        </div>
                        {message.insights.map((insight, index) => (
                          <div key={index} className="text-xs p-2 bg-blue-50 dark:bg-blue-950/20 rounded border">
                            {insight}
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-2">{formatTimestamp(message.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted border rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Analyzing your data...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Conversation Starters */}
          {showStarters && conversationStarters.length > 0 && (
            <div className="border-t border-b p-4 bg-muted/20 flex-shrink-0">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Try asking:
              </h4>
              <div className="flex flex-wrap gap-2">
                {conversationStarters.map((starter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleStarterClick(starter)}
                    disabled={isLoading}
                    className="text-xs h-8"
                  >
                    {starter}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="border-t p-4 flex-shrink-0">
            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your data: 'What's the average salary?' or 'Show me patterns'"
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !inputValue.trim()} size="icon">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>

            <div className="mt-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                Analyzing {data.length.toLocaleString()} records across {columns.length} columns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
