import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

export function ErrorMessage({
  message,
  title,
  onDismiss,
  variant = 'error',
}: ErrorMessageProps) {
  return (
    <div
      className={`${styles.container} ${styles[variant]}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.content}>
        {title && <h4 className={styles.title}>{title}</h4>}
        <p className={styles.message}>{message}</p>
      </div>
      {onDismiss && (
        <button
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label="Cerrar mensaje de error"
        >
          ×
        </button>
      )}
    </div>
  );
}





