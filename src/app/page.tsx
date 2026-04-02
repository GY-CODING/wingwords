'use client';

import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { Box, CircularProgress, Container } from '@mui/material';
import { Suspense } from 'react';
import { CTASection } from './components/organisms/CTASection';
import { FeaturesGrid } from './components/organisms/FeaturesGrid';
import { Footer } from './components/organisms/Footer';
import { Hero } from './components/organisms/Hero';
import DashboardPage from './dashboard/page';
import { TranslationBanner } from './components/TranslationBanner';

const LoadingSkeleton = () => (
  <Box
    sx={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress
      size={40}
      thickness={4}
      sx={{
        color: '#9333ea',
        marginTop: '-80px',
      }}
    />
  </Box>
);

const LandingPage = () => (
  <Box
    sx={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          'radial-gradient(circle at center, rgba(147, 51, 234, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      },
    }}
  >
    <Box
      sx={{
        position: 'relative',
        zIndex: 2,
        px: { xs: 2, sm: 3, md: 4 },
        pt: { xs: 2, sm: 2.5 },
      }}
    >
      <TranslationBanner />
    </Box>
    <Container
      maxWidth="lg"
      sx={{
        position: 'relative',
        zIndex: 1,
        px: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 6, sm: 8, md: 10 },
      }}
    >
      <Hero />
      <FeaturesGrid />
      <CTASection />
    </Container>
    <Box sx={{ mt: 'auto' }}>
      <Footer />
    </Box>
  </Box>
);

export default function Home() {
  const { user, isLoading } = useGyCodingUser();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (user) {
    return (
      <Box
        sx={{
          height: '90vh',
        }}
      >
        <Suspense fallback={<LoadingSkeleton />}>
          <DashboardPage />
        </Suspense>
      </Box>
    );
  }

  return <LandingPage />;
}
