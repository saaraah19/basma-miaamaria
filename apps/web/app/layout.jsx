import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Every page's metadata (set via generateMetadata in each route) is merged
// into this template. Pages that don't override `title` fall back cleanly
// to "Basma Miamaria" instead of the original app's static "frontend".
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Basma Miamaria — Architecture & Décoration Intérieure",
    template: "%s | Basma Miamaria",
  },
  description:
    "Cabinet d'architecture et de décoration intérieure à Oran, Algérie. Conception, rénovation et aménagement d'espaces sur mesure.",
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    siteName: "Basma Miamaria",
  },
};

// Structured data for local search — see the SEO audit. Kept as static
// data here since business info (address/hours/phone) changes rarely;
// if that ever needs to be admin-editable, swap this for a server fetch
// of the "footer"/"contact_page" content sections instead of literals.
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ArchitectureFirm",
  name: "Basma Miamaria",
  image: `${siteUrl}/logo_bsma.jpg`,
  url: siteUrl,
  telephone: "+213562580995",
  email: "basmamiammaria@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Oran",
    addressCountry: "DZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 35.6876,
    longitude: -0.6169,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/BasmaMiaamaria",
    "https://www.instagram.com/basma_miaamaria/",
  ],
  priceRange: "$$",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
