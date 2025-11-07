"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface HeroCollageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  stats: { value: string; label: string }[];
  images: string[];
}

interface ItemPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const animationStyle = `
  @keyframes float-up {
    0% { transform: translateY(0px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
    50% { transform: translateY(-15px); box-shadow: 0 35px 60px -15px rgba(0,0,0,0.3); }
    100% { transform: translateY(0px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
  }
  .animate-float-up {
    animation: float-up 6s ease-in-out infinite;
  }
`;

export const HeroCollage = React.forwardRef<HTMLDivElement, HeroCollageProps>(
  ({ className, title, subtitle, stats, images, ...props }, ref) => {
    const dark = useSelector((state: RootState) => state.theme.dark);
    const containerRef = useRef<HTMLDivElement>(null);
    const [orderedImages, setOrderedImages] = useState(images.slice(0, 7));
    const [positions, setPositions] = useState<ItemPosition[]>([]);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    
    useEffect(() => {
      if (!containerRef.current) return;

      const rects: ItemPosition[] = Array.from(
        containerRef.current.children[0].children
      ).map((el) => {
        const r = (el as HTMLElement).getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height };
      });

      setPositions(rects);
    }, []);

    const handleDragEnd = (index: number, event: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number } }) => {
      if (!positions.length) return;

      const centerX = info.point.x;
      const centerY = info.point.y;

     
      const swapIndex = positions.findIndex((pos, i) => {
        if (i === index) return false;
        return (
          centerX > pos.x &&
          centerX < pos.x + pos.width &&
          centerY > pos.y &&
          centerY < pos.y + pos.height
        );
      });

      if (swapIndex !== -1) {
        const newOrder = [...orderedImages];
        [newOrder[index], newOrder[swapIndex]] = [
          newOrder[swapIndex],
          newOrder[index],
        ];
        setOrderedImages(newOrder);
      }

      setDraggingIndex(null);
    };

    return (
      <>
        <style>{animationStyle}</style>

        <section
          ref={ref}
          className={cn(
            "relative w-full font-sans py-32 sm:py-40 overflow-hidden",
            dark ? "bg-black text-white" : "bg-background text-foreground",
            className
          )}
          {...props}
        >
         
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <div className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">
              {subtitle}
            </div>
          </div>

         
          <div
            ref={containerRef}
            className="relative z-0 mt-20 h-[600px] flex items-center justify-center"
          >
            <div className="relative h-full w-full max-w-6xl">
              {orderedImages.map((src, i) => (
                <motion.div
                  key={src}
                  layout
                  drag
                  dragMomentum={false}
                  dragElastic={0.2}
                  onDragStart={() => setDraggingIndex(i)}
                  onDragEnd={(e, info) => handleDragEnd(i, e, info)}
                  whileDrag={{ scale: 1.05, zIndex: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={cn(
                    "absolute rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing animate-float-up",
                    i === 0
                      ? "left-1/2 top-1/2 w-[300px] h-[380px] -translate-x-1/2 -translate-y-1/2 z-20"
                      : i === 1
                      ? "left-[18%] top-[12%] w-52 z-10"
                      : i === 2
                      ? "right-[20%] top-[10%] w-52 z-10"
                      : i === 3
                      ? "right-[20%] bottom-[10%] w-60 z-30"
                      : i === 4
                      ? "right-[5%] top-1/2 -translate-y-[60%] w-52 z-10"
                      : i === 5
                      ? "left-[15%] bottom-[10%] w-56 z-30"
                      : "left-[5%] top-[25%] w-48 z-10"
                  )}
                  style={{
                    animationDelay: `${-i * 1.2}s`,
                    zIndex: draggingIndex === i ? 50 : undefined,
                  }}
                >
                  <motion.img
                    src={src}
                    alt={`Product ${i + 1}`}
                    className="w-full h-full object-cover rounded-2xl select-none pointer-events-none"
                    whileHover={{ scale: 1.03 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="container relative z-10 mx-auto mt-16 px-4">
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className={`text-4xl font-bold tracking-tight ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {stat.value}
                  </p>
                  <p className={`mt-1 text-sm font-medium ${dark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }
);

HeroCollage.displayName = "HeroCollage";
