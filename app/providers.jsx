'use client';

import { HeroUIProvider } from '@heroui/system';

export function Providers({ children }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}