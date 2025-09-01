"use client";

import { useRef } from "react";
import Slider from "react-slick";
import { useCarouselData } from "@/hooks/useCarouselData";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

function Arrow({ onClick, dir }) {
  return (
    <button
      onClick={onClick}
      className="absolute z-20 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-2"
      style={dir === "prev" ? { left: 16 } : { right: 16 }}
      aria-label={dir === "prev" ? "Anterior" : "Siguiente"}
    >
      {dir === "prev" ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}

export default function HeroCarousel() {
  const data = useCarouselData();
  const sliderRef = useRef(null);

  if (!data.length) {
    return (
      <div className="text-center text-sm text-muted-foreground py-10">
        Cargando elementos del carousel...
      </div>
    );
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    prevArrow: <Arrow dir="prev" />,
    nextArrow: <Arrow dir="next" />,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: false,
    pauseOnHover: true,
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <Slider ref={sliderRef} {...settings}>
          {data.map((item, i) => {
            const bg =
              item.banner ||
              item.image ||
              item.img ||
              item.collage ||
              item.products?.[0]?.img ||
              "/placeholder-hero.jpg";

            return (
              <div key={i}>
                <div
                  className="relative w-full h-[42vw] max-h-[520px] min-h-[280px]"
                  style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
                    <div className="text-white">
                      <h2 className="text-3xl sm:text-5xl font-bold mb-4">{item.title || "Descubrí más"}</h2>
                      {item.subtitle && <p className="text-base sm:text-lg mb-6">{item.subtitle}</p>}
                      {item.cta?.href && (
                        <Link href={item.cta.href}>
                          <Button size="lg">{item.cta.label || "Ver más"}</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}

