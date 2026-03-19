import { sendLog as _sendLog } from '@gycoding/nebula';
import { type LogLevel, type LogData } from './log.types';
import { LogOrigin } from './log.types';

/**
 * Application-scoped wrapper around the shared `sendLog` from @gycoding/nebula.
 * Automatically sets the origin to WINGWORDS.
 *
 * @param level    - Severity of the event.
 * @param message  - Human-readable description. Use `{id}` as placeholder for the entity id.
 * @param data     - Optional contextual payload.
 * @param entityId - Optional entity id injected into `{id}` placeholders in the message.
 */
export async function sendLog(
  level: LogLevel,
  message: string,
  data: LogData = {},
  entityId?: string
): Promise<void> {
  return _sendLog(level, message, LogOrigin.WINGWORDS, data, entityId);
}
