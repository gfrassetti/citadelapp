"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselData = [
  {
    title: "Recien Añadidos", products: [
      { img: "/demo/skull1.jpg", price: "US$ 0,45" },
      { img: "/demo/mask1.jpg", price: "US$ 99,85" },
      { img: "/demo/costume1.jpg", price: "US$ 5,95" },
    ],
  },
  {
    title: "Electronica",
    products: [
      { img: "/demo/violin.jpg", price: "US$ 589" },
      { img: "/demo/red-dress.jpg", price: "US$ 188" },
      { img: "/demo/pink-dress.jpg", price: "US$ 8,90" },
    ],
  },
  {
    title: "Para Negocios",
    products: [
      { img: "/demo/fan.jpg", price: "US$ 20,30" },
      { img: "/demo/pool.jpg", price: "US$ 236,90" },
      { img: "/demo/camera.jpg", price: "US$ 24,50" },
    ],
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((index - 1 + carouselData.length) % carouselData.length);
  const next = () => setIndex((index + 1) % carouselData.length);

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
        <CardTitle className="mb-4">{title}</CardTitle>
        <CardContent className="flex gap-4  justify-center overflow-x-auto">
          {products.map((product, idx) => (
            <div key={idx} className="min-w-[100px] flex flex-col justify-center">
              <img src={product.img} alt="" className="h-24 w-24 object-cover rounded mb-2" />
              <p className="text-sm text-center">{product.price}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
