'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function NewSearchButton() {
  const router = useRouter();

  return (
    <Button variant="secondary" size="lg" onClick={() => router.push('/')}>
      Nueva Búsqueda
    </Button>
  );
}

