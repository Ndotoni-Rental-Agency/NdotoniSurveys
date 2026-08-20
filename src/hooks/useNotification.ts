import { useState, useCallback } from 'react';

interface NotificationState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showNotification = useCallback((
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    setNotification({
      isOpen: true,
      title,
      message,
      type
    });
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    showNotification(title, message, 'success');
  }, [showNotification]);

  const showError = useCallback((title: string, message: string) => {
    showNotification(title, message, 'error');
  }, [showNotification]);

  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    closeNotification
  };
}
