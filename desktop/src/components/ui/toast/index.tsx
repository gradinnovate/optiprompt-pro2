import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface Toast {
  id: number;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastContextType {
  toast: (props: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const toast = useCallback(({ title, description, variant }: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`p-4 rounded-lg shadow-lg ${
                toast.variant === 'destructive' ? 'bg-red-500' : 'bg-white'
              }`}
            >
              <div className={`font-semibold ${toast.variant === 'destructive' ? 'text-white' : 'text-gray-900'}`}>
                {toast.title}
              </div>
              {toast.description && (
                <div className={`text-sm ${toast.variant === 'destructive' ? 'text-white/90' : 'text-gray-600'}`}>
                  {toast.description}
                </div>
              )}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
} 