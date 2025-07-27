"use client";

import { useState } from "react";
import { useCarouselData } from "@/hooks/useCarouselData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fallbackCarousel = [
  {
    title: "Destacados",
    products: [
      { img: "/demo/fallback1.jpg", price: "US$ 9,99" },
      { img: "/demo/fallback2.jpg", price: "US$ 19,99" },
      { img: "/demo/fallback3.jpg", price: "US$ 29,99" },
    ],
  },
];

export default function HeroCarousel() {
  const carouselData = useCarouselData();
  const [index, setIndex] = useState(0);

  const data = carouselData.length ? carouselData : fallbackCarousel;

  const prev = () => setIndex((index - 1 + data.length) % data.length);
  const next = () => setIndex((index + 1) % data.length);

  const { title, products } = data[index];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Esenciales para las vacaciones</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prev}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" onClick={next}>
            <ChevronRight />
          </Button>
        </div>
      </div>

      <Card className="bg-pink-medium p-4 text-white">
        <CardTitle className="mb-4">{title}</CardTitle>
        <CardContent className="flex gap-4 justify-center overflow-x-auto">
          {products.map((product, idx) => (
            <div key={idx} className="min-w-[100px] flex flex-col items-center justify-center">
              <img
                src={product.img}
                alt="Producto"
                className="h-24 w-24 object-cover rounded mb-2"
              />
              <p className="text-sm text-center">{product.price}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
