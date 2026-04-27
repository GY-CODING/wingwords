import Image from 'next/image';
import { useMediaQuery, useTheme } from '@mui/material';
import { ProfileUser } from '@/app/profile/utils/profileTypes';
import React from 'react';

export const UserImage = ({
  user,
  compact = false,
}: {
  user: ProfileUser;
  compact?: boolean;
}) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  let size = 100;
  if (isSm) size = 120;
  if (isMd) size = 160;
  if (compact) size = 100;

  return (
    <Image
      src={user?.picture || ''}
      alt={user?.username || ''}
      width={size}
      height={size}
      style={{
        borderRadius: '50%',
        border: compact ? 'none' : '3px solid #9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        marginLeft: compact ? '0' : isMd ? '16px' : '0',
        marginBottom: compact ? '0' : isMd ? '0' : '36px',
        alignSelf: compact ? 'center' : isMd ? 'flex-start' : 'center',
        aspectRatio: '1/1',
        objectFit: 'cover',
        width: compact ? '100%' : undefined,
        height: compact ? '100%' : undefined,
      }}
    />
  );
};
