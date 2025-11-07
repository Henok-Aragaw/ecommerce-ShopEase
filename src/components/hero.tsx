"use client";

import { HeroCollage } from "./modern-hero-section";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";

export default function HeroSection() {
  const dark = useSelector((state: RootState) => state.theme.dark);
  const stats = [
    { value: "500K+", label: "Happy Customers" },
    { value: "25K+", label: "Products Sold" },
  ];

  const ecommerceImages = [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1026",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1593055454503-531d165c2ed8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=715",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=735",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1120",
    "https://images.unsplash.com/photo-1690934164598-99267828e900?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1761864293818-603c23655cee?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=880",
  ];

  return (
    <div className={`w-full ${dark ? "bg-black text-white" : "bg-background text-foreground"}`}>
      <HeroCollage
        title={
          <div className={dark ? "text-white" : ""}>
            Elevate Your{" "}
            <span className={dark ? "text-blue-400" : "text-blue-600"}>Shopping Experience</span>
          </div>
        }
        subtitle={
          <>
            Discover premium collections and unbeatable deals. From fashion to
            tech, ShopEase brings the world’s best products right to your door.
            
            <div className="mt-8 flex justify-center gap-4">
              <Button
                size="lg"
                className={dark ? "bg-blue-400 text-black hover:bg-blue-300" : "bg-blue-600 text-white hover:bg-blue-700"}
              >
                <Link
                 href={"/products"}
                >
                 Shop Now
                </Link>
              </Button>
            </div>
          </>
        }
        stats={stats}
        images={ecommerceImages}
        className="pt-32"
      />
    </div>
  );
}
