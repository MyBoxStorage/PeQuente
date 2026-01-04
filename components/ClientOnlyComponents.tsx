'use client';

import dynamic from 'next/dynamic';

// Lazy load de componentes não críticos para melhorar LCP
const ScrollToTop = dynamic(() => import("@/components/ui/ScrollToTop"), {
  ssr: false,
});

const Toaster = dynamic(() => import("@/components/ui/toaster").then(mod => ({ default: mod.Toaster })), {
  ssr: false,
});

const WhatsAppFloatButton = dynamic(() => import("@/components/WhatsAppFloatButton"), {
  ssr: false,
});

export default function ClientOnlyComponents() {
  return (
    <>
      <ScrollToTop />
      <Toaster />
      <WhatsAppFloatButton />
    </>
  );
}
