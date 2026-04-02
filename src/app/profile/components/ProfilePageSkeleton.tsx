import React from 'react';
import { Box, Container } from '@mui/material';
import { ProfileHeaderSkeleton } from './ProfileHeader/ProfileHeaderSkeleton';
import { TabsSkeleton } from './TabsSkeleton';
import { BooksListSkeleton } from './BooksList/BooksListSkeleton';

export const ProfilePageSkeleton: React.FC = () => (
  <Container
    maxWidth="xl"
    sx={{
      mt: { xs: 0, md: 6 },
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '70vh',
      borderRadius: 0,
      boxShadow: 'none',
    }}
  >
    <Box
      sx={{
        width: { xs: '100%', md: '100%' },
        maxWidth: 1200,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <ProfileHeaderSkeleton />

      <Box sx={{ mt: 0 }}>
        <TabsSkeleton />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}
        >
          <BooksListSkeleton />
        </Box>
      </Box>
    </Box>
  </Container>
);

export default ProfilePageSkeleton;
