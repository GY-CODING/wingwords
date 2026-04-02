import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import FriendCard from '@/app/components/atoms/FriendCard/FriendCard';
import FriendCardSkeleton from '@/app/components/atoms/FriendCard/FriendCardSkeleton';
import { Friend } from '@/domain/friend.model';
import { ESeverity } from '@/utils/constants/ESeverity';
import { lora } from '@/utils/fonts/fonts';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const MotionBox = motion(Box);

interface FriendsTabProps {
  data: Friend[] | undefined;
  isLoading: boolean;
  isLoadingDelete: boolean;
  errorDelete: Error | null;
  isSuccessDelete: boolean;
  handleDeleteFriend: (friendId: string) => Promise<void>;
  setErrorDelete: (error: Error | null) => void;
  setIsSuccessDelete: (success: boolean) => void;
}

export function FriendsTab({
  data,
  isLoading,
  isLoadingDelete,
  errorDelete,
  isSuccessDelete,
  handleDeleteFriend,
  setErrorDelete,
  setIsSuccessDelete,
}: FriendsTabProps) {
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  const filteredFriends = useMemo(() => {
    if (!data) return [];
    return data.filter((friend) =>
      friend.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      <TextField
        placeholder={t('community.friends.search.placeholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        variant="outlined"
        sx={{
          mb: '8px',
          width: ['90%', '70%', '60%'],
          maxWidth: '600px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          fontFamily: lora.style.fontFamily,
          '& .MuiOutlinedInput-root': {
            minHeight: '56px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.15)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(147, 51, 234, 0.5)',
              borderWidth: '1px',
            },
          },
          '& .MuiInputBase-input': {
            color: 'white',
            fontFamily: lora.style.fontFamily,
            fontSize: '18px',
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
          },
          gap: '0.75rem',
          width: '100%',
          maxWidth: '900px',
        }}
      >
        {isLoading || !data ? (
          Array.from({ length: 4 }).map((_, i) => (
            <FriendCardSkeleton key={i} />
          ))
        ) : filteredFriends.length === 0 ? (
          <Box
            sx={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                color: 'white',
                fontSize: '1.5rem',
                mt: 2,
              }}
            >
              {search
                ? t('community.friends.noResults')
                : t('community.friends.empty')}
            </Typography>
          </Box>
        ) : (
          filteredFriends.map((friend: Friend) => (
            <FriendCard
              key={friend.id}
              friend={friend as Friend}
              isDeleteLoading={isLoadingDelete}
              handleDeleteFriend={handleDeleteFriend}
            />
          ))
        )}
      </Box>

      <AnimatedAlert
        open={isSuccessDelete}
        onClose={() => setIsSuccessDelete(false)}
        severity={ESeverity.SUCCESS}
        message={t('community.friends.deleteSuccess')}
      />
      <AnimatedAlert
        open={!!errorDelete}
        onClose={() => setErrorDelete(null)}
        severity={ESeverity.ERROR}
        message={t('community.friends.deleteError')}
      />
    </MotionBox>
  );
}
