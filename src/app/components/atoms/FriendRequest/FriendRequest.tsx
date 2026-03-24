import { User } from '@/domain/friend.model';
import { ECommands } from '@/utils/constants/ECommands';
import { lora } from '@/utils/fonts/fonts';
import { Check, Close } from '@mui/icons-material';
import { Box, CircularProgress, IconButton } from '@mui/material';
import Image from 'next/image';

interface FriendRequestProps {
  user: User | null;
  handleManageRequest: (requestId: string, command: ECommands) => Promise<void>;
  isLoadingManageRequest: (requestId: string) => boolean;
  requestId: string;
}

export default function FriendRequest({
  user,
  handleManageRequest,
  isLoadingManageRequest,
  requestId,
}: FriendRequestProps) {
  const isThisRequestLoading = isLoadingManageRequest(requestId);

  return (
    <Box
      component="a"
      href={`/users/${user?.id}`}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(147, 51, 234, 0.1)',
        borderRadius: '12px',
        padding: '10px 12px',
        width: '100%',
        position: 'relative',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          border: '1px solid rgba(147, 51, 234, 0.3)',
          background: 'rgba(147, 51, 234, 0.05)',
        },
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          flexShrink: 0,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '1.5px solid rgba(147, 51, 234, 0.35)',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={user?.picture || ''}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
          alt={user?.username || ''}
          width={44}
          height={44}
        />
      </Box>

      {/* Username */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.88)',
          fontFamily: lora.style.fontFamily,
          fontSize: { xs: 14, md: 15 },
          letterSpacing: '0.02rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {user?.username || ''}
      </Box>

      {/* Actions */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '6px',
          flexShrink: 0,
        }}
        onClick={(e) => e.preventDefault()}
      >
        {isThisRequestLoading ? (
          <CircularProgress size={20} sx={{ color: 'rgba(147,51,234,0.6)' }} />
        ) : (
          <>
            <IconButton
              size="small"
              sx={{
                background: 'rgba(147, 51, 234, 0.12)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                color: 'rgba(192, 132, 252, 0.9)',
                width: 30,
                height: 30,
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'rgba(147, 51, 234, 0.25)',
                  border: '1px solid rgba(147, 51, 234, 0.6)',
                  color: '#c084fc',
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                handleManageRequest(requestId, ECommands.ACCEPT);
              }}
              disabled={isThisRequestLoading}
            >
              <Check sx={{ fontSize: '15px' }} />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255, 255, 255, 0.4)',
                width: 30,
                height: 30,
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'rgba(255, 82, 82, 0.1)',
                  border: '1px solid rgba(255, 82, 82, 0.3)',
                  color: 'rgba(255, 100, 100, 0.8)',
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                handleManageRequest(requestId, ECommands.DENY);
              }}
              disabled={isThisRequestLoading}
            >
              <Close sx={{ fontSize: '15px' }} />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
}
