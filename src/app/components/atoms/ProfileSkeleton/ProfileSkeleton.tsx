import { Container, Box } from '@mui/material';
import React from 'react';
import { ProfileHeaderSkeleton } from '@/app/profile/components/ProfileHeader/ProfileHeaderSkeleton';
import { BiographySkeleton } from '@/app/profile/components/BiographySection/BiographySkeleton';
import { BooksListSkeleton } from '@/app/profile/components/BooksList/BooksListSkeleton';

export default function ProfileSkeleton() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 6,
        mb: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '70vh',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '90%' },
          maxWidth: 1200,
          mx: 'auto',
          p: { xs: 3, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <ProfileHeaderSkeleton />
        <BiographySkeleton />
        <Box
          sx={{
            mt: 6,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          <BooksListSkeleton />
        </Box>
      </Box>
    </Container>
  );
}
