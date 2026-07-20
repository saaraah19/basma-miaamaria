import prisma from "../lib/prisma.js";

// GET /api/categories — public
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
    res.json(categories);
  } catch (err) {
    console.error("Erreur getCategories:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// POST /api/categories — protected, body already validated
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: "Cette catégorie existe déjà." });
    }

    const count = await prisma.category.count();
    const category = await prisma.category.create({ data: { name, order: count } });
    res.status(201).json(category);
  } catch (err) {
    console.error("Erreur createCategory:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// DELETE /api/categories/:id — protected
export const deleteCategory = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!category) return res.status(404).json({ error: "Catégorie introuvable." });

    // Refuse to orphan projects — they'd keep a category string that no
    // longer exists anywhere in the admin UI or the public filter nav.
    const inUse = await prisma.project.count({ where: { category: category.name } });
    if (inUse > 0) {
      return res.status(400).json({
        error: `Impossible de supprimer : ${inUse} projet(s) utilisent encore cette catégorie.`,
      });
    }

    await prisma.category.delete({ where: { id: category.id } });
    res.json({ message: "Catégorie supprimée." });
  } catch (err) {
    console.error("Erreur deleteCategory:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};