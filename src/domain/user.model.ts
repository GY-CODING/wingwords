import { UUID } from 'crypto';
import type HardcoverBook from './HardcoverBook';

export interface User {
  id: UUID;
  username: string;
  picture: string;
  apiKey: string;
  phoneNumber: string | null;
  biography?: string | null;
}

export interface UserUpdateData {
  username: string;
  picture: string;
  phoneNumber: string | null;
}

export interface EditData {
  username: string;
  picture: string;
  phoneNumber: string | null;
}

export type UserProfileBook = HardcoverBook;
