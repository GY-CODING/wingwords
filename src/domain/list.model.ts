import { UUID } from 'crypto';

export interface BookListItem {
  id: string;
  order: number;
  title?: string;
  coverUrl?: string;
}

export interface BookList {
  id: UUID;
  name: string;
  description?: string;
  books: BookListItem[];
}

export interface CreateBookListPayload {
  name: string;
  description?: string;
}

export interface UpdateBookListPayload {
  id: UUID;
  name?: string;
  description?: string;
}

export interface ManageListBooksPayload {
  bookId: string;
  order?: number;
}
