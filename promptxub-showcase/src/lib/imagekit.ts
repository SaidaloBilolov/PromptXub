/**
 * Helper utility to build watermarked URLs for images/videos hosted on ImageKit.
 * Appends transformation parameters to render 'PromptXub.uz' in the bottom right corner.
 */

export const getImageKitWatermarkUrl = (
  url?: string,
  watermarkText: string = 'PromptXub.uz'
): string => {
  if (!url) return '';

  // Only apply ImageKit transformations if the URL is hosted on ImageKit or contains ik.imagekit.io
  const isImageKit = url.includes('ik.imagekit.io') || url.includes('imagekit');

  if (!isImageKit) {
    return url;
  }

  try {
    // Base64 encode the watermark text for ImageKit text overlay (ie- parameter)
    // "PromptXub.uz" -> "UHJvbXB0WHViLnV6"
    const encodedText = typeof btoa !== 'undefined' ? btoa(watermarkText) : Buffer.from(watermarkText).toString('base64');

    // ImageKit text overlay transformation string:
    // l-text: start text overlay layer
    // ie-: base64 encoded text string
    // co-: text color (white)
    // fs-: font size (18px)
    // bg-: background color with transparency (black 60% opacity -> 00000099)
    // pa-: padding (6px)
    // lfo-: overlay position (bottom_right)
    // l-end: end overlay layer
    const transformParam = `tr=l-text,ie-${encodedText},co-FFFFFF,fs-18,bg-00000099,pa-6,lfo-bottom_right,l-end`;

    if (url.includes('?')) {
      if (url.includes('tr=')) {
        return url;
      }
      return `${url}&${transformParam}`;
    } else {
      return `${url}?${transformParam}`;
    }
  } catch (e) {
    console.error('Error generating ImageKit watermark URL:', e);
    return url;
  }
};
