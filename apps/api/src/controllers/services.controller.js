import prisma from "../lib/prisma.js";

// GET /api/services — public
export const getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
    res.json(services);
 } catch (err) {
  console.error("getServices error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// POST /api/services — protected, body already validated
export const createService = async (req, res) => {
  try {
    const { icon, title, description, order } = req.body;
    const service = await prisma.service.create({
      data: { icon, title, description, order: order ?? 0 },
    });
    res.status(201).json(service);
  } catch(err) {
console.error("createService error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// PUT /api/services/:id — protected, body already validated (partial)
export const updateService = async (req, res) => {
  try {
    const existing = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Service introuvable." });

    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(service);
 } catch (err) {
    console.error("updateService error:", err);    res.status(500).json({ error: "Erreur serveur." });
  }
};

// DELETE /api/services/:id — protected
export const deleteService = async (req, res) => {
  try {
    const existing = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Service introuvable." });

    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ message: "Service supprimé." });
  } catch (err) {
  console.error("deleteService error:", err);    res.status(500).json({ error: "Erreur serveur." });
  }
};

// PATCH /api/services/reorder — protected, body already validated
export const reorderServices = async (req, res) => {
  try {
    const updates = req.body;
    const owned = await prisma.service.count({ where: { id: { in: updates.map((u) => u.id) } } });
    if (owned !== updates.length) {
      return res.status(400).json({ error: "Un ou plusieurs services sont introuvables." });
    }

    await prisma.$transaction(
      updates.map((u) => prisma.service.update({ where: { id: u.id }, data: { order: u.order } }))
    );
    res.json({ message: "Ordre mis à jour." });
 } catch (err) {
 console.error("reorderServices error:", err);    res.status(500).json({ error: "Erreur serveur." });
  }
};
