'use client';

import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { Box, ButtonBase, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { DURATION, EASE_OUT } from './tokens';

const LIKE_COLOR = '#e74c6f';

interface LikeButtonProps {
  isLiked: boolean;
  count: number;
  disabled?: boolean;
  onClick: (e: React.MouseEvent) => void;
  /** Tamaño del icono en px. */
  size?: number;
  label: string;
}

/**
 * Botón de "me gusta" de las actividades.
 *
 * Al marcarlo: el corazón late, sale un anillo y seis chispas, y el contador
 * entra desde abajo. Al desmarcarlo solo encoge y el contador sale hacia abajo.
 * La animación solo se lanza con el clic del usuario, no al pintar la lista.
 */
export const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  count,
  disabled,
  onClick,
  size = 16,
  label,
}) => {
  // Cada "me gusta" nuevo reinicia la animación del estallido.
  const [burstKey, setBurstKey] = useState(0);
  const wasLiked = useRef(isLiked);
  const userAction = useRef(false);
  // Hasta el primer clic el corazón no se anima (si no, latirían todos al cargar).
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (userAction.current && isLiked && !wasLiked.current) {
      setBurstKey((k) => k + 1);
    }
    wasLiked.current = isLiked;
    userAction.current = false;
  }, [isLiked]);

  const handleClick = (e: React.MouseEvent) => {
    userAction.current = true;
    setInteracted(true);
    onClick(e);
  };

  const box = size + 12;

  return (
    <ButtonBase
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={isLiked}
      aria-label={label}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        borderRadius: 999,
        pr: count > 0 ? 1 : 0,
        color: isLiked ? LIKE_COLOR : 'rgba(255, 255, 255, 0.35)',
        transition: `color ${DURATION.base}s, background-color ${DURATION.base}s`,
        '&:hover': {
          backgroundColor: 'rgba(231, 76, 111, 0.08)',
          color: isLiked ? LIKE_COLOR : 'rgba(255, 255, 255, 0.6)',
        },
        '&.Mui-focusVisible': {
          outline: `2px solid ${LIKE_COLOR}80`,
          outlineOffset: 2,
        },
        '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.2)' },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: box,
          height: box,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {/* Anillo y chispas: solo tras un clic que marca */}
        <AnimatePresence>
          {burstKey > 0 && (
            <React.Fragment key={burstKey}>
              <motion.span
                aria-hidden
                initial={{ scale: 0.3, opacity: 0.9 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `1.5px solid ${LIKE_COLOR}`,
                  pointerEvents: 'none',
                }}
              />
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                const distance = box * 0.8;
                return (
                  <motion.span
                    key={i}
                    aria-hidden
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance,
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.55, ease: EASE_OUT }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: 4,
                      height: 4,
                      marginTop: -2,
                      marginLeft: -2,
                      borderRadius: '50%',
                      background: i % 2 ? '#c084fc' : LIKE_COLOR,
                      pointerEvents: 'none',
                    }}
                  />
                );
              })}
            </React.Fragment>
          )}
        </AnimatePresence>

        <motion.span
          key={isLiked ? 'on' : 'off'}
          initial={interacted ? { scale: isLiked ? 0.4 : 1.15 } : false}
          animate={{ scale: 1 }}
          transition={
            isLiked
              ? { type: 'spring', stiffness: 520, damping: 14 }
              : { duration: DURATION.base, ease: EASE_OUT }
          }
          style={{ display: 'grid', placeItems: 'center' }}
        >
          {isLiked ? (
            <FavoriteRoundedIcon sx={{ fontSize: size }} />
          ) : (
            <FavoriteBorderRoundedIcon sx={{ fontSize: size }} />
          )}
        </motion.span>
      </Box>

      {/* Contador que rueda en vertical */}
      <Box
        component="span"
        sx={{
          position: 'relative',
          display: 'inline-flex',
          overflow: 'hidden',
          height: '1.2em',
          fontSize: size < 16 ? '0.65rem' : '0.7rem',
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ y: isLiked ? '100%' : '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: isLiked ? '-100%' : '100%', opacity: 0 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
              style={{ display: 'inline-block' }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: 'inherit',
                  fontWeight: 500,
                  lineHeight: '1.2em',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'inherit',
                }}
              >
                {count}
              </Typography>
            </motion.span>
          )}
        </AnimatePresence>
      </Box>
    </ButtonBase>
  );
};
