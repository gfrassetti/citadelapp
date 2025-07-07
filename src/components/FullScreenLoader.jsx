'use client';

export default function FullScreenLoader() {
  return (
    <div className="loaderscreen flex flex-col justify-center items-center h-screen w-full bg-white text-black">
      <div className="text-xl font-medium">Cargando tu experiencia personalizada...</div>
      <div className="mt-4 animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black" />
    </div>
  );
}
