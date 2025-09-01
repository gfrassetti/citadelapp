"use client";

import Image from "next/image";
import clsx from "clsx";

export default function HomeBanner() {
  return (
    <section className="w-full bg-blue-medium text-white px-8 flex justify-between items-center sm:h-[10rem]">
      <h2 className="text-xl font-medium sm:text-3xl text-left sm:text-center capitalize pl-8">
        Abastécete rápido
      </h2>
      <div className="block relative">
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
