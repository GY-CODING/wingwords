import { useTranslation } from '@/lib/i18n/I18nProvider';
import { User } from '@/domain/user.model';
import { lora } from '@/utils/fonts/fonts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, ClickAwayListener, Grow, Paper, Popper } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
interface ProfileProps {
  user?: User;
}

export default function Profile({ user }: ProfileProps): JSX.Element {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: '48px',
      }}
    >
      <Box
        ref={anchorRef}
        onClick={handleToggle}
        sx={{
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '50%',
        }}
      >
        <Image
          src={user?.picture || ''}
          className="rounded-full"
          style={{
            width: '48px',
            height: '48px',
            aspectRatio: '1/1',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(147, 51, 234, 0.25)',
            transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
            zIndex: 1000,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLImageElement).style.borderColor =
              'rgba(192, 132, 252, 0.7)';
            (e.currentTarget as HTMLImageElement).style.boxShadow =
              '0 0 10px rgba(147, 51, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLImageElement).style.borderColor =
              'rgba(147, 51, 234, 0.25)';
            (e.currentTarget as HTMLImageElement).style.boxShadow = 'none';
          }}
          alt={user?.username || ''}
          width={100}
          height={100}
        />
      </Box>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
        sx={{
          zIndex: 1000,
        }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper
              sx={{
                background: 'rgba(12, 12, 16, 0.97)',
                backdropFilter: 'blur(24px)',
                color: 'white',
                borderRadius: '14px',
                marginTop: '10px',
                width: '220px',
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(147,51,234,0.15)',
                border: '1px solid rgba(147, 51, 234, 0.12)',
                overflow: 'hidden',
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Header con usuario */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 2,
                      py: 1.5,
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Image
                      src={user?.picture || ''}
                      alt={user?.username || ''}
                      width={32}
                      height={32}
                      style={{
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid rgba(147,51,234,0.3)',
                      }}
                    />
                    <Box>
                      <Box
                        sx={{
                          fontFamily: lora.style.fontFamily,
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.9)',
                          fontWeight: 600,
                        }}
                      >
                        {user?.username}
                      </Box>
                      <Box
                        sx={{
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.35)',
                          fontFamily: lora.style.fontFamily,
                        }}
                      >
                        {user?.email}
                      </Box>
                    </Box>
                  </Box>

                  {/* Items */}
                  <Box sx={{ p: '6px' }}>
                    <Link
                      href="/profile"
                      style={{ textDecoration: 'none' }}
                      onClick={() => handleClose(new Event('click'))}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          px: 1.5,
                          py: 1,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          '&:hover': {
                            backgroundColor: 'rgba(147, 51, 234, 0.1)',
                          },
                        }}
                      >
                        <AccountCircleIcon
                          sx={{
                            fontSize: '18px',
                            color: 'rgba(192,132,252,0.8)',
                          }}
                        />
                        <Box
                          sx={{
                            fontFamily: lora.style.fontFamily,
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.75)',
                          }}
                        >
                          {t('nav.profile')}
                        </Box>
                      </Box>
                    </Link>

                    <Box
                      sx={{
                        my: '4px',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                      }}
                    />

                    <a
                      href="/auth/logout?federated=true"
                      style={{ textDecoration: 'none' }}
                      onClick={() => handleClose(new Event('click'))}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          px: 1.5,
                          py: 1,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 82, 82, 0.08)',
                          },
                        }}
                      >
                        <Image
                          src="/logout-red.svg"
                          alt="logout"
                          width={16}
                          height={16}
                        />
                        <Box
                          sx={{
                            fontFamily: lora.style.fontFamily,
                            fontSize: '13px',
                            color: 'rgba(255, 100, 100, 0.8)',
                          }}
                        >
                          {t('nav.logout')}
                        </Box>
                      </Box>
                    </a>
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
