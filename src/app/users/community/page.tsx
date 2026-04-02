'use client';
import React, { Suspense } from 'react';
import { useFriends } from '@/hooks/useFriends';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { lora } from '@/utils/fonts/fonts';

import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { useUsersTab } from './hooks/useUsersTab';
import { useUserSearch } from './hooks/useUserSearch';
import { TabNavigation } from './components/TabNavigation/TabNavigation';
import { FriendsTab } from './components/FriendsTab/FriendsTab';
import { DiscoverTab } from './components/DiscoverTab/DiscoverTab';

const MotionBox = motion(Box);

const GLOW_SX = {
  position: 'absolute' as const,
  borderRadius: '50%',
  filter: 'blur(80px)',
  pointerEvents: 'none',
};

interface CommunityHeroProps {
  tab: number;
  friendsCount: number;
  onTabChange: (t: number) => void;
}

function CommunityHero({ tab, friendsCount, onTabChange }: CommunityHeroProps) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 6, sm: 8, md: 10 },
        pb: { xs: 3, sm: 4 },
        gap: { xs: 2, sm: 3 },
      }}
    >
      <MotionBox
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          px: 2,
          py: 0.5,
          borderRadius: '100px',
          border: '1px solid rgba(147,51,234,0.3)',
          background: 'rgba(147,51,234,0.08)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            color: '#c084fc',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {t('community.hero.eyebrow')}
        </Typography>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        sx={{ textAlign: 'center', px: 2 }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '3.5rem', sm: '5rem', md: '6.5rem', lg: '7.5rem' },
            lineHeight: 1,
            fontWeight: 700,
            background:
              'linear-gradient(135deg, #ffffff 20%, #c084fc 60%, #818cf8 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            paddingBottom: 2,
          }}
        >
          {t('community.hero.title')}
        </Typography>
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            color: 'rgba(255,255,255,0.4)',
            mt: { xs: 0.5, md: 1 },
            letterSpacing: '0.02em',
          }}
        >
          {t('community.hero.subtitle')}
        </Typography>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{ width: '100%', mt: { xs: 0.5, sm: 1 } }}
      >
        <TabNavigation
          tab={tab}
          friendsCount={friendsCount}
          onTabChange={onTabChange}
        />
      </MotionBox>
    </Box>
  );
}

function FriendsPageContent() {
  const { tab, setTab } = useUsersTab();
  const { user: currentUser } = useGyCodingUser();
  const {
    data,
    isLoading,
    handleDeleteFriend,
    isLoadingDelete,
    setErrorDelete,
    errorDelete,
    isSuccessDelete,
    setIsSuccessDelete,
    count,
  } = useFriends();

  const {
    search,
    setSearch,
    users,
    isAddingFriend,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    handleAddFriend,
  } = useUserSearch(currentUser?.id, data ?? []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
        pb: { xs: '80px', md: '120px' },
      }}
    >
      <Box
        sx={{
          ...GLOW_SX,
          top: '0%',
          right: '10%',
          width: 600,
          height: 500,
          background:
            'radial-gradient(ellipse, rgba(147,51,234,0.1) 0%, transparent 70%)',
        }}
      />
      <Box
        sx={{
          ...GLOW_SX,
          top: '5%',
          left: '5%',
          width: 500,
          height: 450,
          background:
            'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)',
        }}
      />
      <CommunityHero tab={tab} friendsCount={count} onTabChange={setTab} />

      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', xl: '1400px' },
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
        }}
      >
        {tab === 0 && (
          <DiscoverTab
            search={search}
            users={users}
            isAddingFriend={isAddingFriend}
            successMessage={successMessage}
            errorMessage={errorMessage}
            onSearchChange={setSearch}
            onAddFriend={handleAddFriend}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
        {tab === 1 && (
          <FriendsTab
            data={data}
            isLoading={isLoading}
            isLoadingDelete={isLoadingDelete}
            errorDelete={errorDelete}
            isSuccessDelete={isSuccessDelete}
            handleDeleteFriend={handleDeleteFriend}
            setErrorDelete={setErrorDelete}
            setIsSuccessDelete={setIsSuccessDelete}
          />
        )}
      </Box>
    </Box>
  );
}

export default function FriendsPage() {
  return (
    <Suspense
      fallback={<Box sx={{ minHeight: '100vh', bgcolor: '#0A0A0A' }} />}
    >
      <FriendsPageContent />
    </Suspense>
  );
}
