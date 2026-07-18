import prisma from "../lib/prisma.js"; 
import { cloudinary } from "../lib/cloudinary.js"; 

// GET /api/media — protected 
export const getMedia = async (req, res) => { 
  try { 
    const media = await prisma.media.findMany({ 
      orderBy: { uploadedAt: "desc" } 
    }); 
    return res.json(media); 
  } catch (error) {
    console.error("Erreur getMedia:", error);
    return res.status(500).json({ error: "Erreur serveur lors de la récupération." }); 
  } 
}; 

// POST /api/media/upload — protected 
export const uploadMedia = async (req, res) => { 
  try { 
    const file = req.file; 
    if (!file) return res.status(400).json({ error: "Aucun fichier reçu." }); 

    const media = await prisma.media.create({ 
      data: { 
        url: file.path, 
        publicId: file.filename, // Stocke le "folder/filename" généré par multer-storage-cloudinary
        filename: file.originalname, 
        size: file.size, 
      }, 
    }); 
    
    return res.status(201).json(media); 
  } catch (error) { 
    console.error("Erreur uploadMedia:", error);
    return res.status(500).json({ error: "Erreur serveur lors du téléversement." }); 
  } 
}; 

// DELETE /api/media/:id — protected 
export const deleteMedia = async (req, res) => { 
  try { 
    const media = await prisma.media.findUnique({ 
      where: { id: req.params.id } 
    }); 
    
    if (!media) return res.status(404).json({ error: "Média introuvable." }); 

    // Suppression sur Cloudinary
    const cloudinaryResult = await cloudinary.uploader.destroy(media.publicId);
    
    // Cloudinary renvoie { result: 'ok' } si l'image est supprimée ou { result: 'not found' }
    if (cloudinaryResult.result !== "ok" && cloudinaryResult.result !== "not found") {
      return res.status(500).json({ error: "Impossible de supprimer le fichier distant." });
    }

    // Suppression en base de données seulement après confirmation Cloudinary
    await prisma.media.delete({ 
      where: { id: media.id } 
    }); 

    return res.json({ message: "Média supprimé avec succès." }); 
  } catch (error) { 
    console.error("Erreur deleteMedia:", error);
    return res.status(500).json({ error: "Erreur serveur lors de la suppression." }); 
  } 
};
