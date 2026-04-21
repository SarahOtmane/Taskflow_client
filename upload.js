import { createUploadthing } from "uploadthing/server";
const f = createUploadthing();

// Définir les types de fichiers acceptés
export const uploadRouter = {
  taskAttachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // Vérifier que l'user est connecté
      const token = req.headers.get("authorization")?.replace("Bearer ", "");
      if (!token) throw new Error("Non authentifié");
      return { token };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Fichier uploadé:", file.url);
      return { url: file.url, name: file.name };
    }),
};
// Upload direct depuis le client (sans passer par un serveur)
import { generateUploadButton } from "uploadthing/react";
export const UploadButton = generateUploadButton({ url: "/api/uploadthing" });
