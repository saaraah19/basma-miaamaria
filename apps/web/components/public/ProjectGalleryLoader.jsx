"use client";

import dynamic from "next/dynamic";

// Swiper measures real DOM layout to compute slide widths/loop offsets.
// Next.js still server-renders "use client" components for the initial
// HTML, so Swiper's first init pass was running against a DOM that hadn't
// been laid out by the browser yet — producing corrupt numbers (slide
// widths in the tens of millions of pixels) that persisted after
// hydration instead of self-correcting. Loading the gallery with
// `ssr: false` skips server rendering for this piece entirely, so Swiper
// only ever initializes once, client-side, against a fully laid-out DOM.
const ProjectGallery = dynamic(() => import("./ProjectGallery"), {
  ssr: false,
  loading: () => <div className="project-gallery-loading" />,
});

export default function ProjectGalleryLoader(props) {
  return <ProjectGallery {...props} />;
}