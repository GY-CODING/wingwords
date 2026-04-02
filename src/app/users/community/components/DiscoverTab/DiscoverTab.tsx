import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import { User } from '@/domain/friend.model';
import { ESeverity } from '@/utils/constants/ESeverity';
import { lora } from '@/utils/fonts/fonts';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

interface DiscoverTabProps {
  search: string;
  users: User[];
  isAddingFriend: boolean;
  successMessage: boolean;
  errorMessage: boolean;
  onSearchChange: (search: string) => void;
  onAddFriend: (userId: string) => void;
  setSuccessMessage: (success: boolean) => void;
  setErrorMessage: (error: boolean) => void;
}

export function DiscoverTab({
  search,
  users,
  successMessage,
  errorMessage,
  onSearchChange,
  onAddFriend,
  setSuccessMessage,
  setErrorMessage,
}: DiscoverTabProps) {
  const { t } = useTranslation();
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
        placeholder={t('community.discover.search.placeholder')}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
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
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {users.length === 0 && search ? (
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              color: 'white',
              fontSize: '1.5rem',
              mt: 2,
            }}
          >
            {t('community.discover.noResults')}
          </Typography>
        ) : users.length === 0 ? (
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.2rem',
              mt: 2,
              textAlign: 'center',
            }}
          >
            {t('community.discover.empty')}
          </Typography>
        ) : (
          users.map((user) => (
            <MotionBox
              key={user.id}
              component="a"
              href={`/users/${user.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '0.875rem 1rem',
                width: '100%',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              {user.picture ? (
                <Image
                  src={user.picture}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                  alt={user.username}
                  width={48}
                  height={48}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    background:
                      'linear-gradient(135deg, rgba(147,51,234,0.25) 0%, rgba(129,140,248,0.2) 100%)',
                    border: '1.5px solid rgba(147,51,234,0.25)',
                    color: '#c084fc',
                    fontFamily: lora.style.fontFamily,
                    fontWeight: 700,
                    fontSize: '1.2rem',
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <Typography
                sx={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 700,
                  color: 'white',
                  fontFamily: lora.style.fontFamily,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.username}
              </Typography>
              {user.isFriend ? (
                <Box
                  sx={{
                    flexShrink: 0,
                    backgroundColor: 'rgba(147, 51, 234, 0.1)',
                    color: '#a855f7',
                    border: '1px solid rgba(147, 51, 234, 0.2)',
                    borderRadius: '12px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontFamily: lora.style.fontFamily,
                    fontWeight: 700,
                  }}
                >
                  {t('community.discover.friendBadge')}
                </Box>
              ) : (
                <MotionIconButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    onAddFriend(user.id);
                  }}
                  sx={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(147, 51, 234, 0.1)',
                    color: '#a855f7',
                    border: '1px solid rgba(147, 51, 234, 0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(147, 51, 234, 0.2)',
                      border: '1px solid rgba(147, 51, 234, 0.4)',
                    },
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: 20 }} />
                </MotionIconButton>
              )}
            </MotionBox>
          ))
        )}
      </Box>

      <AnimatedAlert
        open={successMessage}
        message={t('community.discover.requestSent')}
        onClose={() => setSuccessMessage(false)}
        severity={ESeverity.SUCCESS}
      />
      <AnimatedAlert
        open={errorMessage}
        message={t('community.discover.requestError')}
        onClose={() => setErrorMessage(false)}
        severity={ESeverity.ERROR}
      />
    </MotionBox>
  );
}
