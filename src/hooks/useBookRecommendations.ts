'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UseBookRecommendationsReturn {
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
  getRecommendations: (
    targetUserId: string,
    currentUserId: string,
    targetUserName: string
  ) => Promise<void>;
  getDiscoverRecommendations: (currentUserId: string) => Promise<void>;
  askQuestion: (
    question: string,
    targetUserId: string,
    currentUserId: string,
    targetUserName: string
  ) => Promise<void>;
  askDiscoverQuestion: (
    question: string,
    currentUserId: string
  ) => Promise<void>;
  clearMessages: () => void;
}

export function useBookRecommendations(): UseBookRecommendationsReturn {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<AIMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const streamResponse = useCallback(
    async (body: Record<string, unknown>, prependUserMessage?: string) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      if (prependUserMessage) {
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: prependUserMessage },
        ]);
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      try {
        const res = await fetch('/api/auth/ai/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'assistant',
              content: accumulated,
            };
            return updated;
          });
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        const message =
          err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
        setMessages((prev) => {
          const updated = [...prev];
          if (
            updated.length > 0 &&
            updated[updated.length - 1].role === 'assistant'
          ) {
            updated[updated.length - 1] = {
              role: 'assistant',
              content: 'Sorry, I could not generate recommendations right now.',
            };
          }
          return updated;
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getRecommendations = useCallback(
    async (
      targetUserId: string,
      currentUserId: string,
      targetUserName: string
    ) => {
      setMessages([]);
      await streamResponse({
        targetUserId,
        currentUserId,
        targetUserName,
        mode: 'recommend',
      });
    },
    [streamResponse]
  );

  const getDiscoverRecommendations = useCallback(
    async (currentUserId: string) => {
      setMessages([]);
      await streamResponse({ currentUserId, mode: 'discover' });
    },
    [streamResponse]
  );

  const askQuestion = useCallback(
    async (
      question: string,
      targetUserId: string,
      currentUserId: string,
      targetUserName: string
    ) => {
      const history = messagesRef.current.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        text: m.content,
      })) as { role: 'user' | 'model'; text: string }[];
      await streamResponse(
        {
          targetUserId,
          currentUserId,
          targetUserName,
          question,
          mode: 'recommend',
          history,
        },
        question
      );
    },
    [streamResponse]
  );

  const askDiscoverQuestion = useCallback(
    async (question: string, currentUserId: string) => {
      const history = messagesRef.current.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        text: m.content,
      })) as { role: 'user' | 'model'; text: string }[];
      await streamResponse(
        { currentUserId, question, mode: 'discover', history },
        question
      );
    },
    [streamResponse]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    getRecommendations,
    getDiscoverRecommendations,
    askQuestion,
    askDiscoverQuestion,
    clearMessages,
  };
}
