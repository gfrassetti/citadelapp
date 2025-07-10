"use client";

import Image from "next/image";
import clsx from "clsx";

export default function HomeBanner() {
  return (
    <section className="w-full bg-[#b131d4] text-white px-8 flex justify-between items-center">
      <h2 className="text-2xl font-bold sm:text-3xl text-center capitalize">
        Abastécete rápido
      </h2>
      <div className="hidden sm:block relative">
        <Image
          src="/assets/banner-city.png"
          alt="Ciudad"
          width={250}
          height={60}
          className="w-full top-0 bottom-0 right-0"
        />
      </div>
    </section>
  );
}
