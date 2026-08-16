import { useCallback, useEffect, useRef, useState } from 'react';
import { readEntry, writeEntry } from '@/lib/offline/store';

/**
 * A `Set<string>` mirrored into the offline cache, so choices like
 * "acknowledged" / "dismissed" survive reloads and work with no connection.
 */
export const usePersistentSet = (key: string) => {
  const [value, setValue] = useState<Set<string>>(() => new Set());
  const hydrated = useRef(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const entry = await readEntry<string[]>(key);
      if (!active) return;
      if (entry?.value) setValue(new Set(entry.value));
      hydrated.current = true;
    })();
    return () => {
      active = false;
    };
  }, [key]);

  const persist = useCallback(
    (next: Set<string>) => {
      setValue(next);
      if (hydrated.current) void writeEntry(key, [...next]);
    },
    [key],
  );

  const add = useCallback(
    (id: string) => persist(new Set(value).add(id)),
    [persist, value],
  );

  const addMany = useCallback(
    (ids: Iterable<string>) => {
      const next = new Set(value);
      for (const id of ids) next.add(id);
      persist(next);
    },
    [persist, value],
  );

  const clear = useCallback(() => persist(new Set()), [persist]);

  return { value, add, addMany, clear };
};
