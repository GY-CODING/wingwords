'use client';

import { useState, useCallback, useRef } from 'react';

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
    targetUserName: string,
    language?: string
  ) => Promise<void>;
  getDiscoverRecommendations: (
    currentUserId: string,
    language?: string
  ) => Promise<void>;
  askQuestion: (
    question: string,
    targetUserId: string,
    currentUserId: string,
    targetUserName: string,
    language?: string
  ) => Promise<void>;
  askDiscoverQuestion: (
    question: string,
    currentUserId: string,
    language?: string
  ) => Promise<void>;
  retry: () => Promise<void>;
  clearMessages: () => void;
}

// Module-level cache: avoid hitting the API again when reopening the panel
const CACHE_TTL_MS = 5 * 60 * 1000;
const messageCache = new Map<string, { messages: AIMessage[]; ts: number }>();

function getCached(key: string): AIMessage[] | null {
  const entry = messageCache.get(key);
  if (!entry || Date.now() - entry.ts > CACHE_TTL_MS) {
    messageCache.delete(key);
    return null;
  }
  return entry.messages;
}

function setCached(key: string, messages: AIMessage[]): void {
  messageCache.set(key, { messages, ts: Date.now() });
}

// Max conversation turns kept in history sent to the API
const MAX_HISTORY = 8;

export function useBookRecommendations(): UseBookRecommendationsReturn {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Keeps the latest messages synchronously (avoids useEffect render lag)
  const messagesRef = useRef<AIMessage[]>([]);
  // Stored so `retry` can replay the last initial request
  const lastInitialBodyRef = useRef<Record<string, unknown> | null>(null);

  // Synchronously update both state and ref to keep them in sync
  const setMessagesSync = useCallback(
    (updater: AIMessage[] | ((prev: AIMessage[]) => AIMessage[])) => {
      setMessages((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        messagesRef.current = next;
        return next;
      });
    },
    []
  );

  const streamResponse = useCallback(
    async (body: Record<string, unknown>, prependUserMessage?: string) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      if (prependUserMessage) {
        setMessagesSync((prev) => [
          ...prev,
          { role: 'user', content: prependUserMessage },
        ]);
      }
      setMessagesSync((prev) => [...prev, { role: 'assistant', content: '' }]);

      let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
      try {
        const res = await fetch('/api/auth/ai/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // [ERROR] sentinel sent by server when Gemini stream fails mid-way
          if (chunk.includes('[ERROR]')) {
            throw new Error('AI service error — please try again');
          }
          accumulated += chunk;
          setMessagesSync((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'assistant',
              content: accumulated,
            };
            return updated;
          });
        }

        // If we got zero content, treat as an error rather than silent empty bubble
        if (!accumulated.trim()) {
          throw new Error('Empty response — please try again');
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        const message =
          err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
        setMessagesSync((prev) => {
          const updated = [...prev];
          if (
            updated.length > 0 &&
            updated[updated.length - 1].role === 'assistant' &&
            !updated[updated.length - 1].content
          ) {
            // Remove the empty assistant placeholder
            return updated.slice(0, -1);
          }
          return updated;
        });
      } finally {
        try {
          reader?.cancel();
        } catch {
          /* ignore */
        }
        setIsLoading(false);
      }
    },
    [setMessagesSync]
  );

  const getRecommendations = useCallback(
    async (
      targetUserId: string,
      currentUserId: string,
      targetUserName: string,
      language?: string
    ) => {
      const cacheKey = `recommend:${currentUserId}:${targetUserId}:${language ?? 'en'}`;
      const cached = getCached(cacheKey);
      if (cached) {
        setMessagesSync(cached);
        return;
      }

      const body: Record<string, unknown> = {
        targetUserId,
        currentUserId,
        targetUserName,
        mode: 'recommend',
        language,
      };
      lastInitialBodyRef.current = body;
      setMessagesSync([]);
      await streamResponse(body);

      if (messagesRef.current.length > 0) {
        setCached(cacheKey, messagesRef.current);
      }
    },
    [streamResponse, setMessagesSync]
  );

  const getDiscoverRecommendations = useCallback(
    async (currentUserId: string, language?: string) => {
      const cacheKey = `discover:${currentUserId}:${language ?? 'en'}`;
      const cached = getCached(cacheKey);
      if (cached) {
        setMessagesSync(cached);
        return;
      }

      const body: Record<string, unknown> = {
        currentUserId,
        mode: 'discover',
        language,
      };
      lastInitialBodyRef.current = body;
      setMessagesSync([]);
      await streamResponse(body);

      if (messagesRef.current.length > 0) {
        setCached(cacheKey, messagesRef.current);
      }
    },
    [streamResponse, setMessagesSync]
  );

  const askQuestion = useCallback(
    async (
      question: string,
      targetUserId: string,
      currentUserId: string,
      targetUserName: string,
      language?: string
    ) => {
      const history = messagesRef.current.slice(-MAX_HISTORY).map((m) => ({
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
          language,
        },
        question
      );
    },
    [streamResponse]
  );

  const askDiscoverQuestion = useCallback(
    async (question: string, currentUserId: string, language?: string) => {
      const history = messagesRef.current.slice(-MAX_HISTORY).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        text: m.content,
      })) as { role: 'user' | 'model'; text: string }[];
      await streamResponse(
        { currentUserId, question, mode: 'discover', history, language },
        question
      );
    },
    [streamResponse]
  );

  const retry = useCallback(async () => {
    if (!lastInitialBodyRef.current) return;
    setMessagesSync([]);
    setError(null);
    await streamResponse(lastInitialBodyRef.current);
    if (messagesRef.current.length > 0) {
      const body = lastInitialBodyRef.current;
      const mode = body.mode as string;
      const key =
        mode === 'discover'
          ? `discover:${body.currentUserId}`
          : `recommend:${body.currentUserId}:${body.targetUserId}`;
      setCached(key, messagesRef.current);
    }
  }, [streamResponse, setMessagesSync]);

  const clearMessages = useCallback(() => {
    setMessagesSync([]);
    setError(null);
  }, [setMessagesSync]);

  return {
    messages,
    isLoading,
    error,
    getRecommendations,
    getDiscoverRecommendations,
    askQuestion,
    askDiscoverQuestion,
    retry,
    clearMessages,
  };
}
