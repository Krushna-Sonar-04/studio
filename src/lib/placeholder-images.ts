import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const placeholderImages: Record<string, ImagePlaceholder> = 
    data.placeholderImages.reduce((acc, img) => {
        acc[img.id] = img;
        return acc;
    }, {} as Record<string, ImagePlaceholder>);

/**
 * Gets a placeholder image URL.
 * If an id is provided, it tries to find a specific image.
 * If the id is not found or not provided, it generates a unique URL based on the id string
 * to ensure deterministic randomness.
 * @param id A string identifier for the image.
 * @returns A URL for a placeholder image.
 */
export function getPlaceholderImage(id: string): string {
    if (id && placeholderImages[id]) {
        return placeholderImages[id].imageUrl;
    }
    // Fallback to a unique, deterministically random image based on the ID.
    // This ensures that 'issue-123' always gets the same random image.
    return `https://picsum.photos/seed/${id}/600/400`;
}
