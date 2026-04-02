/**
 * Helper que replica el patrón defineMessages de react-intl
 * sin necesidad de instalarlo.
 *
 * Los scripts de traducción (compile-translations.cjs / check-translations.cjs)
 * parsean los archivos .lang.ts buscando exactamente este formato:
 *
 *   key: { id: "...", defaultMessage: "..." }
 *
 * Esta función actúa como passthrough para mantener tipado estricto en TS.
 */
export function defineMessages<
  T extends Record<string, { id: string; defaultMessage: string }>,
>(messages: T): T {
  return messages;
}

export type MessageDescriptor = { id: string; defaultMessage: string };
export type MessageMap = Record<string, MessageDescriptor>;
