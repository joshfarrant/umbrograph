import invariant from 'tiny-invariant';

export const arrayBufferToString = (buffer: ArrayBuffer): string => {
  const decoder = new TextDecoder();
  const data = new Uint8Array(buffer);
  return decoder.decode(data);
};

export const stringToArrayBuffer = (str: string): ArrayBuffer => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return data.buffer;
};

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

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // TODO don't use btoa
  return window.btoa(binary);
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = Buffer.from(base64, 'base64');
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString[i];
  }

  return bytes.buffer;
};

export const getFileContents = async (file: File): Promise<string> => {
  const reader = new FileReader();

  return new Promise((resolve) => {
    reader.addEventListener('load', () => {
      invariant(typeof reader.result === 'string');

      resolve(reader.result);
    });

    reader.readAsText(file);
  });
};

export const fileToPreviewUrl = (file: File): Promise<string> => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((resolve) => {
    reader.addEventListener('load', () => {
      invariant(typeof reader.result === 'string');

      resolve(reader.result);
    });
  });
};

export const base64ToPreviewUrl = async (
  key: CryptoKey,
  iv: Uint8Array,
  fileType: string,
  base64: string
): Promise<string> => {
  const arrayBuffer = base64ToArrayBuffer(base64);

  const file = await decryptFileContents(key, iv, arrayBuffer, fileType);

  const previewUrl = fileToPreviewUrl(file);

  return previewUrl;
};

export const base64ToString = (base64String: string): string => {
  return Buffer.from(base64String, 'base64').toString('utf-8');
};
