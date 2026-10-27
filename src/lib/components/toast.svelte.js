/**
 * Toast queue shared by <Toaster>. Call `toast({...})` from anywhere.
 * @typedef {{ id: number, title: string, en?: string, body?: string, tone: 'info' | 'success' | 'warn', timeout: number }} Toast
 */

/** @type {Toast[]} */
export const toasts = $state([]);

let seq = 0;

/**
 * @param {{ title: string, en?: string, body?: string, tone?: Toast['tone'], timeout?: number }} t
 * @returns {number} toast id
 */
export function toast({ title, en, body, tone = 'info', timeout = 4000 }) {
  const id = ++seq;
  toasts.push({ id, title, en, body, tone, timeout });
  if (timeout > 0) setTimeout(() => dismiss(id), timeout);
  return id;
}

/** @param {number} id */
export function dismiss(id) {
  const i = toasts.findIndex((t) => t.id === id);
  if (i >= 0) toasts.splice(i, 1);
}
