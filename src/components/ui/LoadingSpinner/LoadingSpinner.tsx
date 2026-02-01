import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 'md',
  message,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const containerClass = fullScreen
    ? styles.fullScreen
    : styles.container;

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div className={`${styles.spinner} ${styles[size]}`} aria-hidden="true" />
      {message && <p className={styles.message}>{message}</p>}
      <span className={styles.srOnly}>
        {message || 'Cargando...'}
      </span>
    </div>
  );
}





