import updateBiography from '@/app/actions/book/updateBiography';
import { User } from '@/domain/user.model';
import { useState } from 'react';
import { mutate } from 'swr';
import { SWR_KEYS } from '@/lib/swrKeys';

/**
 * Hook para manejar la actualización de biografía con optimistic updates.
 *
 * Este hook implementa el patrón de optimistic UI updates usando SWR:
 * 1. Actualiza inmediatamente la UI con el nuevo valor (optimistic)
 * 2. Ejecuta la llamada al servidor en segundo plano
 * 3. Si tiene éxito, revalida los datos desde el servidor
 * 4. Si falla, revierte automáticamente al valor anterior (rollback)
 *
 * Este patrón es reutilizable para otros campos editables como nombre, avatar, etc.
 * Solo necesitas cambiar la server action y el campo del objeto User a actualizar.
 */

interface UseBiographyProps {
  handleUpdateBiography: (newBiography: string) => Promise<void>;
  isLoading: boolean;
  isUpdated: boolean;
  isError: boolean;
  setIsUpdated: (isUpdated: boolean) => void;
  setIsError: (isError: boolean) => void;
}

export function useBiography(): UseBiographyProps {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isError, setIsError] = useState(false);

  /**
   * Actualiza la biografía con optimistic update.
   *
   * @param newBiography - Nueva biografía a guardar
   *
   * Flujo:
   * 1. Actualiza inmediatamente el cache de SWR con el nuevo valor (usuario lo ve al instante)
   * 2. Hace la llamada al servidor
   * 3. Si falla, SWR automáticamente revierte al valor anterior
   * 4. Si tiene éxito, revalida desde el servidor para asegurar sincronización
   */
  const handleUpdateBiography = async (newBiography: string) => {
    setIsLoading(true);
    setIsError(false);

    try {
      // Ejecutar la actualización en el servidor primero
      await updateBiography(newBiography);

      // Después del éxito, actualizar el cache
      await mutate(
        SWR_KEYS.user,
        (currentUser: User | undefined) => {
          if (!currentUser) return currentUser;
          return {
            ...currentUser,
            biography: newBiography,
          };
        },
        {
          revalidate: false, // No revalidar, ya tenemos el valor correcto
        }
      );

      setIsUpdated(true);
      setIsError(false);
    } catch (error) {
      console.error('[useBiography] Error updating biography:', error);
      setIsError(true);
      setIsUpdated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleUpdateBiography,
    isLoading,
    isUpdated,
    isError,
    setIsUpdated,
    setIsError,
  };
}
