'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { lora } from '@/utils/fonts/fonts';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import { BookList } from '@/domain/list.model';
import { useHardcoverBatch } from '@/hooks/books/useHardcoverBatch';
import HardcoverBook, { BookHelpers } from '@/domain/HardcoverBook';

const MotionBox = motion(Box);

interface ListCardProps {
  list: BookList;
}

const COVER_PREVIEW_COUNT = 4;

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  const router = useRouter();

  const previewBooks = useMemo(
    () =>
      list.books
        .slice()
        .sort((a, b) => a.order - b.order)
        .slice(0, COVER_PREVIEW_COUNT),
    [list.books]
  );

  const previewIds = useMemo(
    () => previewBooks.map((b) => b.id),
    [previewBooks]
  );
  const { data: hardcoverBooks } = useHardcoverBatch(previewIds);

  const coverMap = useMemo(() => {
    const map = new Map<string, string>();
    hardcoverBooks?.forEach((book: HardcoverBook) => {
      map.set(String(book.id), BookHelpers.getDisplayCoverUrl(book));
    });
    return map;
  }, [hardcoverBooks]);

  const coverUrls = previewBooks.map(
    (b) => coverMap.get(b.id) ?? b.coverUrl ?? DEFAULT_COVER_IMAGE
  );

  // Pad to 4 slots so the grid is always consistent
  while (coverUrls.length < COVER_PREVIEW_COUNT) {
    coverUrls.push(null as unknown as string);
  }

  return (
    <MotionBox
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
      onClick={() => router.push(`/lists/${list.id}`)}
      sx={{
        cursor: 'pointer',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(8px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s ease',
        '&:hover': {
          borderColor: 'rgba(168,85,247,0.35)',
        },
      }}
    >
      {/* Cover collage */}
      <Box
        sx={{
          width: '100%',
          aspectRatio: '2/1',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.3)',
        }}
      >
        {coverUrls.map((url, i) => (
          <Box
            key={i}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRight: i % 2 === 0 ? '1px solid rgba(0,0,0,0.4)' : 'none',
              borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.4)' : 'none',
            }}
          >
            {url ? (
              <Image
                src={url}
                alt=""
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 50vw, 20vw"
                unoptimized
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  background:
                    i % 2 === 0
                      ? 'rgba(168,85,247,0.06)'
                      : 'rgba(96,165,250,0.06)',
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* Info */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontWeight: 700,
            fontSize: 15,
            color: '#fff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {list.name}
        </Typography>

        {list.description && (
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontSize: 12,
              color: 'rgba(255,255,255,0.45)',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5,
            }}
          >
            {list.description}
          </Typography>
        )}

        <Chip
          label={`${list.books.length} book${list.books.length !== 1 ? 's' : ''}`}
          size="small"
          sx={{
            mt: 0.5,
            alignSelf: 'flex-start',
            fontFamily: lora.style.fontFamily,
            fontSize: 11,
            background: 'rgba(168,85,247,0.1)',
            color: '#c084fc',
            border: '1px solid rgba(168,85,247,0.25)',
            height: 22,
          }}
        />
      </Box>
    </MotionBox>
  );
};
