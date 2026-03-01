import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { MoveRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Banner = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // simulate loading
    return () => clearTimeout(timer);
  }, []);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1920",
      title: "Your Journey Begins Here",
      subtitle: "Experience premium travel across the country with TicketBari.",
      highlight: "Journey",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1920",
      title: "Travel with Modern Luxury Buses",
      subtitle: "Enjoy air-conditioned, comfortable seating and professional service on every road trip.",
      highlight: "Buses",
    },
    {
      id: 3,
      image: "https://i.postimg.cc/W3FbkcM4/judith-chambers-fuct-Oehz-U5U-unsplash.jpg",
      title: "Fast Track with Premium Train Service",
      subtitle: "Book your Train tickets online and experience the rhythm of the rails in comfort.",
      highlight: "Train",
    },
  ];

  // Internal Shimmer Utility
  const Shimmer = () => (
    <div className="absolute top-0 left-0 w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 dark:via-slate-700/20 to-transparent -skew-x-12" />
  );

  return (
    <section className="relative w-full h-[500px] md:h-[700px] overflow-hidden bg-slate-200 dark:bg-slate-900">
      {loading ? (
        /* ================= BANNER SKELETON ================= */
        <div className="relative w-full h-full flex items-center px-6 md:px-20 max-w-7xl mx-auto">
          <div className="max-w-2xl w-full space-y-6">
            {/* Badge Skeleton */}
            <div className="relative w-40 h-8 bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden">
                <Shimmer />
            </div>
            
            {/* Title Skeleton */}
            <div className="space-y-3">
                <div className="relative w-full h-12 md:h-20 bg-slate-300 dark:bg-slate-800 rounded-xl overflow-hidden">
                    <Shimmer />
                </div>
                <div className="relative w-2/3 h-12 md:h-20 bg-slate-300 dark:bg-slate-800 rounded-xl overflow-hidden">
                    <Shimmer />
                </div>
            </div>

            {/* Subtitle Skeleton */}
            <div className="space-y-2 pt-4">
                <div className="relative w-full h-4 bg-slate-300 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <Shimmer />
                </div>
                <div className="relative w-5/6 h-4 bg-slate-300 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <Shimmer />
                </div>
            </div>

            {/* Button Skeletons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <div className="relative w-full sm:w-44 h-14 bg-brand/20 rounded-xl overflow-hidden">
                    <Shimmer />
                </div>
                <div className="relative w-full sm:w-44 h-14 bg-slate-300 dark:bg-slate-800 rounded-xl overflow-hidden">
                    <Shimmer />
                </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= ACTUAL SWIPER CONTENT ================= */
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          slidesPerView={1}
          className="h-full w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="relative w-full h-full bg-cover bg-center transition-transform duration-[10000ms] scale-105"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent dark:from-dark-bg/90 dark:via-dark-bg/50" />

                {/* Content */}
                <div className="relative h-full flex items-center px-6 md:px-20 max-w-7xl mx-auto">
                  <div className="max-w-2xl text-left">
                    {/* Badge */}
                    <div className="inline-block px-4 py-1 mb-6 rounded-full bg-brand/20 border border-brand/30 backdrop-blur-sm">
                      <span className="text-brand-light text-sm font-bold tracking-widest uppercase">
                        Premium Travel 2026
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight uppercase">
                      {slide.title.split(" ").map((word, i) =>
                        word === slide.highlight ? (
                          <span key={i} className="text-brand-light">
                            {" "}
                            {word}{" "}
                          </span>
                        ) : (
                          ` ${word} `
                        )
                      )}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-slate-200 mb-10 font-medium leading-relaxed max-w-xl">
                      {slide.subtitle}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="btn bg-brand hover:bg-brand/90 border-none text-white px-10 rounded-xl h-14 text-lg group shadow-xl shadow-brand/20">
                        Book Now
                        <MoveRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </button>
                      <button className="btn btn-outline border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm px-10 rounded-xl h-14 text-lg">
                        Explore Routes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Swiper Custom Styles */}
      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #2dd4bf !important;
          background: rgba(0, 0, 0, 0.2);
          width: 50px !important;
          height: 50px !important;
          border-radius: 50%;
          backdrop-filter: blur(4px);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px !important;
          font-weight: bold;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
          width: 12px;
          height: 12px;
        }
        .swiper-pagination-bullet-active {
          background: #2dd4bf !important;
          opacity: 1;
          width: 30px;
          border-radius: 6px;
        }
      `}</style>
    </section>
  );
};

export default Banner;