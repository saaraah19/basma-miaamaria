"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Autoplay } from "swiper/modules";
import { cldUrl } from "@/lib/cloudinary-url";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

export default function ProjectGallery({ images, projectTitle }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="project-gallery">
      <div className="project-main">
        <Swiper
          modules={[Navigation, Pagination, Thumbs, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper }}
          autoplay={{ delay: 4000, disableOnInteraction: true }}
          loop={images.length > 1}
          className="main-swiper"
        >
          {images.map((img, i) => (
            <SwiperSlide key={img.id}>
              <div className="main-slide-frame">
                <Image
                  src={cldUrl(img.url, { w: 1200 })}
                  alt={img.alt || `${projectTitle} — vue ${i + 1}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  priority={i === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {images.length > 1 && (
        <div className="project-thumbs">
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[Thumbs]}
            slidesPerView={4}
            spaceBetween={8}
            watchSlidesProgress
            className="thumbs-swiper"
          >
            {images.map((img, i) => (
              <SwiperSlide key={img.id} className="thumb-slide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cldUrl(img.url, { w: 160 })}
                  alt={`Vignette ${i + 1} — ${projectTitle}`}
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
