'use client';

import React, { useState } from 'react';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { motion } from 'framer-motion';
import { lora } from '@/utils/fonts/fonts';
import { useLists } from '@/hooks/useLists';
import { useTranslation } from '@/hooks/useTranslation';
import { ListCard } from '../ListCard/ListCard';
import { CreateListModal } from '../CreateListModal/CreateListModal';

const MotionBox = motion(Box);

interface ListsTabProps {
  isOwnProfile: boolean;
}

/** Skeleton row in mobile style (compact horizontal) */
const MobileListRowSkeleton: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      p: '14px 16px',
      gap: 1.5,
      borderRadius: '18px',
      border: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(255,255,255,0.02)',
    }}
  >
    {/* Name + description */}
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
      }}
    >
      <Skeleton
        variant="text"
        width="45%"
        height={18}
        sx={{ bgcolor: 'rgba(255,255,255,0.07)' }}
      />
      <Skeleton
        variant="text"
        width="75%"
        height={12}
        sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
      />
    </Box>
    {/* Chip + donut */}
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        flexShrink: 0,
      }}
    >
      <Skeleton
        variant="rounded"
        width={24}
        height={18}
        sx={{ bgcolor: 'rgba(168,85,247,0.1)', borderRadius: '9px' }}
      />
      <Skeleton
        variant="circular"
        width={32}
        height={32}
        sx={{ bgcolor: 'rgba(168,85,247,0.08)' }}
      />
      <Skeleton
        variant="text"
        width={20}
        height={10}
        sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
      />
    </Box>
  </Box>
);

/** Skeleton card in desktop style (horizontal with fan area) */
const DesktopListCardSkeleton: React.FC = () => (
  <Box
    sx={{
      width: ['100%', '100%', 'calc(50% - 8px)'],
      borderRadius: '18px',
      overflow: 'hidden',
      display: 'flex',
      height: 200,
      border: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(255,255,255,0.02)',
    }}
  >
    <Box
      sx={{
        width: '42%',
        p: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Skeleton
        variant="text"
        width="55%"
        height={22}
        sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
      />
      <Skeleton
        variant="text"
        width="90%"
        height={14}
        sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
      />
      <Skeleton
        variant="text"
        width="80%"
        height={14}
        sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
      />
      <Skeleton
        variant="rounded"
        width={64}
        height={22}
        sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
        <Skeleton
          variant="circular"
          width={44}
          height={44}
          sx={{ bgcolor: 'rgba(168,85,247,0.08)', flexShrink: 0 }}
        />
        <Box sx={{ flex: 1 }}>
          <Skeleton
            variant="text"
            width={32}
            height={18}
            sx={{ bgcolor: 'rgba(168,85,247,0.08)' }}
          />
          <Skeleton
            variant="text"
            width={56}
            height={12}
            sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
          />
        </Box>
      </Box>
    </Box>
    <Box sx={{ flex: 1, bgcolor: 'rgba(168,85,247,0.03)' }} />
  </Box>
);

const ListsGridSkeleton: React.FC = () => (
  <>
    {/* Mobile: compact rows */}
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <MobileListRowSkeleton key={i} />
      ))}
    </Box>
    {/* Desktop: card grid */}
    <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexWrap: 'wrap', gap: 2 }}>
      {[1, 2, 3, 4].map((i) => (
        <DesktopListCardSkeleton key={i} />
      ))}
    </Box>
  </>
);

export const ListsTab: React.FC<ListsTabProps> = ({ isOwnProfile }) => {
  const { lists, isLoading, isCreating, createList } = useLists();
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  const handleCreate = async (payload: {
    name: string;
    description?: string;
  }) => {
    await createList(payload);
    setModalOpen(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ pt: 3 }}>
        <ListsGridSkeleton />
      </Box>
    );
  }

  if (lists.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
          gap: 2,
        }}
      >
        <FormatListBulletedIcon
          sx={{ fontSize: 48, color: 'rgba(255,255,255,0.12)' }}
        />
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            color: 'rgba(255,255,255,0.35)',
            fontSize: 15,
            textAlign: 'center',
          }}
        >
          {isOwnProfile ? t('lists.tab.empty') : t('lists.tab.empty.other')}
        </Typography>
        {isOwnProfile && (
          <Button
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{
              fontFamily: lora.style.fontFamily,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
              color: '#fff',
              borderRadius: '10px',
              px: 3,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
              },
            }}
          >
            {t('lists.tab.create')}
          </Button>
        )}

        {isOwnProfile && (
          <CreateListModal
            open={modalOpen}
            isSubmitting={isCreating}
            onClose={() => setModalOpen(false)}
            onSubmit={handleCreate}
          />
        )}
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      {isOwnProfile && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 2,
          }}
        >
          <Button
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            size="small"
            sx={{
              fontFamily: lora.style.fontFamily,
              fontWeight: 600,
              textTransform: 'none',
              background: 'rgba(147,51,234,0.12)',
              color: '#e9d5ff',
              border: '1px solid rgba(147,51,234,0.35)',
              borderRadius: '10px',
              px: 2,
              '&:hover': {
                background: 'rgba(147,51,234,0.2)',
                borderColor: 'rgba(147,51,234,0.6)',
              },
            }}
          >
            {t('lists.tab.new-list')}
          </Button>
        </Box>
      )}

      {/* Grid */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {lists.map((list, i) => (
          <MotionBox
            key={list.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
            sx={{ width: ['100%', '100%', 'calc(50% - 8px)'] }}
          >
            <ListCard list={list} />
          </MotionBox>
        ))}
      </Box>

      {isOwnProfile && (
        <CreateListModal
          open={modalOpen}
          isSubmitting={isCreating}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </Box>
  );
};
