"use client";

import { useState } from "react";
import { useCarouselData } from "@/hooks/useCarouselData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HeroCarousel() {
  const carouselData = useCarouselData();
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((index - 1 + carouselData.length) % carouselData.length);
  const next = () => setIndex((index + 1) % carouselData.length);

  if (!carouselData.length) {
    return (
      <div className="text-center text-sm text-muted-foreground py-10">
        Cargando elementos del carousel...
      </div>
    );
  }

  const { title, products } = carouselData[index];

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
        <CardTitle className="mb-4 text-center">{title}</CardTitle>
        <CardContent className="flex gap-6 justify-center overflow-x-auto">
          {products.map((product, idx) => (
            <Link key={idx} href={`/product/${product.id}`} className="min-w-[120px] flex flex-col items-center justify-center">
              <img
                src={product.img}
                alt={product.name}
                className="h-32 w-32 object-cover rounded mb-2"
              />
              <p className="text-sm text-center">{product.name}</p>
              <p className="text-sm text-center">${product.price}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
