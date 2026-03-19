import { UserImage } from '@/app/components/atoms/UserAvatar/UserImage';
import { UserProfileBook } from '@/domain/user.model';
import { ProfileUser } from '../../utils/profileTypes';
import { lora } from '@/utils/fonts/fonts';
import CheckIcon from '@mui/icons-material/Check';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import {
  Box,
  Chip,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { BiographySection } from '../BiographySection/BiographySection';
import { BooksStatsDisplay } from './BooksStatsDisplay';

interface ProfileHeaderProps {
  user: ProfileUser;
  friendsCount: number;
  isLoadingFriends: boolean;
  onEditProfile: () => void;
  biography: string;
  isEditingBiography: boolean;
  isLoadingBiography: boolean;
  onBiographyChange: (bio: string) => void;
  onBiographySave: () => void;
  onBiographyCancel: () => void;
  canEdit?: boolean;
  books?: UserProfileBook[];
  isLoadingBooks?: boolean;
  isFriend?: boolean;
  isAddingFriend?: boolean;
  isRemovingFriend?: boolean;
  onAddFriend?: () => void;
  onRemoveFriend?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  friendsCount,
  isLoadingFriends,
  onEditProfile,
  biography,
  isEditingBiography,
  isLoadingBiography,
  onBiographyChange,
  onBiographySave,
  onBiographyCancel,
  canEdit = true,
  books = [],
  isLoadingBooks = false,
  isFriend,
  isAddingFriend = false,
  isRemovingFriend = false,
  onAddFriend,
  onRemoveFriend,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleShareProfile = () => {
    const url = `https://wingwords.gycoding.com/users/${user.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <>
      {/* Versión Mini (Colapsada) */}
      {!isExpanded && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 1.5,
            px: 2,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)',
            },
          }}
          onClick={() => setIsExpanded(true)}
        >
          {/* Avatar pequeño 50px */}
          <Box
            sx={{
              width: 50,
              height: 50,
              flexShrink: 0,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
            }}
          >
            <UserImage user={user} compact />
          </Box>

          {/* Username + Friends inline */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontSize: 20,
                fontWeight: 700,
                fontFamily: lora.style.fontFamily,
              }}
            >
              {user.username}
            </Typography>

            {/* Friends Chip con skeleton */}
            {canEdit &&
              (isLoadingFriends ? (
                <Skeleton
                  variant="rounded"
                  width={120}
                  height={32}
                  sx={{
                    bgcolor: 'rgba(147, 51, 234, 0.15)',
                    borderRadius: '16px',
                  }}
                />
              ) : (
                <Chip
                  icon={<PeopleIcon />}
                  label={`${friendsCount} friends`}
                  size="small"
                  sx={{
                    background: 'rgba(147, 51, 234, 0.12)',
                    color: '#e9d5ff',
                    border: '1px solid rgba(147, 51, 234, 0.4)',
                    fontFamily: lora.style.fontFamily,
                    '& .MuiChip-icon': { color: '#a855f7' },
                  }}
                />
              ))}

            {/* Stats inline compactos con skeleton */}
            {isLoadingBooks ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton
                  variant="rounded"
                  width={80}
                  height={28}
                  sx={{
                    bgcolor: 'rgba(147, 51, 234, 0.15)',
                    borderRadius: '12px',
                  }}
                />
                <Skeleton
                  variant="rounded"
                  width={80}
                  height={28}
                  sx={{
                    bgcolor: 'rgba(147, 51, 234, 0.15)',
                    borderRadius: '12px',
                  }}
                />
              </Box>
            ) : (
              <BooksStatsDisplay books={books} compact />
            )}
          </Box>

          {/* Icono expandir */}
          <ExpandMoreIcon sx={{ color: '#a855f7', fontSize: 24 }} />
        </Box>
      )}

      {/* Versión Expandida */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 2000, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{
              maxHeight: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.3, ease: 'easeInOut' },
            }}
            style={{ overflow: 'hidden' }}
          >
            <Box
              sx={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                p: 2,
              }}
            >
              {/* Botón de colapsar en la esquina superior izquierda */}
              <IconButton
                onClick={() => setIsExpanded(false)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  color: '#a855f7',
                  zIndex: 10,
                  background: 'rgba(147, 51, 234, 0.1)',
                  '&:hover': {
                    background: 'rgba(147, 51, 234, 0.2)',
                  },
                }}
              >
                <ExpandLessIcon />
              </IconButton>

              {/* Contenido original del ProfileHeader */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 6, md: '80px' },
                  alignItems: { xs: 'center', md: 'flex-start' },
                  py: 2,
                  width: '100%',
                  px: { xs: 1, md: 0 },
                  boxSizing: 'border-box',
                  position: 'relative',
                }}
              >
                {/* Avatar más pequeño */}
                <Box
                  sx={{
                    width: { xs: 70, sm: 90, md: 120 },
                    height: { xs: 70, sm: 90, md: 120 },
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <UserImage user={user} />
                </Box>

                {/* Info condensada */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    minWidth: 0,
                    width: { xs: '100%', md: 'auto' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  {/* Username + Friends badge en la misma línea */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      flexWrap: 'wrap',
                      justifyContent: { xs: 'center', md: 'flex-start' },
                    }}
                  >
                    <Typography
                      id="profile-username"
                      variant="h4"
                      sx={{
                        fontSize: { xs: 24, sm: 28, md: 32 },
                        fontWeight: 'bold',
                        color: '#fff',
                        fontFamily: lora.style.fontFamily,
                      }}
                    >
                      {user.username}
                    </Typography>
                    {canEdit && !isLoadingFriends && (
                      <Chip
                        component="a"
                        href="/users/community?tab=1"
                        icon={<PeopleIcon />}
                        label={`${friendsCount} friends`}
                        size="small"
                        clickable
                        sx={{
                          background: 'rgba(147, 51, 234, 0.12)',
                          color: '#e9d5ff',
                          border: '1px solid rgba(147, 51, 234, 0.4)',
                          fontFamily: lora.style.fontFamily,
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', md: '0.8125rem' },
                          '& .MuiChip-icon': { color: '#a855f7' },
                          '&:hover': {
                            background: 'rgba(147, 51, 234, 0.18)',
                            border: '1px solid rgba(147, 51, 234, 0.6)',
                          },
                        }}
                      />
                    )}
                    {canEdit && isLoadingFriends && (
                      <Skeleton
                        data-testid="friends-skeleton"
                        variant="rectangular"
                        width={100}
                        height={24}
                        sx={{ bgcolor: '#ffffff20', borderRadius: '16px' }}
                      />
                    )}
                  </Box>

                  {/* Email más sutil */}
                  {user?.email && (
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: { xs: 13, md: 15 },
                        fontStyle: 'italic',
                        fontFamily: lora.style.fontFamily,
                      }}
                    >
                      {user.email}
                    </Typography>
                  )}

                  {/* Biography compacta */}
                  <BiographySection
                    biography={biography}
                    isEditing={isEditingBiography && canEdit}
                    isLoading={isLoadingBiography}
                    onChange={onBiographyChange}
                    onSave={onBiographySave}
                    onCancel={onBiographyCancel}
                    onEdit={onEditProfile}
                    canEdit={canEdit}
                    compact
                  />

                  {/* Stats inline - visible para todos */}
                  {isLoadingBooks && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        flexWrap: 'wrap',
                        mt: 0.5,
                      }}
                    >
                      <Skeleton
                        variant="text"
                        width={120}
                        height={20}
                        sx={{
                          bgcolor: 'rgba(147, 51, 234, 0.15)',
                          borderRadius: '4px',
                        }}
                      />
                      <Box sx={{ color: 'rgba(255,255,255,0.3)' }}>•</Box>
                      <Skeleton
                        variant="text"
                        width={100}
                        height={20}
                        sx={{
                          bgcolor: 'rgba(147, 51, 234, 0.15)',
                          borderRadius: '4px',
                        }}
                      />
                      <Box sx={{ color: 'rgba(255,255,255,0.3)' }}>•</Box>
                      <Skeleton
                        variant="text"
                        width={140}
                        height={20}
                        sx={{
                          bgcolor: 'rgba(147, 51, 234, 0.15)',
                          borderRadius: '4px',
                        }}
                      />
                    </Box>
                  )}
                  {!isLoadingBooks && <BooksStatsDisplay books={books} />}
                </Box>

                {/* Botones compactos */}
                {canEdit && (
                  <Box
                    sx={{
                      display: { xs: 'flex', sm: 'flex' },
                      gap: 1,
                      flexShrink: 0,
                      position: { xs: 'static', md: 'absolute' },
                      top: { md: 16 },
                      right: { md: 0 },
                      justifyContent: 'center',
                      mt: { xs: 1, md: 0 },
                    }}
                  >
                    <Tooltip
                      title={isCopied ? 'Copied!' : 'Share Profile'}
                      placement="top"
                    >
                      <IconButton
                        onClick={handleShareProfile}
                        sx={{
                          background: isCopied
                            ? 'rgba(52, 211, 153, 0.12)'
                            : 'rgba(147, 51, 234, 0.12)',
                          backdropFilter: 'blur(10px)',
                          border: isCopied
                            ? '1px solid rgba(52, 211, 153, 0.4)'
                            : '1px solid rgba(147, 51, 234, 0.4)',
                          color: isCopied ? '#34d399' : '#e9d5ff',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: isCopied
                              ? 'rgba(52, 211, 153, 0.18)'
                              : 'rgba(147, 51, 234, 0.18)',
                            border: isCopied
                              ? '1px solid rgba(52, 211, 153, 0.6)'
                              : '1px solid rgba(147, 51, 234, 0.6)',
                          },
                        }}
                      >
                        {isCopied ? (
                          <CheckIcon fontSize="small" />
                        ) : (
                          <ShareIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Account" placement="top">
                      <IconButton
                        component="a"
                        href="https://accounts.gycoding.com"
                        target="_blank"
                        sx={{
                          background: 'rgba(147, 51, 234, 0.12)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(147, 51, 234, 0.4)',
                          color: '#e9d5ff',
                          '&:hover': {
                            background: 'rgba(147, 51, 234, 0.18)',
                            border: '1px solid rgba(147, 51, 234, 0.6)',
                          },
                        }}
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Profile" placement="top">
                      <IconButton
                        onClick={onEditProfile}
                        sx={{
                          background: 'rgba(147, 51, 234, 0.12)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(147, 51, 234, 0.4)',
                          color: '#e9d5ff',
                          '&:hover': {
                            background: 'rgba(147, 51, 234, 0.18)',
                            border: '1px solid rgba(147, 51, 234, 0.6)',
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Log Out" placement="top">
                      <IconButton
                        component="a"
                        href={'/auth/logout?federated=true'}
                        target="_blank"
                        sx={{
                          background: 'rgba(234, 51, 51, 0.12)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(234, 51, 51, 0.4)',
                          color: '#e9d5ff',
                          '&:hover': {
                            background: 'rgba(234, 51, 51, 0.18)',
                            border: '1px solid rgba(234, 51, 51, 0.6)',
                          },
                        }}
                      >
                        <LogoutIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                {!canEdit && onAddFriend && (
                  <Box
                    sx={{
                      display: { xs: 'flex', sm: 'flex' },
                      gap: 1,
                      flexShrink: 0,
                      position: { xs: 'static', md: 'absolute' },
                      top: { md: 16 },
                      right: { md: 0 },
                      justifyContent: 'center',
                      mt: { xs: 1, md: 0 },
                    }}
                  >
                    <Tooltip
                      title={isCopied ? 'Copied!' : 'Share Profile'}
                      placement="top"
                    >
                      <IconButton
                        onClick={handleShareProfile}
                        sx={{
                          background: isCopied
                            ? 'rgba(52, 211, 153, 0.12)'
                            : 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          border: isCopied
                            ? '1px solid rgba(52, 211, 153, 0.4)'
                            : '1px solid rgba(255, 255, 255, 0.12)',
                          color: isCopied
                            ? '#34d399'
                            : 'rgba(255, 255, 255, 0.7)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            color: '#fff',
                          },
                        }}
                      >
                        {isCopied ? (
                          <CheckIcon fontSize="small" />
                        ) : (
                          <ShareIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={isFriend ? 'Remove friend' : 'Add friend'}
                      placement="top"
                    >
                      <span>
                        <IconButton
                          onClick={isFriend ? onRemoveFriend : onAddFriend}
                          disabled={isAddingFriend || isRemovingFriend}
                          sx={{
                            background: isFriend
                              ? 'rgba(52,211,153,0.1)'
                              : 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)',
                            border: isFriend
                              ? '1px solid rgba(52,211,153,0.35)'
                              : '1px solid rgba(255,255,255,0.12)',
                            color: isFriend
                              ? '#34d399'
                              : 'rgba(255,255,255,0.7)',
                            transition: 'all 0.2s ease',
                            '&:hover': isFriend
                              ? {
                                  background: 'rgba(239,68,68,0.15)',
                                  border: '1px solid rgba(239,68,68,0.4)',
                                  color: '#ef4444',
                                }
                              : {
                                  background: 'rgba(255,255,255,0.1)',
                                  border: '1px solid rgba(255,255,255,0.25)',
                                  color: '#fff',
                                },
                            '&:hover .friend-check-icon': { display: 'none' },
                            '&:hover .friend-remove-icon': { display: 'block' },
                            '&.Mui-disabled': {
                              opacity: 0.6,
                            },
                          }}
                        >
                          {isFriend ? (
                            <>
                              <CheckIcon
                                className="friend-check-icon"
                                fontSize="small"
                              />
                              <PersonRemoveIcon
                                className="friend-remove-icon"
                                fontSize="small"
                                sx={{ display: 'none' }}
                              />
                            </>
                          ) : (
                            <PersonAddIcon fontSize="small" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
