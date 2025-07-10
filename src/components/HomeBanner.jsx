"use client";

import Image from "next/image";
import clsx from "clsx";

export default function HomeBanner() {
  return (
    <section className="w-full bg-blue-medium text-white px-8 flex justify-between items-center">
      <h2 className="text-2xl font-bold sm:text-3xl text-center capitalize">
        Abastécete rápido
      </h2>
      <div className="hidden sm:block relative">
        <Image
          src="/assets/banner-city.png"
          alt="Ciudad"
          width={270}
          height={80}
          className="w-full"
        />
      </div>
    </section>
  );
}
