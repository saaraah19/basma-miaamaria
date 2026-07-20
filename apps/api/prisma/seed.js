import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
const { Pool } = pg;
import "dotenv/config";
import bcrypt from "bcryptjs";
import { buildSlug } from "@bsma/shared";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding...");

  // ── 1. Admin ─────────────────────────────────────────
  const password = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@bsma.com" },
    update: {},
    create: { email: "admin@bsma.com", password },
  });
  console.log("✓ Admin (change this password immediately after first login)");

  // ── 2. Hero ──────────────────────────────────────────
  const heroContent = [
    { key: "title", value: "Basma Miamaria" },
    { key: "subtitle", value: "Architecture et décoration intérieure — Élégance et raffinement pour vos espaces" },
    { key: "btn_text", value: "Découvrez nos projets" },
    { key: "bg_image", value: "" },
    { key: "btn_link", value: "/projects" },
  ];
  for (const item of heroContent) {
    await prisma.content.upsert({
      where: { section_key: { section: "hero", key: item.key } },
      update: { value: item.value },
      create: { section: "hero", ...item },
    });
  }
  console.log("✓ Hero");

  // ── 3. Home ──────────────────────────────────────────
  const homeContent = [
    { key: "services_title", value: "Nos Services" },
    { key: "projects_title", value: "Nos Projets" },
  ];
  for (const item of homeContent) {
    await prisma.content.upsert({
      where: { section_key: { section: "home", key: item.key } },
      update: { value: item.value },
      create: { section: "home", ...item },
    });
  }
  console.log("✓ Home");

  // ── 4. About ─────────────────────────────────────────
  const aboutContent = [
    { key: "title", value: "À Propos de Basma Miamaria" },
    { key: "subtitle", value: "Excellence en architecture et décoration intérieure" },
    { key: "histoire_title", value: "Notre Histoire" },
    { key: "histoire_1", value: "<p>Avec plus de 10 années d'expérience, Basma Miamaria s'est établie comme l'une des figures de proue en architecture et décoration intérieure en Algérie.</p>" },
    { key: "histoire_2", value: "<p>Chaque projet est une occasion de transformer des rêves en réalité, combinant innovation, durabilité et esthétique intemporelle.</p>" },
    { key: "valeurs_title", value: "Nos Valeurs" },
    { key: "valeurs", value: JSON.stringify([
      { icon: "✓", label: "Excellence", desc: "Qualité impeccable dans chaque détail" },
      { icon: "✓", label: "Créativité", desc: "Solutions innovantes et uniques" },
      { icon: "✓", label: "Écoresponsabilité", desc: "Design durable et écologique" },
      { icon: "✓", label: "Écoute", desc: "Compréhension totale de vos besoins" },
    ]) },
    { key: "expertise_title", value: "Domaines d'Expertise" },
    { key: "expertise", value: JSON.stringify([
      { icon: "🏛️", label: "Architecture" },
      { icon: "🛋️", label: "Décoration" },
      { icon: "🔨", label: "Rénovation" },
      { icon: "💡", label: "Consultation" },
    ]) },
    { key: "cta_title", value: "Prêt à transformer votre espace ?" },
    { key: "cta_button", value: "Demander un devis gratuit" },
  ];
  for (const item of aboutContent) {
    await prisma.content.upsert({
      where: { section_key: { section: "about", key: item.key } },
      update: { value: item.value },
      create: { section: "about", ...item },
    });
  }
  console.log("✓ About");

  // ── 5. Contact Section (home) ────────────────────────
  const contactContent = [
    { key: "title", value: "Contactez-nous" },
    { key: "subtitle", value: "Vous avez un projet d'architecture ou de décoration ? Discutons-en." },
    { key: "maps_url", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51849.09951749709!2d-0.6169776601426332!3d35.68762002693565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7e6300338f2dc7%3A0xc0d95199a3526d13!2sbasma%20miaamaria!5e0!3m2!1sfr!2sdz!4v1766255337011!5m2!1sfr!2sdz" },
    { key: "calendly", value: "https://calendly.com/202037043518-etu/30min" },
    { key: "btn_devis_text", value: "Demander un devis" },
    { key: "btn_devis_link", value: "/devis" },
    { key: "btn_rdv_text", value: "Prendre rendez-vous" },
    { key: "form_btn_text", value: "Envoyer" },
  ];
  for (const item of contactContent) {
    await prisma.content.upsert({
      where: { section_key: { section: "contact", key: item.key } },
      update: { value: item.value },
      create: { section: "contact", ...item },
    });
  }
  console.log("✓ Contact Section");

  // ── 6. Navbar ────────────────────────────────────────
  const navbarContent = [
    { key: "site_name", value: "Basma Miamaria" },
    { key: "btn_devis_text", value: "Demander un devis" },
  ];
  for (const item of navbarContent) {
    await prisma.content.upsert({
      where: { section_key: { section: "navbar", key: item.key } },
      update: { value: item.value },
      create: { section: "navbar", ...item },
    });
  }
  console.log("✓ Navbar");

  // ── 7. Footer ────────────────────────────────────────
  const footerContent = [
    { key: "tagline", value: "Architecture & Décoration Intérieure" },
    { key: "description", value: "Création d'espaces élégants et raffinés qui reflètent votre style personnel et votre mode de vie." },
    { key: "phone", value: "+213562580995" },
    { key: "email", value: "basmamiammaria@gmail.com" },
    { key: "address", value: "Oran, Algérie" },
    { key: "facebook", value: "https://www.facebook.com/BasmaMiaamaria" },
    { key: "instagram", value: "https://www.instagram.com/basma_miaamaria/" },
    { key: "pinterest", value: "#" },
    { key: "linkedin", value: "#" },
  ];
  for (const item of footerContent) {
    await prisma.content.upsert({
      where: { section_key: { section: "footer", key: item.key } },
      update: { value: item.value },
      create: { section: "footer", ...item },
    });
  }
  console.log("✓ Footer");

  // ── 8. Services ──────────────────────────────────────
  const services = [
    { icon: "FaLandmark", title: "Architecture", description: "Conception de bâtiments uniques et élégants adaptés à vos besoins.", order: 0 },
    { icon: "FaCouch", title: "Décoration intérieure", description: "Aménagement raffiné et harmonieux pour chaque espace.", order: 1 },
    { icon: "FaLightbulb", title: "Consultation", description: "Accompagnement personnalisé pour transformer vos idées en projets concrets.", order: 2 },
  ];
  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { title: s.title } });
    if (!existing) await prisma.service.create({ data: s });
  }
  console.log("✓ Services");

// ── 8b. Catégories ───────────────────────────────────
  const categoryNames = ["Architecture", "Décoration intérieure", "Rénovation"];
  for (const [i, name] of categoryNames.entries()) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, order: i },
    });
  }
  console.log("✓ Catégories");

  // ── 9. Projets ───────────────────────────────────────
  const projects = [
    { title: "Maison Contemporaine", category: "Architecture", description: "Projet de maison contemporaine avec volumes ouverts, matériaux naturels et grandes baies vitrées.", surface: "120 m²", duration: "3-6 mois", budget: "Sur demande", order: 0 },
    { title: "Appartement Minimaliste", category: "Décoration intérieure", description: "Aménagement d'un appartement épuré, optimisation des rangements et palette sobre.", surface: "80 m²", duration: "1-3 mois", budget: "Sur demande", order: 1 },
    { title: "Bureau Design", category: "Architecture", description: "Aménagement de bureaux modernes favorisant la collaboration.", surface: "200 m²", duration: "2-4 mois", budget: "Sur demande", order: 2 },
    { title: "Salon Luxueux", category: "Décoration intérieure", description: "Rénovation d'un salon avec matériaux nobles et éclairage scénographié.", surface: "60 m²", duration: "1-2 mois", budget: "Sur demande", order: 3 },
  ];
  for (const p of projects) {
    const existing = await prisma.project.findFirst({ where: { title: p.title } });
    if (!existing) await prisma.project.create({ data: { ...p, slug: buildSlug(p.title) } });
  }
  console.log("✓ Projets");

  // ── 10. Contact Page ─────────────────────────────────
  const contactPageContent = [
    { key: "hero_title", value: "Contactez-Nous" },
    { key: "hero_subtitle", value: "Discutons de votre prochain projet" },
    { key: "address", value: "Oran, Algérie" },
    { key: "phone", value: "+213562580995" },
    { key: "email", value: "basmamiammaria@gmail.com" },
    { key: "hours_1", value: "Lun - Ven: 9h00 - 18h00" },
    { key: "hours_2", value: "Sam: 10h00 - 16h00" },
    { key: "facebook", value: "https://www.facebook.com/BasmaMiaamaria" },
    { key: "instagram", value: "https://www.instagram.com/basma_miaamaria/" },
    { key: "submit_btn", value: "Envoyer le message" },
  ];
  for (const item of contactPageContent) {
    await prisma.content.upsert({
      where: { section_key: { section: "contact_page", key: item.key } },
      update: { value: item.value },
      create: { section: "contact_page", ...item },
    });
  }
  console.log("✓ Contact Page");

  // ── 11. Devis ────────────────────────────────────────
  const devisContent = [
    { key: "title", value: "Demander un devis" },
    { key: "subtitle", value: "Décrivez votre projet afin que nous puissions vous proposer une estimation personnalisée." },
    { key: "submit_btn", value: "Envoyer ma demande" },
  ];
  for (const item of devisContent) {
    await prisma.content.upsert({
      where: { section_key: { section: "devis", key: item.key } },
      update: { value: item.value },
      create: { section: "devis", ...item },
    });
  }
  console.log("✓ Devis");

  console.log("\n✅ Seed terminé avec succès !");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
