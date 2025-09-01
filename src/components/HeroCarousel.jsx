"use client";

import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function Arrow({ dir, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "prev" ? "Anterior" : "Siguiente"}
      className={`absolute top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow rounded-full p-2 ${
        dir === "prev" ? "left-4" : "right-4"
      }`}
    >
      {dir === "prev" ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}

export default function HeroCarousel() {
  const slides = [
    {
      src: "/assets/slide_1.webp",
      alt: "Esenciales para las vacaciones",
      title: "Esenciales para las vacaciones",
      subtitle: "Tecnología y accesorios para tu viaje",
      href: "/buscar?vacaciones",
      cta: "Explorar",
    },
    {
      src: "/assets/slide_2.webp",
      alt: "Hogar y muebles",
      title: "Hogar y muebles",
      subtitle: "Renová tus espacios",
      href: "/hogar",
      cta: "Ver ahora",
    }
  ];

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <Arrow dir="prev" />,
    nextArrow: <Arrow dir="next" />,
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <Slider {...settings}>
          {slides.map((s, i) => (
            <div key={i}>
              <div className="relative w-full h-[42vw] max-h-[520px] min-h-[280px]">
                <Image src={s.src} alt={s.alt} fill priority={i === 0} className="object-cover" />
                <div className="absolute inset-0" />
                <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}


