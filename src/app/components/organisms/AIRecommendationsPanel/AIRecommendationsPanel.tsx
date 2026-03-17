'use client';

import React, { useEffect, useRef, useState, KeyboardEvent } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  Fab,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  useBookRecommendations,
  AIMessage,
} from '@/hooks/useBookRecommendations';
import { User } from '@/domain/user.model';
import { lora } from '@/utils/fonts/fonts';

interface Props {
  currentUserId: string;
  currentUser: User;
  mode?: 'recommend' | 'discover';
  targetUserId?: string;
  targetUser?: User;
}

const PANEL_WIDTH = 420;

const mdComponents = {
  p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <Typography
      component="p"
      sx={{
        fontSize: '0.85rem',
        lineHeight: 1.65,
        color: 'rgba(255,255,255,0.92)',
        fontFamily: lora.style.fontFamily,
        mb: 0.75,
        mt: 0,
      }}
    >
      {children}
    </Typography>
  ),
  strong: ({ children }: React.HTMLAttributes<HTMLElement>) => (
    <strong
      style={{ color: '#e9d5ff', fontWeight: 700, fontFamily: 'inherit' }}
    >
      {children}
    </strong>
  ),
  em: ({ children }: React.HTMLAttributes<HTMLElement>) => (
    <em style={{ color: 'rgba(233,213,255,0.85)', fontFamily: 'inherit' }}>
      {children}
    </em>
  ),
  ul: ({ children }: React.HTMLAttributes<HTMLUListElement>) => (
    <Box component="ul" sx={{ pl: 2.5, my: 0.5, '& li': { mb: 0.5 } }}>
      {children}
    </Box>
  ),
  ol: ({ children }: React.HTMLAttributes<HTMLOListElement>) => (
    <Box component="ol" sx={{ pl: 2.5, my: 0.5, '& li': { mb: 0.5 } }}>
      {children}
    </Box>
  ),
  li: ({ children }: React.HTMLAttributes<HTMLLIElement>) => (
    <Typography
      component="li"
      sx={{
        fontSize: '0.85rem',
        lineHeight: 1.65,
        color: 'rgba(255,255,255,0.92)',
        fontFamily: lora.style.fontFamily,
      }}
    >
      {children}
    </Typography>
  ),
  h1: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Typography
      component="h1"
      sx={{
        fontSize: '1rem',
        fontWeight: 700,
        color: '#e9d5ff',
        fontFamily: lora.style.fontFamily,
        mb: 0.5,
        mt: 1,
      }}
    >
      {children}
    </Typography>
  ),
  h2: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Typography
      component="h2"
      sx={{
        fontSize: '0.95rem',
        fontWeight: 700,
        color: '#e9d5ff',
        fontFamily: lora.style.fontFamily,
        mb: 0.5,
        mt: 1,
      }}
    >
      {children}
    </Typography>
  ),
  h3: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Typography
      component="h3"
      sx={{
        fontSize: '0.9rem',
        fontWeight: 700,
        color: '#e9d5ff',
        fontFamily: lora.style.fontFamily,
        mb: 0.5,
        mt: 0.75,
      }}
    >
      {children}
    </Typography>
  ),
  hr: () => <Divider sx={{ borderColor: 'rgba(147,51,234,0.25)', my: 1 }} />,
};

function MessageBubble({ message }: { message: AIMessage }) {
  const isAssistant = message.role === 'assistant';
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isAssistant ? 'flex-start' : 'flex-end',
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          maxWidth: '85%',
          px: 2,
          py: 1.25,
          borderRadius: isAssistant
            ? '4px 16px 16px 16px'
            : '16px 4px 16px 16px',
          background: isAssistant
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(147,51,234,0.2)',
          border: '1px solid',
          borderColor: isAssistant
            ? 'rgba(255,255,255,0.09)'
            : 'rgba(147,51,234,0.35)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          {isAssistant && !message.content ? (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ py: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'rgba(168,85,247,0.8)',
                    animation: 'pulse 1.2s infinite',
                    animationDelay: `${i * 0.2}s`,
                    '@keyframes pulse': {
                      '0%, 80%, 100%': {
                        opacity: 0.3,
                        transform: 'scale(0.8)',
                      },
                      '40%': { opacity: 1, transform: 'scale(1)' },
                    },
                  }}
                />
              ))}
            </Stack>
          ) : isAssistant ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={mdComponents}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <Typography
              sx={{
                fontSize: '0.85rem',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.92)',
                fontFamily: lora.style.fontFamily,
              }}
            >
              {message.content}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function AIRecommendationsPanel({
  currentUserId,
  currentUser,
  mode = 'recommend',
  targetUserId,
  targetUser,
}: Props) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  const isDiscover = mode === 'discover';
  const headerUser = isDiscover ? currentUser : (targetUser ?? currentUser);

  const {
    messages,
    isLoading,
    error,
    getRecommendations,
    getDiscoverRecommendations,
    askQuestion,
    askDiscoverQuestion,
    retry,
  } = useBookRecommendations();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleOpen = () => {
    setOpen(true);
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      if (isDiscover) {
        getDiscoverRecommendations(currentUserId);
      } else {
        getRecommendations(targetUserId!, currentUserId, targetUser!.username);
      }
    }
  };

  const handleClose = () => setOpen(false);

  const handleSend = async () => {
    const q = inputValue.trim();
    if (!q || isLoading) return;
    setInputValue('');
    if (isDiscover) {
      await askDiscoverQuestion(q, currentUserId);
    } else {
      await askQuestion(q, targetUserId!, currentUserId, targetUser!.username);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const tooltipLabel = isDiscover
    ? 'Discover new books with AI'
    : 'AI Book Recommendations';
  const headerLabel = isDiscover ? 'Book Discoverer' : 'AI Book Advisor';
  const inputPlaceholder = isDiscover
    ? 'Ask for a genre, mood, or author style…'
    : 'Ask about a book, genre, or mood…';

  return (
    <>
      <Tooltip title={tooltipLabel} placement="left">
        <Fab
          onClick={handleOpen}
          size="medium"
          sx={{
            position: 'fixed',
            bottom: { xs: 80, sm: 32 },
            right: { xs: 16, sm: 32 },
            zIndex: 1200,
            background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
            color: '#fff',
            boxShadow: '0 4px 24px rgba(147,51,234,0.45)',
            '&:hover': {
              background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
              boxShadow: '0 6px 28px rgba(168,85,247,0.55)',
            },
          }}
        >
          <AutoStoriesRoundedIcon fontSize="small" />
        </Fab>
      </Tooltip>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: lora.className,
          sx: {
            width: { xs: '100vw', sm: PANEL_WIDTH },
            background: 'rgba(10, 10, 10, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderLeft: '1px solid rgba(147,51,234,0.18)',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            px: 2,
            py: 1.5,
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(147,51,234,0.18)',
            flexShrink: 0,
          }}
        >
          <Avatar
            src={headerUser.picture}
            alt={headerUser.username}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid rgba(147,51,234,0.5)',
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'rgba(255,255,255,0.95)',
                fontFamily: lora.style.fontFamily,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {headerUser.username}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AutoAwesomeRoundedIcon sx={{ fontSize: 11, color: '#c084fc' }} />
              <Typography
                variant="caption"
                sx={{
                  color: '#c084fc',
                  fontSize: '0.7rem',
                  fontFamily: lora.style.fontFamily,
                }}
              >
                {headerLabel}
              </Typography>
            </Stack>
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: 'rgba(255,255,255,0.5)',
              '&:hover': { color: '#fff' },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(147,51,234,0.15)' }} />

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 2,
            py: 2,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(147,51,234,0.3)',
              borderRadius: 2,
            },
          }}
        >
          {/* Empty / loading / error state */}
          {messages.length === 0 && isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <CircularProgress size={28} sx={{ color: '#9333ea' }} />
            </Box>
          )}
          {messages.length === 0 && !isLoading && !error && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 1.5,
                opacity: 0.4,
              }}
            >
              <AutoStoriesRoundedIcon sx={{ fontSize: 48, color: '#9333ea' }} />
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  textAlign: 'center',
                  fontFamily: lora.style.fontFamily,
                }}
              >
                Ready when you are…
              </Typography>
            </Box>
          )}
          {error && (
            <Box
              sx={{
                mx: 1,
                mt: 2,
                p: 2,
                borderRadius: 2,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.82rem',
                  color: 'rgba(252,165,165,0.9)',
                  mb: 1,
                  fontFamily: lora.style.fontFamily,
                }}
              >
                {error}
              </Typography>
              <Box
                component="button"
                onClick={retry}
                disabled={isLoading}
                sx={{
                  background: 'rgba(147,51,234,0.2)',
                  border: '1px solid rgba(147,51,234,0.4)',
                  borderRadius: 1.5,
                  color: '#c084fc',
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.78rem',
                  fontFamily: lora.style.fontFamily,
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(147,51,234,0.3)' },
                  '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
                }}
              >
                Try again
              </Box>
            </Box>
          )}
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Divider sx={{ borderColor: 'rgba(147,51,234,0.15)' }} />

        {/* Input */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-end"
          sx={{
            px: 2,
            py: 1.5,
            flexShrink: 0,
            background: 'rgba(0,0,0,0.35)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.85rem',
                fontFamily: lora.style.fontFamily,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(147,51,234,0.5)',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255,255,255,0.3)',
                opacity: 1,
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            sx={{
              width: 38,
              height: 38,
              flexShrink: 0,
              background:
                inputValue.trim() && !isLoading
                  ? 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)'
                  : 'rgba(147,51,234,0.15)',
              color:
                inputValue.trim() && !isLoading
                  ? '#fff'
                  : 'rgba(147,51,234,0.4)',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                background:
                  inputValue.trim() && !isLoading
                    ? 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)'
                    : 'rgba(147,51,234,0.2)',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress
                size={16}
                sx={{ color: 'rgba(147,51,234,0.6)' }}
              />
            ) : (
              <SendRoundedIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </Stack>
      </Drawer>
    </>
  );
}
