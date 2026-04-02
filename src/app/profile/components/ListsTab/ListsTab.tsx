'use client';

import React, { useState } from 'react';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { motion } from 'framer-motion';
import { lora } from '@/utils/fonts/fonts';
import { useLists } from '@/hooks/useLists';
import { ListCard } from '../ListCard/ListCard';
import { CreateListModal } from '../CreateListModal/CreateListModal';

const MotionBox = motion(Box);

interface ListsTabProps {
  isOwnProfile: boolean;
}

const ListsGridSkeleton: React.FC = () => (
  <Box
    sx={{
      display: 'grid',
      alignContent: 'center',
      justifyItems: 'center',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 48%)' },
      gap: 2,
    }}
  >
    {[1, 2, 3, 4].map((i) => (
      <Box
        key={i}
        sx={{
          borderRadius: '18px',
          overflow: 'hidden',
          display: 'flex',
          minHeight: 180,
          border: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {/* Left */}
        <Box
          sx={{
            width: '40%',
            p: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            borderRight: '1px solid rgba(255,255,255,0.05)',
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
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}
          >
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
        {/* Right */}
        <Box sx={{ flex: 1, bgcolor: 'rgba(0,0,0,0.1)' }} />
      </Box>
    ))}
  </Box>
);

export const ListsTab: React.FC<ListsTabProps> = ({ isOwnProfile }) => {
  const { lists, isLoading, isCreating, createList } = useLists();
  const [modalOpen, setModalOpen] = useState(false);

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
          {isOwnProfile
            ? 'No lists yet. Create your first one!'
            : 'No lists yet.'}
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
            Create list
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
    <Box sx={{ pt: 3 }}>
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
            New list
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
