import React from 'react';
import { useNavigoRouter } from '../hooks';

type LinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

export function Link(props: LinkProps) {
  const { to, children, className } = props;
  const router = useNavigoRouter();

  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        router.navigate(to);
      }}
    >
      {children}
    </a>
  );
}
