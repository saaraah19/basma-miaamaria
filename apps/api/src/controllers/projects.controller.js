import { buildSlug } from "@bsma/shared";
import prisma from "../lib/prisma.js";
import { cloudinary } from "../lib/cloudinary.js";
// A route param that could be either a cuid (id) or a slug — try slug first
// since that's what real URLs use; id lookup keeps any old links alive.
const findProjectByIdOrSlug = (idOrSlug) =>
  prisma.project.findFirst({
    where: { OR: [{ slug: idOrSlug }, { id: idOrSlug }] },
    include: { images: { orderBy: { order: "asc" } } },
  });

// GET /api/projects — public
export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
      include: { images: { orderBy: { order: "asc" } } },
    });
    res.json(projects);
  } catch {
    console.error("getProjects error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// GET /api/projects/admin/all — protected
// Returns every project regardless of isVisible, for the admin table.
// A hidden/draft project needs to still be manageable, not invisible
// to the person managing it.
export const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
      include: { images: { orderBy: { order: "asc" } } },
    });
    res.json(projects);
  } catch {
    console.error("getAllProjects error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// GET /api/projects/:idOrSlug — public
export const getProject = async (req, res) => {
  try {
    const project = await findProjectByIdOrSlug(req.params.idOrSlug);
    if (!project) return res.status(404).json({ error: "Projet introuvable." });
    res.json(project);
  } catch {
    console.error("getProject error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// POST /api/projects — protected, body already validated
export const createProject = async (req, res) => {
  try {
    const { title, category, description, surface, duration, budget, order } = req.body;
    const slug = buildSlug(title);
    const project = await prisma.project.create({
      data: { title, slug, category, description, surface, duration, budget, order: order ?? 0 },
    });
    res.status(201).json(project);
  } catch {
    console.error("createProject error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// PUT /api/projects/:id — protected, body already validated (partial)
export const updateProject = async (req, res) => {
  try {
    const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Projet introuvable." });

    // Re-slugging on every title edit would break existing shared/indexed
    // links, so the slug is generated once at creation and left alone.
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(project);
  } catch {
    console.error("updateProject error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// PATCH /api/projects/images/:imageId/cover — protected
export const setProjectImageCover = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await prisma.projectImage.findUnique({ where: { id: imageId } });
    if (!image) return res.status(404).json({ error: "Image introuvable." });

    await prisma.$transaction([
      prisma.projectImage.updateMany({
        where: { projectId: image.projectId },
        data: { isCover: false },
      }),
      prisma.projectImage.update({
        where: { id: imageId },
        data: { isCover: true },
      }),
    ]);

    res.json({ message: "Cover mise à jour." });
  } catch {
    console.error("setProjectImageCover error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// PATCH /api/projects/:id/images/reorder — protected, body already validated
export const reorderProjectImages = async (req, res) => {
  try {
    const updates = req.body; // array of { id, order }, validated

    // Ownership check: every image id in the payload must actually belong
    // to :id — otherwise a crafted request could reorder another project's
    // images by id (a BOLA/IDOR-style gap).
    const owned = await prisma.projectImage.count({
      where: { id: { in: updates.map((u) => u.id) }, projectId: req.params.id },
    });
    if (owned !== updates.length) {
      return res.status(403).json({ error: "Opération non autorisée." });
    }

    await prisma.$transaction(
      updates.map((u) =>
        prisma.projectImage.update({ where: { id: u.id }, data: { order: u.order } })
      )
    );
    res.json({ message: "Ordre mis à jour." });
  } catch {
    console.error("reorderProjectImages error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// DELETE /api/projects/:id — protected
export const deleteProject = async (req, res) => {
  try {
    const images = await prisma.projectImage.findMany({
      where: { projectId: req.params.id },
    });
    await Promise.all(images.map((img) => cloudinary.uploader.destroy(img.publicId)));
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: "Projet supprimé." });
  } catch {
    console.error("deleteProject error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// POST /api/projects/:id/images — protected
export const addProjectImages = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Aucun fichier reçu." });
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: "Projet introuvable." });

    const existingCount = await prisma.projectImage.count({ where: { projectId: id } });

    const images = await Promise.all(
      files.map((file, i) =>
        prisma.projectImage.create({
          data: {
            projectId: id,
            url: file.path,
            publicId: file.filename,
            order: existingCount + i,
            isCover: existingCount === 0 && i === 0,
          },
        })
      )
    );

    res.status(201).json(images);
  } catch {
    console.error("addProjectImages error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// DELETE /api/projects/images/:imageId — protected
export const deleteProjectImage = async (req, res) => {
  try {
    const image = await prisma.projectImage.findUnique({ where: { id: req.params.imageId } });
    if (!image) return res.status(404).json({ error: "Image introuvable." });

    await cloudinary.uploader.destroy(image.publicId);
    await prisma.projectImage.delete({ where: { id: image.id } });
    res.json({ message: "Image supprimée." });
  } catch {
    res.status(500).json({ error: "Erreur serveur." });
  }
};
// PATCH /api/projects/images/:imageId — protected, body already validated
export const updateProjectImageAlt = async (req, res) => {
  try {
    const { alt } = req.body;
    const image = await prisma.projectImage.update({
      where: { id: req.params.imageId },
      data: { alt: alt || null },
    });
    res.json(image);
  } catch (err) {
    console.error("updateProjectImageAlt error:", err);
    res.status(404).json({ error: "Image introuvable." });
  }
};