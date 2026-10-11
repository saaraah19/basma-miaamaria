import BrandLoader from "@/components/public/BrandLoader";

// Affiché automatiquement par Next.js pendant qu'une page publique attend
// ses données (réveil de la base, navigation lente...).
export default function Loading() {
  return <BrandLoader />;
}
