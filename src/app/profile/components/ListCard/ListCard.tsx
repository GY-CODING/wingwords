'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { lora } from '@/utils/fonts/fonts';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import { BookList } from '@/domain/list.model';
import { useHardcoverBatch } from '@/hooks/books/useHardcoverBatch';
import useLibrary from '@/hooks/books/useLibrary';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import HardcoverBook, { BookHelpers } from '@/domain/HardcoverBook';
import { EBookStatus } from '@gycoding/nebula';
import { useTranslation } from '@/hooks/useTranslation';

const MotionBox = motion(Box);

interface ListCardProps {
  list: BookList;
}

const MAX_COVERS = 4;
// Fan rotation angles (deg) and bottom-center pivot for each card position
const FAN_ANGLES = [-30, -10, 9, 28];

// ─── Donut chart ──────────────────────────────────────────────────────────────

const DonutChart: React.FC<{ percent: number; size?: number }> = ({
  percent,
  size = 48,
}) => {
  const sw = 5;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(percent, 100) / 100) * circ;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={sw}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#a855f7"
        strokeWidth={sw}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  );
};

// ─── ListCard ─────────────────────────────────────────────────────────────────

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  const router = useRouter();
  const { user } = useGyCodingUser();
  const { t } = useTranslation();

  // Covers for the fan
  const previewBooks = useMemo(
    () =>
      list.books
        .slice()
        .sort((a, b) => a.order - b.order)
        .slice(0, MAX_COVERS),
    [list.books]
  );
  const previewIds = useMemo(
    () => previewBooks.map((b) => b.id),
    [previewBooks]
  );
  const { data: hardcoverBooks } = useHardcoverBatch(previewIds);

  // Read % from user's merged library (Redux store, populated by useProfilePage)
  const { data: userMergedBooks } = useLibrary(user?.id as string | undefined);

  // Build cover map from raw Hardcover data
  const hardcoverCoverMap = useMemo(() => {
    const map = new Map<string, string>();
    hardcoverBooks?.forEach((book: HardcoverBook) => {
      map.set(String(book.id), BookHelpers.getDisplayCoverUrl(book));
    });
    return map;
  }, [hardcoverBooks]);

  // Override with user's selected edition covers (SWR-cached from profile)
  const userCoverMap = useMemo(() => {
    const map = new Map<string, string>();
    userMergedBooks?.forEach((book) => {
      map.set(String(book.id), BookHelpers.getDisplayCoverUrl(book));
    });
    return map;
  }, [userMergedBooks]);

  const coverUrls = previewBooks.map(
    (b) =>
      userCoverMap.get(b.id) ??
      hardcoverCoverMap.get(b.id) ??
      b.coverUrl ??
      DEFAULT_COVER_IMAGE
  );

  const { readCount, readPercent } = useMemo(() => {
    if (!userMergedBooks || list.books.length === 0)
      return { readCount: 0, readPercent: 0 };
    const listIds = new Set(list.books.map((b) => b.id));
    const inList = userMergedBooks.filter((b) => listIds.has(String(b.id)));
    const read = inList.filter(
      (b) =>
        b.userData?.status === EBookStatus.READ ||
        b.userData?.status === EBookStatus.RATE
    ).length;
    return {
      readCount: read,
      readPercent: Math.round((read / list.books.length) * 100),
    };
  }, [userMergedBooks, list.books]);

  const COVER_H = 190;
  const COVER_W = Math.round(COVER_H * (2 / 3));

  const sharedCardSx = {
    cursor: 'pointer',
    width: '100%',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(8px)',
    overflow: 'hidden',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      borderColor: 'rgba(168,85,247,0.4)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
    },
  } as const;

  const chipSx = {
    alignSelf: 'flex-start',
    fontFamily: lora.style.fontFamily,
    fontSize: 11,
    height: 22,
    background: 'rgba(168,85,247,0.1)',
    color: '#c084fc',
    border: '1px solid rgba(168,85,247,0.25)',
  } as const;

  return (
    <>
      {/* ══ MOBILE layout (xs only) — list item style ═══════════════════════ */}
      <MotionBox
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.18 }}
        onClick={() => router.push(`/lists/${list.id}`)}
        sx={{
          ...sharedCardSx,
          display: { xs: 'flex', sm: 'none' },
          flexDirection: 'row',
          alignItems: 'center',
          p: '14px 16px',
          gap: 1.5,
        }}
      >
        {/* Left: name + description */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontWeight: 700,
              fontSize: 14,
              color: '#fff',
              lineHeight: 1.3,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {list.name}
          </Typography>
          {list.description && (
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
              }}
            >
              {list.description}
            </Typography>
          )}
        </Box>

        {/* Right: chip + donut */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.75,
            flexShrink: 0,
          }}
        >
          <Chip
            label={`${list.books.length}`}
            size="small"
            sx={{ ...chipSx, fontSize: 10, height: 18, px: 0.5 }}
          />
          <DonutChart percent={readPercent} size={32} />
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontSize: 9,
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1,
            }}
          >
            {readPercent}%
          </Typography>
        </Box>
      </MotionBox>

      {/* ══ DESKTOP layout (sm+) ════════════════════════════════════════════ */}
      <MotionBox
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.18 }}
        onClick={() => router.push(`/lists/${list.id}`)}
        sx={{
          ...sharedCardSx,
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'row',
          height: 200,
          minHeight: 200,
          maxHeight: 200,
        }}
      >
        {/* Left: info */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 1.25,
            p: '20px 24px',
            flexShrink: 0,
            width: '42%',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <Tooltip title={list.name} placement="top" arrow>
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                fontWeight: 800,
                fontSize: 18,
                color: '#fff',
                lineHeight: 1.25,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {list.name}
            </Typography>
          </Tooltip>

          {list.description && (
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                fontSize: 12,
                color: 'rgba(255,255,255,0.4)',
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
            label={
              list.books.length === 1
                ? t('lists.card.books', { count: list.books.length })
                : t('lists.card.books.plural', { count: list.books.length })
            }
            size="small"
            sx={chipSx}
          />

          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mt: 0.5 }}
          >
            <DonutChart percent={readPercent} size={44} />
            <Box>
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#a855f7',
                  lineHeight: 1.2,
                }}
              >
                {readPercent}%
              </Typography>
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.35)',
                  lineHeight: 1.3,
                }}
              >
                {t('lists.card.read', {
                  done: readCount,
                  total: list.books.length,
                })}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right: fanned covers */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          {coverUrls.map((url, i) => {
            const angle = FAN_ANGLES[i] ?? 0;
            const zIndex =
              coverUrls.length - Math.abs(Math.round(coverUrls.length / 2) - i);
            return (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '50%',
                  width: COVER_W,
                  height: COVER_H,
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                  transformOrigin: 'bottom center',
                  zIndex,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.55)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: { sm: i < 3 ? 'block' : 'none', md: 'block' },
                }}
              >
                {url ? (
                  <Image
                    src={url}
                    alt=""
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="120px"
                    unoptimized
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      background: 'rgba(168,85,247,0.06)',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </MotionBox>
    </>
  );
};
