import { EBookStatus } from '@gycoding/nebula';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
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
  {
    labelKey: 'book.rating.status.notFinished',
    // nebula no define EBookStatus.DNF (era undefined y no se guardaba nada):
    // se usa el valor que guarda el backend.
    value: 'NOT_FINISHED' as EBookStatus,
    icon: <DoNotDisturbOnIcon />,
  },
];
