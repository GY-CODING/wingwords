import { EBookStatus } from '@gycoding/nebula';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export interface StatusOption {
  labelKey: string;
  value: EBookStatus;
  icon: JSX.Element;
}

export const statusOptions: StatusOption[] = [
  {
    labelKey: 'book.rating.status.wantToRead',
    value: EBookStatus.WANT_TO_READ,
    icon: <BookmarkIcon />,
  },
  {
    labelKey: 'book.rating.status.reading',
    value: EBookStatus.READING,
    icon: <RemoveRedEyeIcon />,
  },
  {
    labelKey: 'book.rating.status.read',
    value: EBookStatus.READ,
    icon: <CheckCircleIcon />,
  },
];
