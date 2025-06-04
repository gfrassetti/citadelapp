"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"

const CarouselContext = React.createContext({})

export const useCarousel = () => {
  return React.useContext(CarouselContext)
}

export const Carousel = React.forwardRef(
  ({ orientation = "horizontal", opts, setApi, children, className, ...props }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ ...opts, axis: orientation === "vertical" ? "y" : "x" })

    React.useEffect(() => {
      if (!emblaApi) return
      if (setApi) setApi(emblaApi)
    }, [emblaApi, setApi])

    return (
      <CarouselContext.Provider value={{ emblaRef, orientation }}>
        <div ref={ref} className={cn("relative", className)} {...props}>
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

export const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { emblaRef, orientation } = useCarousel()

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-col" : "flex-row",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

export const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      className={cn(
        "min-w-0",
        orientation === "vertical" ? "min-h-0 w-full" : "min-w-full",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"
