export const fileToArrayBuffer = async (file: File): Promise<ArrayBuffer> =>
  file.arrayBuffer();

export const arrayBufferToFile = (
  arrayBuffer: ArrayBuffer,
  fileType: string,
  fileName = window.crypto.randomUUID()
) =>
  new File([arrayBuffer], fileName, {
    type: fileType,
  });
