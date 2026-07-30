import { useInView } from '../hooks/useInView';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4;
  className?: string;
}

export default function RevealSection({ children, delay = 0, className = '' }: Props) {
  const { ref, inView } = useInView();
  const delayClass = delay ? `reveal-delay-${delay}` : '';

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'visible' : ''} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
