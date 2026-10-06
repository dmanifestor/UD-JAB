/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook for synchronizing state with localStorage.
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item) {
          return JSON.parse(item);
        }
      }
    } catch {
      // fallback to initialValue if error reading from localStorage
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(state));
      }
    } catch {
      // fallback
    }
  }, [key, state]);

  return [state, setState];
}
