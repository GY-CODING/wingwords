'use client';

import { useAuthor } from '@/hooks/useAuthor';
import { useTranslation } from '@/hooks/useTranslation';
import { lora } from '@/utils/fonts/fonts';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CakeIcon from '@mui/icons-material/Cake';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  Avatar,
  Box,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { AuthorBook } from '@/domain/HardcoverAuthor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion(Box) as any;

const GLOW_SX = {
  position: 'absolute' as const,
  borderRadius: '50%',
  filter: 'blur(80px)',
  pointerEvents: 'none' as const,
};

function AuthorPageSkeleton() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        px: { xs: 2, sm: 4, md: 6 },
        pt: { xs: 6, md: 10 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 2, md: 4 },
          alignItems: 'flex-start',
          mb: 6,
        }}
      >
        <Skeleton
          variant="circular"
          sx={{
            width: { xs: 80, md: 120 },
            height: { xs: 80, md: 120 },
            flexShrink: 0,
            bgcolor: 'rgba(255,255,255,0.06)',
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Skeleton
            variant="text"
            width="40%"
            height={48}
            sx={{ bgcolor: 'rgba(255,255,255,0.07)' }}
          />
          <Skeleton
            variant="text"
            width="25%"
            height={20}
            sx={{ bgcolor: 'rgba(255,255,255,0.04)', mt: 1 }}
          />
          <Skeleton
            variant="text"
            width="70%"
            height={20}
            sx={{ bgcolor: 'rgba(255,255,255,0.04)', mt: 1 }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={20}
            sx={{ bgcolor: 'rgba(255,255,255,0.04)', mt: 0.5 }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            sx={{
              width: {
                xs: '100%',
                sm: 'calc(50% - 8px)',
                md: 'calc(33% - 11px)',
              },
              height: 100,
              borderRadius: '16px',
              bgcolor: 'rgba(255,255,255,0.05)',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

function AuthorBookCard({ book }: { book: AuthorBook }) {
  return (
    <MotionBox
      component={Link}
      href={`/books/${book.id}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: { xs: '10px', md: '14px' },
        padding: { xs: '10px', md: '14px' },
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        textDecoration: 'none',
        overflow: 'hidden',
        height: '100%',
        '&:hover': {
          borderColor: 'rgba(147,51,234,0.3)',
          background: 'rgba(147,51,234,0.04)',
        },
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <Box
        sx={{
          width: { xs: 60, md: 72 },
          flexShrink: 0,
          borderRadius: '10px',
          overflow: 'hidden',
          alignSelf: 'stretch',
          position: 'relative',
        }}
      >
        <Image
          src={book.cover.url}
          alt={book.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="80px"
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '4px',
        }}
      >
        {/* Series badge */}
        <Typography
          noWrap
          sx={{
            color: '#c084fc',
            fontFamily: lora.style.fontFamily,
            fontSize: '11px',
            fontStyle: 'italic',
            letterSpacing: '0.02em',
          }}
        >
          {book.series}
        </Typography>
        <Tooltip title={book.title} arrow placement="top">
          <Typography
            sx={{
              color: '#fff',
              fontFamily: lora.style.fontFamily,
              fontWeight: 700,
              fontSize: { xs: '14px', md: '15px' },
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              lineHeight: 1.3,
            }}
          >
            {book.title}
          </Typography>
        </Tooltip>
        {book.description && (
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.35)',
              fontFamily: lora.style.fontFamily,
              fontSize: '12px',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {book.description}
          </Typography>
        )}
        {book.releaseYear && (
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.25)',
              fontFamily: lora.style.fontFamily,
              fontSize: '11px',
              mt: 0.25,
            }}
          >
            {book.releaseYear}
          </Typography>
        )}
      </Box>
    </MotionBox>
  );
}

export default function AuthorPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10);
  const { author, isLoading, notFound } = useAuthor(id);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#0A0A0A',
          pb: { xs: '80px', md: '120px' },
        }}
      >
        <AuthorPageSkeleton />
      </Box>
    );
  }

  if (notFound || !author) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            color: 'rgba(255,255,255,0.4)',
            fontSize: '1.2rem',
          }}
        >
          {t('author.notFound')}
        </Typography>
      </Box>
    );
  }

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
          top: '0%',
          left: '10%',
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
          right: '5%',
          width: 500,
          height: 450,
          background:
            'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)',
        }}
      />

      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, sm: 4, md: 6 },
          pt: { xs: 6, md: 10 },
        }}
      >
        {/* Author header */}
        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            display: 'flex',
            gap: { xs: 3, md: 5 },
            alignItems: 'flex-start',
            mb: { xs: 5, md: 7 },
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          {/* Avatar — photo if available, otherwise initial */}
          {author.image?.url ? (
            <Box
              sx={{
                width: { xs: 100, md: 140 },
                height: { xs: 100, md: 140 },
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: '2px solid rgba(147,51,234,0.3)',
                position: 'relative',
                alignSelf: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <Image
                src={author.image.url}
                alt={author.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="140px"
              />
            </Box>
          ) : (
            <Avatar
              sx={{
                width: { xs: 100, md: 140 },
                height: { xs: 100, md: 140 },
                flexShrink: 0,
                alignSelf: { xs: 'center', sm: 'flex-start' },
                border: '2px solid rgba(147,51,234,0.3)',
                background:
                  'linear-gradient(135deg, rgba(147,51,234,0.2) 0%, rgba(129,140,248,0.15) 100%)',
                fontFamily: lora.style.fontFamily,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                color: '#c084fc',
              }}
            >
              {author.name.charAt(0)}
            </Avatar>
          )}

          {/* Info */}
          <Box sx={{ flex: 1 }}>
            <MotionBox
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              sx={{
                display: 'inline-flex',
                px: 1.5,
                py: 0.4,
                borderRadius: '100px',
                border: '1px solid rgba(147,51,234,0.3)',
                background: 'rgba(147,51,234,0.08)',
                mb: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontSize: '0.7rem',
                  color: '#c084fc',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {t('author.badge')}
              </Typography>
            </MotionBox>

            <Typography
              component="h1"
              sx={{
                fontFamily: lora.style.fontFamily,
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
                lineHeight: 1.1,
                background:
                  'linear-gradient(135deg, #ffffff 20%, #c084fc 60%, #818cf8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                mb: 1.5,
              }}
            >
              {author.name}
            </Typography>

            {/* Meta row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
                mb: author.bio ? 2.5 : 0,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <AutoStoriesIcon
                  sx={{ color: 'rgba(147,51,234,0.6)', fontSize: 15 }}
                />
                <Typography
                  sx={{
                    fontFamily: lora.style.fontFamily,
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.85rem',
                  }}
                >
                  {author.booksCount > 0
                    ? t('author.books', { count: author.booksCount })
                    : t('author.books', { count: author.books.length })}
                </Typography>
              </Box>
              {author.bornYear && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CakeIcon
                    sx={{ color: 'rgba(147,51,234,0.6)', fontSize: 15 }}
                  />
                  <Typography
                    sx={{
                      fontFamily: lora.style.fontFamily,
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {t('author.bornYear', { year: author.bornYear })}
                  </Typography>
                </Box>
              )}
            </Box>

            {author.bio && (
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: { xs: '0.875rem', md: '0.95rem' },
                  lineHeight: 1.7,
                  maxWidth: 680,
                  display: '-webkit-box',
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {author.bio}
              </Typography>
            )}
          </Box>
        </MotionBox>

        {/* Books section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                fontWeight: 700,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              {t('author.booksSection')}
            </Typography>
            {author.books.length > 0 && (
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: '100px',
                  background: 'rgba(147,51,234,0.12)',
                  border: '1px solid rgba(147,51,234,0.25)',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: lora.style.fontFamily,
                    fontSize: '0.75rem',
                    color: '#c084fc',
                    lineHeight: 1.4,
                  }}
                >
                  {author.books.length}
                </Typography>
              </Box>
            )}
          </Box>

          {author.books.length === 0 ? (
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.95rem',
              }}
            >
              {t('author.noBooksFound')}
            </Typography>
          ) : (
            (() => {
              const totalPages = Math.ceil(author.books.length / PAGE_SIZE);
              const pagedBooks = author.books.slice(
                page * PAGE_SIZE,
                (page + 1) * PAGE_SIZE
              );
              return (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: { xs: '8px', md: '12px' },
                      alignItems: 'stretch',
                    }}
                  >
                    {pagedBooks.map((book, i) => (
                      <MotionBox
                        key={book.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: Math.min(i * 0.03, 0.3),
                        }}
                        sx={{
                          width: {
                            xs: '100%',
                            sm: 'calc(50% - 6px)',
                            lg: 'calc(33.333% - 9px)',
                          },
                          flexShrink: 0,
                        }}
                      >
                        <AuthorBookCard book={book} />
                      </MotionBox>
                    ))}
                  </Box>

                  {totalPages > 1 && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        mt: 4,
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          setPage((p) => p - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={page === 0}
                        sx={{
                          color:
                            page === 0 ? 'rgba(255,255,255,0.15)' : '#c084fc',
                          border: '1px solid',
                          borderColor:
                            page === 0
                              ? 'rgba(255,255,255,0.08)'
                              : 'rgba(147,51,234,0.35)',
                          borderRadius: '10px',
                          p: 1,
                          '&:hover': { background: 'rgba(147,51,234,0.1)' },
                        }}
                      >
                        <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
                      </IconButton>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                        }}
                      >
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <Box
                            key={i}
                            onClick={() => {
                              setPage(i);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            sx={{
                              width: i === page ? 24 : 8,
                              height: 8,
                              borderRadius: '100px',
                              background:
                                i === page
                                  ? '#c084fc'
                                  : 'rgba(255,255,255,0.15)',
                              cursor: 'pointer',
                              transition: 'all 0.25s',
                              '&:hover': {
                                background:
                                  i === page
                                    ? '#c084fc'
                                    : 'rgba(255,255,255,0.3)',
                              },
                            }}
                          />
                        ))}
                      </Box>

                      <IconButton
                        onClick={() => {
                          setPage((p) => p + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={page === totalPages - 1}
                        sx={{
                          color:
                            page === totalPages - 1
                              ? 'rgba(255,255,255,0.15)'
                              : '#c084fc',
                          border: '1px solid',
                          borderColor:
                            page === totalPages - 1
                              ? 'rgba(255,255,255,0.08)'
                              : 'rgba(147,51,234,0.35)',
                          borderRadius: '10px',
                          p: 1,
                          '&:hover': { background: 'rgba(147,51,234,0.1)' },
                        }}
                      >
                        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  )}
                </>
              );
            })()
          )}
        </Box>
      </Box>
    </Box>
  );
}
