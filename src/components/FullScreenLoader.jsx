'use client';

import Image from 'next/image';

export default function FullScreenLoader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full bg-white text-black">
      <Image src="/assets/logo-black.png" alt="Logo" width={120} height={120} className="mb-6" />
      <div className="text-xl font-medium">Cargando tu experiencia personalizada...</div>
      <div className="mt-4 animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black" />
    </div>
  );
}
