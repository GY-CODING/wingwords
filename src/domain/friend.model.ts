import { UUID } from 'crypto';

export interface Friend {
  id: UUID;
  username: string;
  biography?: string;
  phoneNumber: string;
  picture: string;
}

export interface User extends Friend {
  id: UUID;
  username: string;
  biography?: string;
  phoneNumber: string;
  picture: string;
  isFriend?: boolean;
}

export interface FriendRequest {
  id: UUID;
  from: string | UUID;
  to: UUID;
  user?: User;
}

// Extended interface that combines FriendRequest with User data
export interface FriendRequestWithUser extends FriendRequest {
  user: User;
}
