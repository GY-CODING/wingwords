import { GoogleGenAI } from '@google/genai';

const GEMINI_MODEL = 'gemini-2.5-flash';

let geminiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
    geminiInstance = new GoogleGenAI({ apiKey });
  }
  return geminiInstance;
}

export interface BookContext {
  id: string;
  title: string;
  author: string;
  rating?: number;
  status?: string;
}

export interface HistoryMessage {
  role: 'user' | 'model';
  text: string;
}

export interface RecommendationRequest {
  targetUserName: string;
  targetUserBooks: BookContext[];
  currentUserBooks: BookContext[];
  userQuestion?: string;
  history?: HistoryMessage[];
}

export interface DiscoverRequest {
  currentUserBooks: BookContext[];
  userQuestion?: string;
  history?: HistoryMessage[];
}

const SYSTEM_PROMPT = `You are an expert literary advisor on GyCoding Books, a social reading platform.
Your role is very specific: given two readers' libraries, you must recommend books FROM THE OTHER USER'S LIBRARY that the current user would enjoy, based on shared tastes, genres, authors, and themes revealed by what the current user has already read and rated.

Rules:
- ONLY recommend books that appear in the other user's library. Never suggest books outside of it.
- Analyse the current user's library to infer their preferences: favourite genres, authors, themes, writing styles, and the ratings they give.
- Cross-reference those preferences against the other user's books, prioritising titles the other user rated highly.
- Explain WHY each recommendation suits the current user, referencing specific books they have read.
- Always respond in the same language the user writes in.
- Use **bold** for book titles and author names.
- Be concise, warm, and enthusiastic — like a knowledgeable friend who loves books.`;

function formatBookList(books: BookContext[]): string {
  if (books.length === 0) return '(no books recorded)';
  return books
    .map(
      (b) =>
        `- **"${b.title}"** by ${b.author}` +
        (b.rating ? ` — rated ${b.rating}/5 by this user` : '') +
        (b.status ? ` [${b.status}]` : '')
    )
    .join('\n');
}

function buildUserPrompt(request: RecommendationRequest): string {
  const { targetUserName, targetUserBooks, currentUserBooks, userQuestion } =
    request;

  const libraryContext = `
=== ${targetUserName}'s library (source of recommendations) ===
${formatBookList(targetUserBooks)}

=== My library (use this to understand my reading taste) ===
${formatBookList(currentUserBooks)}`;

  if (userQuestion) {
    return `${userQuestion}

Use the following library data to answer. Only recommend books from ${targetUserName}'s library.
${libraryContext}`;
  }

  return `I am visiting ${targetUserName}'s profile on GyCoding Books. I want you to act as my personal literary advisor.

Analyse my reading history and tastes, then recommend 3 to 5 books from ${targetUserName}'s library that I would genuinely love. For each recommendation, briefly explain why it fits my taste by referencing books I have already read.
${libraryContext}`;
}

const DISCOVER_SYSTEM_PROMPT = `You are an expert literary advisor on GyCoding Books, a social reading platform.
Your role is to analyse a reader's personal library and recommend NEW books or sagas they have NOT yet read, based on their demonstrated tastes.

Rules:
- NEVER recommend books that already appear in the user's library.
- Infer the user's taste from their read books and ratings: favourite genres, authors, themes, writing styles, pacing, and tone.
- Recommend 4 to 6 specific titles or sagas that match their taste, covering a mix of popular and hidden gems.
- For each recommendation explain WHY it suits this reader, referencing specific books they have already enjoyed.
- Include the author name and, if applicable, the series name.
- Always respond in the same language the user writes in.
- Use **bold** for book titles, author names, and series names.
- Be concise, warm, and enthusiastic — like a knowledgeable bookseller who knows you well.`;

function buildDiscoverPrompt(request: DiscoverRequest): string {
  const { currentUserBooks, userQuestion } = request;

  const libraryContext = `
=== My library ===
${formatBookList(currentUserBooks)}`;

  if (userQuestion) {
    return `${userQuestion}

Use my library below to answer. Do NOT recommend books I already have.
${libraryContext}`;
  }

  return `Based on my reading history, recommend books or sagas I would love but haven't read yet. Analyse my tastes — genres, authors, themes — and suggest titles I'm very likely to enjoy.
${libraryContext}`;
}

type GeminiContent = { role: string; parts: { text: string }[] };

function buildContents(
  basePrompt: string,
  history: HistoryMessage[] | undefined,
  currentQuestion: string | undefined
): GeminiContent[] {
  const contents: GeminiContent[] = [
    { role: 'user', parts: [{ text: basePrompt }] },
  ];
  if (history?.length) {
    for (const msg of history) {
      contents.push({ role: msg.role, parts: [{ text: msg.text }] });
    }
  }
  if (currentQuestion) {
    contents.push({ role: 'user', parts: [{ text: currentQuestion }] });
  }
  return contents;
}

export async function* streamDiscoverRecommendations(
  request: DiscoverRequest
): AsyncGenerator<string> {
  const ai = getGeminiClient();

  const hasHistory = (request.history?.length ?? 0) > 0;
  const contents = hasHistory
    ? buildContents(
        buildDiscoverPrompt({ ...request, userQuestion: undefined }),
        request.history,
        request.userQuestion
      )
    : [{ role: 'user', parts: [{ text: buildDiscoverPrompt(request) }] }];

  const stream = await ai.models.generateContentStream({
    model: GEMINI_MODEL,
    contents,
    config: {
      systemInstruction: DISCOVER_SYSTEM_PROMPT,
      temperature: 0.85,
      maxOutputTokens: 4096,
    },
  });

  for await (const chunk of stream) {
    if (chunk.text) yield chunk.text;
  }
}

export async function* streamBookRecommendations(
  request: RecommendationRequest
): AsyncGenerator<string> {
  const ai = getGeminiClient();

  const hasHistory = (request.history?.length ?? 0) > 0;
  const contents = hasHistory
    ? buildContents(
        buildUserPrompt({ ...request, userQuestion: undefined }),
        request.history,
        request.userQuestion
      )
    : [{ role: 'user', parts: [{ text: buildUserPrompt(request) }] }];

  const stream = await ai.models.generateContentStream({
    model: GEMINI_MODEL,
    contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.8,
      maxOutputTokens: 4096,
    },
  });

  for await (const chunk of stream) {
    if (chunk.text) yield chunk.text;
  }
}
