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
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      },
      gap: 2,
    }}
  >
    {[1, 2, 3].map((i) => (
      <Box key={i} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{ paddingTop: '50%', bgcolor: 'rgba(255,255,255,0.06)' }}
        />
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <Skeleton
            variant="text"
            width="60%"
            height={20}
            sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
          />
          <Skeleton
            variant="text"
            width="90%"
            height={14}
            sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
          />
          <Skeleton
            variant="rounded"
            width={60}
            height={22}
            sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
          />
        </Box>
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
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {lists.map((list, i) => (
          <MotionBox
            key={list.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
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
