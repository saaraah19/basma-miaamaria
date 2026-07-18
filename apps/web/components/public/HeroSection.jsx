import Link from "next/link";
import { getSection } from "@/lib/api-server";
import { sanitize } from "@/lib/sanitize";
import { cldUrl } from "@/lib/cloudinary-url";
import { toInlineStyle } from "@/lib/blockStyles";
import "./HeroSection.css";

export default async function HeroSection() {
  const content = await getSection("hero").catch(() => ({}));

  const title = content?.title?.value ?? "Basma Miamaria";
  const subtitle = content?.subtitle?.value ?? "Architecture et décoration intérieure";
  const btnText = content?.btn_text?.value ?? "Découvrez nos projets";
  const btnLink = content?.btn_link?.value ?? "/projects";
  const bgImage = content?.bg_image?.value ?? "";
  const optimizedBg = bgImage ? cldUrl(bgImage, { w: 1920 }) : "";

  return (
    <section
      className="hero-section"
      style={optimizedBg ? { backgroundImage: `url(${optimizedBg})` } : undefined}
    >
      {/* Preload the actual LCP element instead of letting the browser
          discover it late via the CSS background-image. */}
      {optimizedBg && (
        <link rel="preload" as="image" href={optimizedBg} fetchPriority="high" />
      )}

      <div className="hero-content">
        <h1
          className="hero-title"
          style={toInlineStyle(content?.title?.styles)}
          dangerouslySetInnerHTML={{ __html: sanitize(title) }}
        />
        <p
          className="hero-subtitle"
          style={toInlineStyle(content?.subtitle?.styles)}
          dangerouslySetInnerHTML={{ __html: sanitize(subtitle) }}
        />
        <Link href={btnLink}>
          <button className="hero-button" style={toInlineStyle(content?.btn_text?.styles)}>
            {btnText}
          </button>
        </Link>
      </div>
    </section>
  );
}
