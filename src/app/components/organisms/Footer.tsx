'use client';

import { birthStone, cinzel, lora } from '@/utils/fonts/fonts';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box, Container, IconButton, Link, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        py: { xs: 6, sm: 8 },
        mt: 'auto',
        overflow: 'hidden',
      }}
    >
      {/* Gradient Background Effects */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '20%',
          width: '300px',
          height: '300px',
          background:
            'radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, rgba(147, 51, 234, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-30%',
          right: '15%',
          width: '250px',
          height: '250px',
          background:
            'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, rgba(168, 85, 247, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 4, sm: 3 },
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h6"
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '700',
                fontSize: { xs: '32px', sm: '50px' },
                letterSpacing: '.05rem',
                fontFamily: birthStone.style.fontFamily,
                mb: 1,
              }}
            >
              WingWords
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: '300px',
                mx: { xs: 'auto', md: 0 },
                fontSize: '16px',
                fontFamily: lora.style.fontFamily,
                lineHeight: 1.6,
              }}
            >
              {t('landing.footer.description')}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: { xs: 2, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
            }}
          >
            <Link
              href="https://gycoding.com"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontFamily: lora.style.fontFamily,
                fontWeight: '500',
                position: 'relative',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#a855f7',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '0%',
                  height: '2px',
                  background:
                    'linear-gradient(90deg, #9333ea 0%, #a855f7 100%)',
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': {
                  width: '100%',
                },
              }}
            >
              {t('landing.footer.about')}
            </Link>
            <Link
              href="/privacy"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontFamily: lora.style.fontFamily,
                fontWeight: '500',
                position: 'relative',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#a855f7',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '0%',
                  height: '2px',
                  background:
                    'linear-gradient(90deg, #9333ea 0%, #a855f7 100%)',
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': {
                  width: '100%',
                },
              }}
            >
              {t('landing.footer.privacy')}
            </Link>
            <Link
              href="/terms"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontFamily: lora.style.fontFamily,
                fontWeight: '500',
                position: 'relative',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#a855f7',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '0%',
                  height: '2px',
                  background:
                    'linear-gradient(90deg, #9333ea 0%, #a855f7 100%)',
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': {
                  width: '100%',
                },
              }}
            >
              {t('landing.footer.terms')}
            </Link>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <MotionIconButton
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              href="https://github.com/GY-CODING"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                backgroundColor: 'rgba(147, 51, 234, 0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#a855f7',
                  backgroundColor: 'rgba(147, 51, 234, 0.15)',
                  boxShadow: '0 4px 12px rgba(147, 51, 234, 0.15)',
                },
              }}
            >
              <GitHubIcon />
            </MotionIconButton>
            <MotionIconButton
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.linkedin.com/company/107304180/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                backgroundColor: 'rgba(147, 51, 234, 0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#a855f7',
                  backgroundColor: 'rgba(147, 51, 234, 0.15)',
                  boxShadow: '0 4px 12px rgba(147, 51, 234, 0.15)',
                },
              }}
            >
              <LinkedInIcon />
            </MotionIconButton>
            <MotionIconButton
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              href="https://gycoding.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                backgroundColor: 'rgba(147, 51, 234, 0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#a855f7',
                  backgroundColor: 'rgba(147, 51, 234, 0.15)',
                  boxShadow: '0 4px 12px rgba(147, 51, 234, 0.15)',
                },
              }}
            >
              <LanguageIcon />
            </MotionIconButton>
          </Box>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            mt: { xs: 4, sm: 6 },
            pt: { xs: 3, sm: 4 },
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            gap: '.5rem',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              fontFamily: cinzel.style.fontFamily,
            }}
          >
            © {new Date().getFullYear()}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              fontFamily: lora.style.fontFamily,
            }}
          >
            GYCODING. All rights reserved.
          </Typography>
        </MotionBox>
      </Container>
    </Box>
  );
};
