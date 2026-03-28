'use client';

import React, { useRef } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Slide,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Image from 'next/image';
import { lora } from '@/utils/fonts/fonts';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import type HardcoverBook from '@/domain/HardcoverBook';
import { GoodreadsShelf } from '@/utils/goodreadsParser';
import type {
  ImportBookResult,
  ImportStatus,
} from '../../hooks/useGoodreadsImport';
import type {
  SaveProgress,
  SaveStatus,
} from '../../hooks/useGoodreadsImportSave';

const SlideUp = React.forwardRef<
  unknown,
  TransitionProps & { children: React.ReactElement }
>(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface GoodreadsImportModalProps {
  open: boolean;
  onClose: () => void;
  status: ImportStatus;
  results: ImportBookResult[];
  progress: { current: number; total: number };
  errorMessage: string | null;
  shelfFilter: GoodreadsShelf | 'all';
  onShelfFilterChange: (shelf: GoodreadsShelf | 'all') => void;
  onFileUpload: (file: File) => void;
  onSelectCandidate: (
    goodreadsId: string,
    candidate: HardcoverBook | null
  ) => void;
  onToggleSkipped: (goodreadsId: string) => void;
  onReset: () => void;
  onImport?: (selected: ImportBookResult[]) => void;
  saveStatus?: SaveStatus;
  saveProgress?: SaveProgress;
  saveError?: string | null;
  libraryBookIds?: Set<string>;
  importSource?: 'goodreads' | 'hardcover';
}

const SHELF_LABELS: Record<GoodreadsShelf | 'all', string> = {
  all: 'All',
  read: 'Read',
  'to-read': 'To Read',
  'currently-reading': 'Reading',
};

export const GoodreadsImportModal: React.FC<GoodreadsImportModalProps> = ({
  open,
  onClose,
  status,
  results,
  progress,
  errorMessage,
  shelfFilter,
  onShelfFilterChange,
  onFileUpload,
  onSelectCandidate,
  onToggleSkipped,
  onReset,
  onImport,
  saveStatus = 'idle',
  saveProgress = {
    current: 0,
    total: 0,
    successCount: 0,
    errorCount: 0,
    failedTitles: [],
  },
  saveError = null,
  libraryBookIds,
  importSource = 'goodreads',
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fileInputRef = useRef<HTMLInputElement>(
    null
  ) as React.RefObject<HTMLInputElement>;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
    // Reset input so same file can be re-uploaded
    e.target.value = '';
  };

  const filteredResults = results.filter(
    (r) => shelfFilter === 'all' || r.source.shelf === shelfFilter
  );

  // Split into found (has at least one candidate) and not found
  const foundResults = filteredResults.filter((r) => r.candidates.length > 0);
  const notFoundResults = filteredResults.filter(
    (r) => r.candidates.length === 0
  );

  // Books ready to import: have a matched candidate and are not skipped
  const selectedResults = filteredResults.filter(
    (r) => !r.skipped && r.selectedCandidate !== null
  );
  const selectableCount = filteredResults.filter(
    (r) => r.selectedCandidate !== null
  ).length;
  const allSelected =
    selectableCount > 0 && selectedResults.length === selectableCount;

  const alreadyInLibraryCount = selectedResults.filter((r) =>
    libraryBookIds?.has(r.selectedCandidate?.id ?? '')
  ).length;

  const handleSelectAll = () => {
    filteredResults.forEach((r) => {
      if (r.selectedCandidate === null) return;
      if (allSelected && !r.skipped) onToggleSkipped(r.source.goodreadsId);
      if (!allSelected && r.skipped) onToggleSkipped(r.source.goodreadsId);
    });
  };

  const isSearching = status === 'searching';
  const isDone = status === 'done';
  const isSaving = saveStatus === 'saving';
  const isSaved = saveStatus === 'done';
  const hasSaveError = saveStatus === 'error';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={isMobile ? SlideUp : undefined}
      sx={{
        ...(isMobile && {
          '& .MuiDialog-container': {
            alignItems: 'flex-end',
          },
        }),
      }}
      PaperProps={{
        sx: {
          background: 'rgba(18, 10, 30, 0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(147, 51, 234, 0.2)',
          ...(isMobile
            ? {
                borderRadius: '24px 24px 0 0',
                maxHeight: '92vh',
                margin: 0,
                maxWidth: '100% !important',
                width: '100%',
              }
            : {
                borderRadius: '20px',
                maxHeight: '90vh',
              }),
        },
      }}
    >
      {isMobile && (
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.15)',
            mx: 'auto',
            mt: 1.5,
            mb: 0.5,
          }}
        />
      )}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <FileUploadIcon sx={{ color: '#a855f7', fontSize: 24 }} />
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              fontWeight: 700,
              fontSize: 20,
              color: '#fff',
            }}
          >
            Import CSV
          </Typography>
          {status === 'idle' ? (
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              <Chip
                label="Goodreads"
                size="small"
                sx={{
                  background: 'rgba(236,109,80,0.1)',
                  color: '#f6a98a',
                  border: '1px solid rgba(236,109,80,0.25)',
                  height: 20,
                  fontSize: 11,
                  fontFamily: lora.style.fontFamily,
                }}
              />
              <Chip
                label="Hardcover"
                size="small"
                sx={{
                  background: 'rgba(99,179,237,0.1)',
                  color: '#90cdf4',
                  border: '1px solid rgba(99,179,237,0.25)',
                  height: 20,
                  fontSize: 11,
                  fontFamily: lora.style.fontFamily,
                }}
              />
            </Box>
          ) : (
            <Chip
              label={
                importSource === 'hardcover'
                  ? 'Hardcover detected'
                  : 'Goodreads detected'
              }
              size="small"
              sx={{
                background:
                  importSource === 'hardcover'
                    ? 'rgba(99,179,237,0.1)'
                    : 'rgba(236,109,80,0.1)',
                color: importSource === 'hardcover' ? '#90cdf4' : '#f6a98a',
                border:
                  importSource === 'hardcover'
                    ? '1px solid rgba(99,179,237,0.25)'
                    : '1px solid rgba(236,109,80,0.25)',
                height: 20,
                fontSize: 11,
                fontFamily: lora.style.fontFamily,
              }}
            />
          )}
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        {/* Step 1: Upload */}
        {status === 'idle' && (
          <UploadStep
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
          />
        )}

        {/* Parsing */}
        {status === 'parsing' && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              py: 4,
            }}
          >
            <CircularProgress sx={{ color: '#a855f7' }} />
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.6)',
                fontFamily: lora.style.fontFamily,
              }}
            >
              Parsing CSV…
            </Typography>
          </Box>
        )}

        {/* Error */}
        {status === 'error' && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              py: 4,
            }}
          >
            <Typography
              sx={{ color: '#f87171', fontFamily: lora.style.fontFamily }}
            >
              {errorMessage ?? 'Something went wrong.'}
            </Typography>
            <Button
              variant="outlined"
              onClick={onReset}
              sx={{ borderColor: 'rgba(147,51,234,0.4)', color: '#e9d5ff' }}
            >
              Try again
            </Button>
          </Box>
        )}

        {/* Saving */}
        {isSaving && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              py: 4,
            }}
          >
            <CircularProgress sx={{ color: '#a855f7' }} />
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.6)',
                fontFamily: lora.style.fontFamily,
              }}
            >
              Saving to your library…
            </Typography>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 12,
                    fontFamily: lora.style.fontFamily,
                  }}
                >
                  {saveProgress.successCount} saved · {saveProgress.errorCount}{' '}
                  failed
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 12,
                    fontFamily: lora.style.fontFamily,
                  }}
                >
                  {saveProgress.current} / {saveProgress.total}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  saveProgress.total > 0
                    ? (saveProgress.current / saveProgress.total) * 100
                    : 0
                }
                sx={{
                  borderRadius: 4,
                  bgcolor: 'rgba(147,51,234,0.12)',
                  '& .MuiLinearProgress-bar': { bgcolor: '#a855f7' },
                }}
              />
            </Box>
          </Box>
        )}

        {/* Save done */}
        {isSaved && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              py: 4,
            }}
          >
            <CheckCircleIcon sx={{ color: '#34d399', fontSize: 48 }} />
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                fontWeight: 700,
                fontSize: 18,
                color: '#fff',
              }}
            >
              Import complete!
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {saveProgress.successCount > 0 && (
                <Chip
                  label={`${saveProgress.successCount} saved`}
                  sx={{
                    background: 'rgba(52,211,153,0.12)',
                    color: '#34d399',
                    border: '1px solid rgba(52,211,153,0.3)',
                    fontFamily: lora.style.fontFamily,
                  }}
                />
              )}
              {saveProgress.errorCount > 0 && (
                <Chip
                  label={`${saveProgress.errorCount} failed`}
                  sx={{
                    background: 'rgba(248,113,113,0.1)',
                    color: '#f87171',
                    border: '1px solid rgba(248,113,113,0.3)',
                    fontFamily: lora.style.fontFamily,
                  }}
                />
              )}
            </Box>

            {/* Failed titles list */}
            {saveProgress.failedTitles &&
              saveProgress.failedTitles.length > 0 && (
                <Box
                  sx={{
                    width: '100%',
                    borderRadius: '10px',
                    background: 'rgba(248,113,113,0.06)',
                    border: '1px solid rgba(248,113,113,0.18)',
                    p: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: '#f87171',
                      fontSize: 12,
                      fontFamily: lora.style.fontFamily,
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    Could not be saved:
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
                  >
                    {saveProgress.failedTitles.map((title) => (
                      <Box
                        key={title}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                        }}
                      >
                        <BlockIcon
                          sx={{ color: '#f87171', fontSize: 13, flexShrink: 0 }}
                        />
                        <Typography
                          sx={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: 12,
                            fontFamily: lora.style.fontFamily,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {title}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: 'rgba(147,51,234,0.4)',
                color: '#e9d5ff',
                fontFamily: lora.style.fontFamily,
                textTransform: 'none',
              }}
            >
              Close
            </Button>
          </Box>
        )}

        {/* Save error */}
        {hasSaveError && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              py: 4,
            }}
          >
            <Typography
              sx={{ color: '#f87171', fontFamily: lora.style.fontFamily }}
            >
              {saveError ?? 'Import failed.'}
            </Typography>
            <Button
              variant="outlined"
              onClick={onReset}
              sx={{
                borderColor: 'rgba(147,51,234,0.4)',
                color: '#e9d5ff',
                fontFamily: lora.style.fontFamily,
                textTransform: 'none',
              }}
            >
              Try again
            </Button>
          </Box>
        )}

        {/* Searching / Done */}
        {(isSearching || isDone) && !isSaving && !isSaved && !hasSaveError && (
          <>
            {/* Progress bar */}
            {isSearching && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      mt: 2,
                      fontFamily: lora.style.fontFamily,
                    }}
                  >
                    {importSource === 'hardcover'
                      ? 'Fetching your Hardcover library…'
                      : 'Searching Hardcover…'}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      fontFamily: lora.style.fontFamily,
                    }}
                  >
                    {progress.current} / {progress.total}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    progress.total > 0
                      ? (progress.current / progress.total) * 100
                      : 0
                  }
                  sx={{
                    borderRadius: 4,
                    bgcolor: 'rgba(147,51,234,0.12)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#a855f7' },
                  }}
                />
              </Box>
            )}

            {/* Shelf filter */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
                pt: 2,
              }}
            >
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 13,
                  fontFamily: lora.style.fontFamily,
                }}
              >
                Filter:
              </Typography>
              <ToggleButtonGroup
                value={shelfFilter}
                exclusive
                onChange={(_, val) => val && onShelfFilterChange(val)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    color: 'rgba(255,255,255,0.5)',
                    borderColor: 'rgba(147,51,234,0.2)',
                    fontFamily: lora.style.fontFamily,
                    fontSize: 12,
                    py: 0.4,
                    px: 1.5,
                    '&.Mui-selected': {
                      color: '#e9d5ff',
                      background: 'rgba(147,51,234,0.2)',
                      borderColor: 'rgba(147,51,234,0.5)',
                    },
                  },
                }}
              >
                {(['all', 'read', 'to-read', 'currently-reading'] as const).map(
                  (s) => (
                    <ToggleButton key={s} value={s}>
                      {SHELF_LABELS[s]}
                    </ToggleButton>
                  )
                )}
              </ToggleButtonGroup>

              {isDone && (
                <Box
                  sx={{
                    ml: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Button
                    size="small"
                    onClick={handleSelectAll}
                    sx={{
                      color: 'rgba(255,255,255,0.4)',
                      fontFamily: lora.style.fontFamily,
                      fontSize: 11,
                      minWidth: 0,
                      textTransform: 'none',
                      '&:hover': { color: '#e9d5ff' },
                    }}
                  >
                    {allSelected ? 'Deselect all' : 'Select all'}
                  </Button>
                  <Chip
                    label={`${selectedResults.length} selected`}
                    size="small"
                    sx={{
                      background: 'rgba(52,211,153,0.12)',
                      color: '#34d399',
                      border: '1px solid rgba(52,211,153,0.3)',
                      fontFamily: lora.style.fontFamily,
                    }}
                  />
                </Box>
              )}
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            {/* Results list */}
            <Box
              sx={{
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                maxHeight: '50vh',
                pr: 0.5,
              }}
            >
              {filteredResults.length === 0 && (
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: lora.style.fontFamily,
                    textAlign: 'center',
                    py: 4,
                  }}
                >
                  No books in this shelf.
                </Typography>
              )}
              {foundResults.map((result) => (
                <BookResultRow
                  key={result.source.goodreadsId}
                  result={result}
                  onSelectCandidate={onSelectCandidate}
                  onToggleSkipped={onToggleSkipped}
                  libraryBookIds={libraryBookIds}
                />
              ))}

              {/* Not found on Hardcover — only show after search is done */}
              {isDone && notFoundResults.length > 0 && (
                <Box
                  sx={{
                    mt: 1,
                    borderTop: '1px solid rgba(248,113,113,0.15)',
                    pt: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <BlockIcon sx={{ color: '#f87171', fontSize: 16 }} />
                    <Typography
                      sx={{
                        color: '#f87171',
                        fontSize: 13,
                        fontFamily: lora.style.fontFamily,
                        fontWeight: 600,
                      }}
                    >
                      Not found on Hardcover ({notFoundResults.length})
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}
                  >
                    {notFoundResults.map((r) => (
                      <Box
                        key={r.source.goodreadsId}
                        sx={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 1,
                          px: 1.5,
                          py: 0.75,
                          borderRadius: '8px',
                          background: 'rgba(248,113,113,0.05)',
                          border: '1px solid rgba(248,113,113,0.12)',
                        }}
                      >
                        <Typography
                          sx={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: 13,
                            fontFamily: lora.style.fontFamily,
                            fontWeight: 600,
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {r.source.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: 'rgba(255,255,255,0.35)',
                            fontSize: 12,
                            fontFamily: lora.style.fontFamily,
                            flexShrink: 0,
                          }}
                        >
                          {r.source.author}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Footer */}
            {isDone && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pt: 1,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="text"
                  onClick={onReset}
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: lora.style.fontFamily,
                    fontSize: 13,
                    textTransform: 'none',
                  }}
                >
                  Upload another file
                </Button>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 0.5,
                  }}
                >
                  {alreadyInLibraryCount > 0 && (
                    <Typography
                      sx={{
                        color: 'rgba(129,140,248,0.8)',
                        fontSize: 11,
                        fontFamily: lora.style.fontFamily,
                      }}
                    >
                      {alreadyInLibraryCount} already in your library (data will
                      be updated)
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    disabled={selectedResults.length === 0 || isSaving}
                    onClick={() => onImport?.(selectedResults)}
                    sx={{
                      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      color: '#fff',
                      fontFamily: lora.style.fontFamily,
                      fontWeight: 600,
                      borderRadius: '10px',
                      textTransform: 'none',
                      px: 3,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #6d28d9, #9333ea)',
                      },
                      '&.Mui-disabled': {
                        background: 'rgba(147,51,234,0.15)',
                        color: 'rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    Import {selectedResults.length} book
                    {selectedResults.length !== 1 ? 's' : ''}
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

interface UploadStepProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({
  fileInputRef,
  onFileChange,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      py: 4,
    }}
  >
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: 'rgba(147,51,234,0.1)',
        border: '2px dashed rgba(147,51,234,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FileUploadIcon sx={{ color: '#a855f7', fontSize: 32 }} />
    </Box>
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        sx={{
          fontFamily: lora.style.fontFamily,
          fontWeight: 600,
          fontSize: 18,
          color: '#fff',
          mb: 1,
        }}
      >
        Upload your library export
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1.5 }}>
        <Chip
          label="Goodreads"
          size="small"
          sx={{
            background: 'rgba(236,109,80,0.1)',
            color: '#f6a98a',
            border: '1px solid rgba(236,109,80,0.25)',
            fontFamily: lora.style.fontFamily,
            fontSize: 12,
          }}
        />
        <Chip
          label="Hardcover"
          size="small"
          sx={{
            background: 'rgba(99,179,237,0.1)',
            color: '#90cdf4',
            border: '1px solid rgba(99,179,237,0.25)',
            fontFamily: lora.style.fontFamily,
            fontSize: 12,
          }}
        />
      </Box>
      <Typography
        sx={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: 13,
          fontFamily: lora.style.fontFamily,
        }}
      >
        The format is detected automatically.
      </Typography>
    </Box>
    <input
      ref={fileInputRef}
      type="file"
      accept=".csv,text/csv,text/plain,application/csv"
      style={{ display: 'none' }}
      onChange={onFileChange}
    />
    <Button
      variant="contained"
      onClick={() => fileInputRef.current?.click()}
      sx={{
        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
        color: '#fff',
        fontFamily: lora.style.fontFamily,
        fontWeight: 600,
        borderRadius: '12px',
        px: 4,
        py: 1.2,
        '&:hover': { background: 'linear-gradient(135deg, #6d28d9, #9333ea)' },
      }}
    >
      Choose CSV file
    </Button>
  </Box>
);

// ─── BookResultRow ───────────────────────────────────────────────────────────

interface BookResultRowProps {
  result: ImportBookResult;
  onSelectCandidate: (
    goodreadsId: string,
    candidate: HardcoverBook | null
  ) => void;
  onToggleSkipped: (goodreadsId: string) => void;
  libraryBookIds?: Set<string>;
}

const BookResultRow: React.FC<BookResultRowProps> = ({
  result,
  onSelectCandidate,
  onToggleSkipped,
  libraryBookIds,
}) => {
  const { source, candidates, selectedCandidate, skipped } = result;
  const isLoading = candidates.length === 0 && !skipped;
  const isSelected = !skipped && selectedCandidate !== null;
  const hasMatch = selectedCandidate !== null;
  const isAlreadyInLibrary =
    hasMatch && !!libraryBookIds?.has(selectedCandidate.id);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        p: 1.5,
        borderRadius: '12px',
        background: skipped
          ? 'rgba(255,255,255,0.02)'
          : isSelected
            ? 'rgba(52,211,153,0.04)'
            : 'rgba(248,113,113,0.04)',
        border: skipped
          ? '1px solid rgba(255,255,255,0.06)'
          : isSelected
            ? '1px solid rgba(52,211,153,0.15)'
            : '1px solid rgba(248,113,113,0.15)',
        opacity: skipped ? 0.45 : 1,
        transition: 'all 0.2s ease',
        alignItems: 'flex-start',
      }}
    >
      {/* Checkbox — disabled while loading or no match */}
      <Box sx={{ pt: 0.25, flexShrink: 0 }}>
        {isLoading ? (
          <CircularProgress size={16} sx={{ color: '#a855f7', mt: 0.25 }} />
        ) : (
          <Tooltip
            title={
              hasMatch
                ? isSelected
                  ? 'Deselect'
                  : 'Select for import'
                : 'No match found'
            }
            placement="top"
          >
            <span>
              <Checkbox
                checked={isSelected}
                disabled={!hasMatch}
                onChange={() => onToggleSkipped(source.goodreadsId)}
                size="small"
                sx={{
                  p: 0,
                  color: 'rgba(255,255,255,0.25)',
                  '&.Mui-checked': { color: '#a855f7' },
                  '&.Mui-disabled': { color: 'rgba(255,255,255,0.12)' },
                }}
              />
            </span>
          </Tooltip>
        )}
      </Box>

      {/* Match quality icon */}
      <Box sx={{ pt: 0.5, flexShrink: 0 }}>
        {!isLoading &&
          (isSelected ? (
            <CheckCircleIcon sx={{ color: '#34d399', fontSize: 16 }} />
          ) : hasMatch ? (
            <BlockIcon sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 16 }} />
          ) : (
            <BlockIcon sx={{ color: '#f87171', fontSize: 16 }} />
          ))}
      </Box>

      {/* Source info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontWeight: 600,
            fontSize: 14,
            color: '#fff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {source.title}
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {source.author}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
          <Chip
            label={source.shelf}
            size="small"
            sx={{
              height: 18,
              fontSize: 10,
              fontFamily: lora.style.fontFamily,
              background: 'rgba(147,51,234,0.12)',
              color: '#c084fc',
              border: '1px solid rgba(147,51,234,0.2)',
            }}
          />
          {source.myRating > 0 && (
            <Chip
              label={`★ ${source.myRating}/5`}
              size="small"
              sx={{
                height: 18,
                fontSize: 10,
                fontFamily: lora.style.fontFamily,
                background: 'rgba(251,191,36,0.1)',
                color: '#fbbf24',
                border: '1px solid rgba(251,191,36,0.2)',
              }}
            />
          )}
          {source.dateAdded && (
            <Chip
              label={`Added ${source.dateAdded}`}
              size="small"
              sx={{
                height: 18,
                fontSize: 10,
                fontFamily: lora.style.fontFamily,
                background: 'rgba(99,179,237,0.08)',
                color: '#90cdf4',
                border: '1px solid rgba(99,179,237,0.2)',
              }}
            />
          )}
          {source.dateRead && (
            <Chip
              label={`Finished ${source.dateRead}`}
              size="small"
              sx={{
                height: 18,
                fontSize: 10,
                fontFamily: lora.style.fontFamily,
                background: 'rgba(52,211,153,0.08)',
                color: '#6ee7b7',
                border: '1px solid rgba(52,211,153,0.2)',
              }}
            />
          )}
          {isAlreadyInLibrary && (
            <Chip
              label="In library"
              size="small"
              sx={{
                height: 18,
                fontSize: 10,
                fontFamily: lora.style.fontFamily,
                background: 'rgba(129,140,248,0.1)',
                color: '#818cf8',
                border: '1px solid rgba(129,140,248,0.3)',
              }}
            />
          )}
        </Box>
        {source.review && (
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: 11,
              fontFamily: lora.style.fontFamily,
              fontStyle: 'italic',
              mt: 0.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            &ldquo;{source.review}&rdquo;
          </Typography>
        )}
      </Box>

      {/* Candidate list (horizontal scrollable thumbnails) */}
      {candidates.length > 0 && (
        <Stack
          direction="row"
          spacing={0.75}
          sx={{ flexShrink: 0, alignItems: 'center' }}
        >
          {candidates.map((candidate) => {
            const isSelected = selectedCandidate?.id === candidate.id;
            const coverUrl = candidate.cover?.url || DEFAULT_COVER_IMAGE;
            return (
              <Tooltip
                key={candidate.id}
                title={`${candidate.title} — ${candidate.author?.name ?? ''}`}
                placement="top"
              >
                <Box
                  onClick={() =>
                    onSelectCandidate(
                      source.goodreadsId,
                      isSelected ? null : candidate
                    )
                  }
                  sx={{
                    width: 40,
                    height: 60,
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: isSelected
                      ? '2px solid #a855f7'
                      : '2px solid transparent',
                    transition: 'border-color 0.15s ease, transform 0.15s ease',
                    flexShrink: 0,
                    position: 'relative',
                    '&:hover': {
                      transform: 'scale(1.08)',
                      border: isSelected
                        ? '2px solid #a855f7'
                        : '2px solid rgba(168,85,247,0.5)',
                    },
                  }}
                >
                  <Image
                    src={coverUrl}
                    alt={candidate.title}
                    fill
                    sizes="40px"
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  {libraryBookIds?.has(candidate.id) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: '#818cf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 0 1.5px rgba(18,10,30,0.9)',
                      }}
                    >
                      <CheckCircleIcon sx={{ color: '#fff', fontSize: 10 }} />
                    </Box>
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default GoodreadsImportModal;
