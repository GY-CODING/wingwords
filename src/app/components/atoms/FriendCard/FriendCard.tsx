import { Friend } from '@/domain/friend.model';
import { lora } from '@/utils/fonts/fonts';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import { useTranslation } from '@/hooks/useTranslation';
import { Box, IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion(Box) as any;
const MotionIconButton = motion(IconButton);

interface FriendCardProps {
  friend: Friend;
  isDeleteLoading: boolean;
  handleDeleteFriend: (userId: string) => Promise<void>;
}

export default function FriendCard({
  friend,
  isDeleteLoading,
  handleDeleteFriend,
}: FriendCardProps) {
  const { t } = useTranslation();
  return (
    <MotionBox
      component="a"
      href={`/users/${friend.id}`}
      key={friend.id}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '18px',
        padding: '0.9rem 1rem',
        width: '100%',
        textDecoration: 'none',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'background-color 0.2s, border-color 0.2s',
        '&:hover': {
          borderColor: 'rgba(147, 51, 234, 0.25)',
          background: 'rgba(255, 255, 255, 0.05)',
        },
        '&:hover .ww-chevron': {
          color: '#c084fc',
          transform: 'translateX(2px)',
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={friend.picture}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
          alt={friend.username}
          width={48}
          height={48}
        />
      </Box>
      <Typography
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: { xs: '1rem', sm: '1.05rem' },
          fontWeight: 600,
          color: 'white',
          fontFamily: lora.style.fontFamily,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {friend.username}
      </Typography>
      <ChevronRightIcon
        className="ww-chevron"
        aria-hidden
        sx={{
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: 22,
          transition: 'transform 0.2s, color 0.2s',
        }}
      />
      <MotionIconButton
        whileTap={{ scale: 0.92 }}
        loading={isDeleteLoading}
        aria-label={t('profile.tooltip.removeFriend')}
        sx={{
          flexShrink: 0,
          // Círculo rojo suave con "quitar amigo", como en la app
          width: 40,
          height: 40,
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.22)',
          borderRadius: '50%',
          color: '#f87171',
          transition: 'background-color 0.2s, border-color 0.2s',
          '&:hover': {
            background: 'rgba(239, 68, 68, 0.2)',
            borderColor: 'rgba(239, 68, 68, 0.45)',
          },
        }}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          event.preventDefault();
          handleDeleteFriend(friend.id);
        }}
      >
        <PersonRemoveOutlinedIcon sx={{ fontSize: 20 }} />
      </MotionIconButton>
    </MotionBox>
  );
}
