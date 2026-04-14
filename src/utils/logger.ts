import store from '@/store';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogContext {
  env?: string;
  profileId?: string; // frontend
  userId?: string; // backend (userSub)
  additionalData?: Record<string, unknown>;
  [key: string]: unknown;
}

const COLORS = {
  DEBUG: '\x1b[36m',
  INFO: '\x1b[32m',
  WARN: '\x1b[33m',
  ERROR: '\x1b[31m',
  RESET: '\x1b[0m',
};

/**
 * CLIENT SAFE Redux access
 */
function getProfileId(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    return store.getState().user.profile?.id;
  } catch {
    return undefined;
  }
}

/**
 * Clean undefined / empty values
 */
function clean(value: unknown): unknown {
  if (value === '' || value === undefined || value === null) {
    return undefined;
  }
  return value;
}

/**
 * Build final context
 */
function buildContext(context?: LogContext) {
  const env = context?.env || process.env.ENV || 'LOCAL';

  const profileId = clean(context?.profileId || getProfileId());
  const userId = clean(context?.userId);

  return {
    env,
    profileId,
    userId,
    additionalData: context?.additionalData || {},
  };
}

/**
 * FORMAT EXACTO:
 * LEVEL message [{"data": {...}}]
 */
function formatMessage(level: LogLevel, message: string, context?: LogContext) {
  const ctx = buildContext(context);

  const payload = [
    {
      data: {
        env: ctx.env,
        profileId: ctx.profileId || '',
        userId: ctx.userId || '',
        additionalData: ctx.additionalData,
      },
    },
  ];

  return `${level} ${message} ${JSON.stringify(payload)}`;
}

/**
 * OUTPUT
 */
function output(level: LogLevel, message: string, context?: LogContext) {
  const color = COLORS[level];
  const reset = COLORS.RESET;

  const line = formatMessage(level, message, context);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`${color}${line}${reset}`);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (msg: string, ctx?: LogContext) => {
    if (process.env.NODE_ENV !== 'production') {
      output('DEBUG', msg, ctx);
    }
  },

  info: (msg: string, ctx?: LogContext) => {
    output('INFO', msg, ctx);
  },

  warn: (msg: string, ctx?: LogContext) => {
    output('WARN', msg, ctx);
  },

  error: (msg: string, ctx?: LogContext, err?: unknown) => {
    const safeCtx: LogContext = {
      ...ctx,
      additionalData: {
        ...ctx?.additionalData,
        error: err instanceof Error ? err.message : String(err),
      },
    };

    output('ERROR', msg, safeCtx);
  },
};
