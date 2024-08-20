export const useFileValidation = () => {
  const isImageFile = (fileName: string) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  };

  const isVideoFile = (fileName: string) => {
    return /\.(mp4|webm|ogg)$/i.test(fileName);
  };

  const isValidURL = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  return { isImageFile, isVideoFile, isValidURL };
};
