import React, { useEffect, useRef, useState } from 'react';

// A <section> that marks itself revealed the first time it scrolls into view.
// Without IntersectionObserver it starts revealed, so content is never stuck hidden.
export const RevealSection: React.FC<React.HTMLAttributes<HTMLElement>> = ({ children, className = '', ...rest }) => {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (revealed || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <section ref={ref} data-revealed={revealed} className={`reveal-item ${className}`} style={{ '--d': '0ms' } as React.CSSProperties} {...rest}>
      {children}
    </section>
  );
};
