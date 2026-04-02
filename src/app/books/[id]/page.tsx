/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import { BookRating } from '@/app/components/atoms/BookRating/BookRating';
import { useHallOfFame } from '@/hooks/useHallOfFame';
import { useUser } from '@/hooks/useUser';
import { ESeverity } from '@/utils/constants/ESeverity';
import { lora } from '@/utils/fonts/fonts';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import StarIcon from '@mui/icons-material/Star';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Avatar, Box, IconButton, Skeleton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import BookDetailsSkeleton from '@/app/components/molecules/BookDetailsSkeleton';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { EditionSelector } from '@/app/components/molecules/EditionSelector/EditionSelector';
import { Edition } from '@/domain/HardcoverBook';
import useMergedBook from '@/hooks/books/useMergedBook';
import { useEditionSelection } from '@/hooks/useEditionSelection';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';

const MotionBox = motion(Box);

const GLOW_SX = {
  position: 'absolute' as const,
  borderRadius: '50%',
  filter: 'blur(100px)',
  pointerEvents: 'none' as const,
};

export default function BookDetails() {
  const params = useParams();
  const { data: user } = useUser();
  const {
    data: book,
    isLoading: isMergedLoading,
    mutate,
  } = useMergedBook(params.id as string);

  const authorName = React.useMemo(() => {
    if (!book) return '';
    if (typeof book.author === 'string') return book.author;
    return book.author?.name || '';
  }, [book]);

  const authorId = React.useMemo(() => {
    if (!book) return null;
    if (typeof book.author === 'object' && book.author?.id)
      return book.author.id;
    return null;
  }, [book]);

  const authorImage = React.useMemo(() => {
    if (!book || typeof book.author !== 'object') return null;
    return (book.author as any)?.image?.url || null;
  }, [book]);

  const authorBio = React.useMemo(() => {
    if (!book || typeof book.author !== 'object') return null;
    return (book.author as any)?.biography || null;
  }, [book]);

  const coverUrl = React.useMemo(() => {
    if (!book) return DEFAULT_COVER_IMAGE;
    if (book.cover?.url) return book.cover.url;
    if ((book as any).image) return (book as any).image;
    return DEFAULT_COVER_IMAGE;
  }, [book]);

  const [editionNotification, setEditionNotification] = React.useState<{
    open: boolean;
    success: boolean;
    message: string;
  }>({ open: false, success: false, message: '' });

  const {
    selectedEdition,
    setSelectedEdition,
    displayTitle,
    displayImage,
    isSaving,
  } = useEditionSelection({
    editions: book?.editions || [],
    Book: book || undefined,
    defaultCoverUrl: coverUrl,
    defaultTitle: book?.title || '',
    onEditionSaved: (success, message) => {
      setEditionNotification({ open: true, success, message });
    },
  });

  const {
    data: hallOfFame,
    handleAddBookToHallOfFame,
    setIsLoadingToAddHallOfFame,
    setIsUpdatedAddToHallOfFame,
    setIsErrorAddToHallOfFame,
    isErrorAddToHallOfFame,
    isUpdatedAddToHallOfFame,
    handleDeleteBookToHallOfFame,
    setIsLoadingToDeleteHallOfFame,
    setIsUpdatedDeleteToHallOfFame,
    setIsErrorDeleteToHallOfFame,
    isUpdatedDeleteToHallOfFame,
    isErrorDeleteToHallOfFame,
  } = useHallOfFame(user?.id || '');

  const isOnHallOfFame = hallOfFame?.books.some((b) => {
    const id = typeof b === 'string' ? b : b.id;
    return id === book?.id;
  });
  const isLoggedIn = !!user;
  const { t } = useTranslation();

  const allEditions: Edition[] = React.useMemo(() => {
    if (!book?.editions) return [];
    return book.editions;
  }, [book]);

  if (isMergedLoading) {
    return <BookDetailsSkeleton />;
  }

  const handleClick = () => {
    if (isOnHallOfFame) {
      setIsLoadingToDeleteHallOfFame(true);
      setIsUpdatedDeleteToHallOfFame(false);
      setIsErrorDeleteToHallOfFame(false);
      handleDeleteBookToHallOfFame(book?.id || '');
      setIsLoadingToAddHallOfFame(false);
      setIsUpdatedAddToHallOfFame(false);
      setIsErrorAddToHallOfFame(false);
    } else {
      setIsLoadingToAddHallOfFame(false);
      setIsUpdatedAddToHallOfFame(false);
      setIsErrorAddToHallOfFame(false);
      handleAddBookToHallOfFame(book?.id || '');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
        pb: { xs: '80px', md: '120px' },
      }}
    >
      {/* Glows */}
      <Box
        sx={{
          ...GLOW_SX,
          top: '-5%',
          left: '-5%',
          width: 700,
          height: 600,
          background:
            'radial-gradient(ellipse, rgba(147,51,234,0.08) 0%, transparent 70%)',
        }}
      />
      <Box
        sx={{
          ...GLOW_SX,
          top: '10%',
          right: '-10%',
          width: 500,
          height: 500,
          background:
            'radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)',
        }}
      />

      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, sm: 4, md: 6 },
          pt: { xs: 5, md: 9 },
        }}
      >
        {/* ── HERO ── */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 7 },
            alignItems: 'flex-start',
            mb: { xs: 6, md: 8 },
          }}
        >
          {/* Cover wrapper — centers cover+actions on mobile */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'contents' },
              justifyContent: { xs: 'center', md: 'unset' },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: { xs: 200, sm: 230, md: 260 },
                  height: { xs: 290, sm: 336, md: 380 },
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow:
                    '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(147,51,234,0.12)',
                  position: 'relative',
                }}
              >
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt={displayTitle}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="260px"
                    priority
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      width: '100%',
                      height: '100%',
                      bgcolor: 'rgba(255,255,255,0.05)',
                    }}
                  />
                )}
              </Box>

              {/* Actions below cover */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  mt: 2.5,
                }}
              >
                {/* Rating stars */}
                <BookRating
                  apiBook={book as any}
                  bookId={book?.id || ''}
                  isRatingLoading={isMergedLoading}
                  mutate={mutate as any}
                  isLoggedIn={isLoggedIn}
                  selectedEdition={selectedEdition}
                />

                {/* Hall of Fame */}
                {user && (
                  <IconButton
                    onClick={handleClick}
                    sx={{
                      width: '100%',
                      maxWidth: 200,
                      borderRadius: '10px',
                      gap: 1,
                      py: 0.8,
                      px: 2,
                      color: isOnHallOfFame
                        ? '#fbbf24'
                        : 'rgba(255,255,255,0.4)',
                      background: isOnHallOfFame
                        ? 'rgba(251,191,36,0.08)'
                        : 'rgba(255,255,255,0.03)',
                      border: isOnHallOfFame
                        ? '1px solid rgba(251,191,36,0.25)'
                        : '1px solid rgba(255,255,255,0.07)',
                      transition: 'all 0.25s',
                      '&:hover': {
                        background: isOnHallOfFame
                          ? 'rgba(251,191,36,0.13)'
                          : 'rgba(255,255,255,0.06)',
                      },
                    }}
                  >
                    <WorkspacePremiumIcon sx={{ fontSize: 18 }} />
                    <Typography
                      sx={{
                        fontFamily: lora.style.fontFamily,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {isOnHallOfFame
                        ? t('book.detail.hallOfFame.in')
                        : t('book.detail.hallOfFame.add')}
                    </Typography>
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', md: 'auto' } }}>
            {/* Series + Title + Author — centered on mobile */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                mb: 3,
              }}
            >
              {/* Series badge */}
              {book?.series && book.series.length > 0 && (
                <MotionBox
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  sx={{
                    display: 'inline-flex',
                    px: 1.5,
                    py: 0.4,
                    borderRadius: '100px',
                    border: '1px solid rgba(147,51,234,0.3)',
                    background: 'rgba(147,51,234,0.08)',
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: lora.style.fontFamily,
                      fontSize: '0.7rem',
                      color: '#c084fc',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {book.series[0]?.name}
                  </Typography>
                </MotionBox>
              )}

              {/* Title */}
              <Typography
                component="h1"
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontWeight: 700,
                  fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
                  lineHeight: 1.1,
                  background:
                    'linear-gradient(135deg, #ffffff 20%, #c084fc 60%, #818cf8 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  paddingBottom: '8px',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                {displayTitle}
              </Typography>

              {/* Author subtitle */}
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  letterSpacing: '0.02em',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                {authorName}
              </Typography>
            </Box>

            {/* Meta row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
                mb: 3,
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <StarIcon sx={{ color: '#fbbf24', fontSize: 18 }} />
                <Typography
                  sx={{
                    fontFamily: lora.style.fontFamily,
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#fbbf24',
                  }}
                >
                  {book?.averageRating ? book.averageRating.toFixed(1) : '—'}
                </Typography>
              </Box>

              {/* Page count */}
              {book?.pageCount && book.pageCount > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <MenuBookIcon
                    sx={{ color: 'rgba(147,51,234,0.6)', fontSize: 16 }}
                  />
                  <Typography
                    sx={{
                      fontFamily: lora.style.fontFamily,
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {book.pageCount} {t('book.detail.pages')}
                  </Typography>
                </Box>
              )}

              {/* Editions count + selector */}
              {allEditions.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoStoriesIcon
                    sx={{ color: 'rgba(147,51,234,0.6)', fontSize: 16 }}
                  />
                  <Typography
                    sx={{
                      fontFamily: lora.style.fontFamily,
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {allEditions.length}{' '}
                    {allEditions.length !== 1
                      ? t('book.detail.edition.plural')
                      : t('book.detail.edition.singular')}
                  </Typography>
                  <EditionSelector
                    editions={allEditions}
                    selectedEdition={selectedEdition}
                    onEditionChange={setSelectedEdition}
                    disabled={isSaving}
                  />
                </Box>
              )}
            </Box>

            {/* Divider */}
            <Box
              sx={{
                height: '1px',
                background: 'rgba(255,255,255,0.06)',
                mb: 3,
              }}
            />

            {/* Description */}
            {book?.description && (
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  lineHeight: 1.85,
                  letterSpacing: '0.01em',
                  textAlign: 'justify',
                  mb: 4,
                }}
                dangerouslySetInnerHTML={{ __html: book.description }}
              />
            )}

            {/* ── AUTHOR CARD ── */}
            {authorId && (
              <MotionBox
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <Typography
                  sx={{
                    fontFamily: lora.style.fontFamily,
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    mb: 1.5,
                  }}
                >
                  {t('book.detail.about.author')}
                </Typography>

                <Box
                  component={Link}
                  href={`/authors/${authorId}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'flex-start',
                    p: { xs: 2, md: 2.5 },
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                    '&:hover': {
                      borderColor: 'rgba(147,51,234,0.3)',
                      background: 'rgba(147,51,234,0.04)',
                      '& .author-arrow': {
                        opacity: 1,
                        transform: 'translate(2px, -2px)',
                      },
                    },
                    position: 'relative',
                  }}
                >
                  {/* Avatar */}
                  {authorImage ? (
                    <Box
                      sx={{
                        width: { xs: 56, md: 64 },
                        height: { xs: 56, md: 64 },
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '2px solid rgba(147,51,234,0.25)',
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={authorImage}
                        alt={authorName}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="64px"
                      />
                    </Box>
                  ) : (
                    <Avatar
                      sx={{
                        width: { xs: 56, md: 64 },
                        height: { xs: 56, md: 64 },
                        flexShrink: 0,
                        border: '2px solid rgba(147,51,234,0.25)',
                        background:
                          'linear-gradient(135deg, rgba(147,51,234,0.2) 0%, rgba(129,140,248,0.15) 100%)',
                        fontFamily: lora.style.fontFamily,
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#c084fc',
                      }}
                    >
                      {authorName.charAt(0)}
                    </Avatar>
                  )}

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0, pr: 3 }}>
                    <Typography
                      sx={{
                        fontFamily: lora.style.fontFamily,
                        fontWeight: 700,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        color: '#ffffff',
                        mb: 0.6,
                        lineHeight: 1.2,
                      }}
                    >
                      {authorName}
                    </Typography>

                    {authorBio ? (
                      <Typography
                        sx={{
                          fontFamily: lora.style.fontFamily,
                          color: 'rgba(255,255,255,0.4)',
                          fontSize: { xs: '0.82rem', md: '0.85rem' },
                          lineHeight: 1.65,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {authorBio}
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: lora.style.fontFamily,
                          color: 'rgba(255,255,255,0.22)',
                          fontSize: '0.82rem',
                          fontStyle: 'italic',
                        }}
                      >
                        {t('book.detail.view.profile')}
                      </Typography>
                    )}
                  </Box>

                  {/* Arrow */}
                  <NorthEastIcon
                    className="author-arrow"
                    sx={{
                      position: 'absolute',
                      top: { xs: 14, md: 18 },
                      right: { xs: 14, md: 18 },
                      fontSize: 16,
                      color: '#c084fc',
                      opacity: 0.35,
                      transition: 'opacity 0.2s, transform 0.2s',
                    }}
                  />
                </Box>
              </MotionBox>
            )}
          </Box>
        </MotionBox>
      </Box>

      {/* Alerts */}
      <AnimatedAlert
        open={isUpdatedAddToHallOfFame}
        onClose={() => setIsUpdatedAddToHallOfFame(false)}
        message={t('book.detail.hallOfFame.add.success')}
        severity={ESeverity.SUCCESS}
      />
      <AnimatedAlert
        open={isErrorAddToHallOfFame}
        onClose={() => setIsErrorAddToHallOfFame(false)}
        message={t('book.detail.hallOfFame.add.error')}
        severity={ESeverity.ERROR}
      />
      <AnimatedAlert
        open={isUpdatedDeleteToHallOfFame}
        onClose={() => setIsUpdatedAddToHallOfFame(false)}
        message={t('book.detail.hallOfFame.delete.success')}
        severity={ESeverity.SUCCESS}
      />
      <AnimatedAlert
        open={isErrorDeleteToHallOfFame}
        onClose={() => setIsErrorDeleteToHallOfFame(false)}
        message={t('book.detail.hallOfFame.delete.error')}
        severity={ESeverity.ERROR}
      />
      <AnimatedAlert
        open={editionNotification.open}
        onClose={() =>
          setEditionNotification((prev) => ({ ...prev, open: false }))
        }
        message={editionNotification.message}
        severity={
          editionNotification.success ? ESeverity.SUCCESS : ESeverity.ERROR
        }
      />
    </Box>
  );
}
