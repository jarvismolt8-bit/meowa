import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  toast: { message: string; type: ToastType } | null;
}

const typeClasses: Record<ToastType, string> = {
  success: 'surface-tint-green dark:bg-green-900/30',
  error: 'bg-red-100 dark:bg-red-900/30',
  info: 'surface-tint-violet dark:bg-violet-900/30',
};

export default function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return createPortal(
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-xl shadow-lg px-5 py-3 text-sm font-medium text-[var(--brand-ink)] dark:text-[var(--foreground)] max-w-xs ${typeClasses[toast.type]}`}
      role="alert"
    >
      {toast.message}
    </div>,
    document.body
  );
}
