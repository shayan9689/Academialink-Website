'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { isSignedIn as checkSignedIn } from '../lib/authCookie';

interface LogoLinkProps {
  className?: string;
  children: React.ReactNode;
}

export default function LogoLink({ className, children }: LogoLinkProps) {
  const [signedIn, setSignedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSignedIn(checkSignedIn());
  }, []);

  return (
    <Link href={mounted && signedIn ? '/dashboard' : '/'} className={className}>
      {children}
    </Link>
  );
}
