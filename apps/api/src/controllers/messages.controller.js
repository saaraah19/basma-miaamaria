import prisma from "../lib/prisma.js";

// GET /api/messages — protected
export const getMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    res.json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// PATCH /api/messages/:id/read — protected
export const markMessageRead = async (req, res) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json(message);
  } catch (err) {
    console.error("markMessageRead error:", err);
    res.status(404).json({ error: "Message introuvable." });
  }
};

// DELETE /api/messages/:id — protected
export const deleteMessage = async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.json({ message: "Message supprimé." });
  } catch (err) {
    console.error("deleteMessage error:", err);
    res.status(404).json({ error: "Message introuvable." });
  }
};

// GET /api/devis-requests — protected
export const getDevisRequests = async (req, res) => {
  try {
    const requests = await prisma.devisRequest.findMany({ orderBy: { createdAt: "desc" } });
    res.json(requests);
  } catch (err) {
    console.error("getDevisRequests error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// PATCH /api/devis-requests/:id/read — protected
export const markDevisRead = async (req, res) => {
  try {
    const request = await prisma.devisRequest.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json(request);
  } catch (err) {
    console.error("markDevisRead error:", err);
    res.status(404).json({ error: "Demande introuvable." });
  }
};

// DELETE /api/devis-requests/:id — protected
export const deleteDevisRequest = async (req, res) => {
  try {
    await prisma.devisRequest.delete({ where: { id: req.params.id } });
    res.json({ message: "Demande supprimée." });
  } catch (err) {
    console.error("deleteDevisRequest error:", err);
    res.status(404).json({ error: "Demande introuvable." });
  }
};