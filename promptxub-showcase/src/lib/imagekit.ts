export interface ImageKitOptions {
  width?: number;
  quality?: string | number;
  format?: string;
  watermark?: boolean;
  watermarkText?: string;
}

/**
 * Helper utility to build optimized & watermarked URLs for images/videos hosted on ImageKit.
 * Appends transformation parameters like `tr=f-auto,q-auto,w-800` alongside watermark text overlay.
 */
export const getOptimizedMediaUrl = (
  url?: string,
  options: ImageKitOptions = {}
): string => {
  if (!url) return '';

  const {
    width = 800,
    quality = 'auto',
    format = 'auto',
    watermark = true,
    watermarkText = 'PromptXub.uz',
  } = options;

  const isImageKit = url.includes('ik.imagekit.io') || url.includes('imagekit');

  if (!isImageKit) {
    return url;
  }

  try {
    const transforms: string[] = [];

    if (format) transforms.push(`f-${format}`);
    if (quality) transforms.push(`q-${quality}`);
    if (width) transforms.push(`w-${width}`);

    let watermarkParam = '';
    if (watermark && watermarkText) {
      const encodedText =
        typeof btoa !== 'undefined'
          ? btoa(watermarkText)
          : Buffer.from(watermarkText).toString('base64');
      watermarkParam = `l-text,ie-${encodedText},co-FFFFFF,fs-18,bg-00000099,pa-6,lfo-bottom_right,l-end`;
    }

    let transformParam = `tr=${transforms.join(',')}`;
    if (watermarkParam) {
      transformParam += `:${watermarkParam}`;
    }

    if (url.includes('?')) {
      if (url.includes('tr=')) {
        return url;
      }
      return `${url}&${transformParam}`;
    } else {
      return `${url}?${transformParam}`;
    }
  } catch (e) {
    console.error('Error generating ImageKit optimized URL:', e);
    return url;
  }
};

export const getImageKitWatermarkUrl = (
  url?: string,
  watermarkText: string = 'PromptXub.uz'
): string => {
  return getOptimizedMediaUrl(url, { width: 800, watermarkText });
};
