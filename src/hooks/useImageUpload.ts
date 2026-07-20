import { useState } from "react";
import { cloudinaryService } from "../services/cloudinaryService";
import { toast } from "sonner";
import { api } from "../services/api";

interface UseImageUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
  maxSizeMB?: number;
  showToast?: boolean;
}

interface MoveTmpImagesOptions {
  deltas: any[]; // list of deltas (description, details, etc.)
}

// Images are uploaded to a temporary folder while editing, then moved (Cloudinary
// rename) to the permanent folder on submit. The rename assigns a NEW version, so
// the permanent URL cannot be rebuilt from the tmp URL by string-replace (the old
// /v<version>/ would 404). The backend returns the canonical new URL per image in
// a { [oldUrl]: newUrl } map — we must persist exactly that.
const TMP_IMAGE_FOLDER = "tmp-post-images";

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const { onSuccess, onError, maxSizeMB = 5, showToast = true } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      cloudinaryService.validateFile(file, maxSizeMB);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await cloudinaryService.uploadFile(file, folder);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (onSuccess) {
        onSuccess(result.url);
      }

      if (showToast) {
        toast.success("Imagem enviada com sucesso!");
      }

      return result.url;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao enviar imagem";
      setError(errorMessage);

      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }

      if (showToast) {
        toast.error(errorMessage);
      }

      throw err;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const uploadBase64 = async (
    base64String: string,
    folder: string,
  ): Promise<string> => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await cloudinaryService.uploadBase64(base64String, folder);

      if (onSuccess) {
        onSuccess(result.url);
      }

      if (showToast) {
        toast.success("Imagem processada com sucesso!");
      }

      return result.url;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao processar imagem";
      setError(errorMessage);

      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }

      if (showToast) {
        toast.error(errorMessage);
      }

      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    folder: string,
  ): Promise<string | null> => {
    const file = event.target.files?.[0];
    if (!file) return null;

    return await uploadFile(file, folder);
  };

  async function moveTmpImagesInDeltas({
    deltas,
  }: MoveTmpImagesOptions): Promise<any[]> {
    const tmpImages: string[] = [];

    deltas.forEach((delta) => {
      if (!delta?.ops) return;
      delta.ops.forEach((op: any) => {
        const image = op.insert?.image;
        if (typeof image === "string" && image.includes(`/${TMP_IMAGE_FOLDER}/`))
          tmpImages.push(image);
      });
    });

    // No temporary images to move — return the deltas untouched (e.g. editing a
    // post whose images were already moved to the permanent folder).
    if (tmpImages.length === 0) return deltas;

    const { data: urlMap } = await api.post<Record<string, string>>(
      "/cloudinary/move-tmp-to-post",
      { urls: tmpImages },
    );

    // Persist the exact permanent URL the backend returned for each image.
    return deltas.map((delta) => {
      if (!delta?.ops) return delta;
      return {
        ...delta,
        ops: delta.ops.map((op: any) => {
          const image = op.insert?.image;
          const movedUrl =
            typeof image === "string" ? urlMap?.[image] : undefined;
          return movedUrl
            ? { ...op, insert: { ...op.insert, image: movedUrl } }
            : op;
        }),
      };
    });
  }

  const reset = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
  };

  return {
    uploadFile,
    uploadBase64,
    handleFileChange,
    moveTmpImagesInDeltas,
    isUploading,
    uploadProgress,
    error,
    reset,
  };
};
