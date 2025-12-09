"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ListingCard from "@/components/listings/ListingCard";
import Autoplay from "embla-carousel-autoplay"; 

export default function VitrinSlider() {
  // Mock Veri
  const vitrinItems = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    title: `Vitrin Fırsatı ${i + 1}`,
    price: `${100 + i * 50}.000 TL`,
    location: "İstanbul",
    image: `https://placehold.co/300x200/png?text=Vitrin+${i + 1}`
  }));

  return (
    <div className="w-full relative px-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {vitrinItems.map((item) => (
              <CarouselItem key={item.id} className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <div className="p-1 h-full">
                  <ListingCard 
                    title={item.title}
                    price={item.price}
                    location={item.location}
                    image={item.image}
                    isVitrin={true}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 h-10 w-10 border-blue-200 text-blue-600 hover:bg-blue-50" />
          <CarouselNext className="-right-4 h-10 w-10 border-blue-200 text-blue-600 hover:bg-blue-50" />
        </Carousel>
    </div>
  );
}