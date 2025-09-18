
'use client';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import Image from 'next/image';

interface ImageLightboxProps {
  imageUrl: string;
  alt: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ImageLightbox({ imageUrl, alt, isOpen, onOpenChange }: ImageLightboxProps) {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 border-0 bg-transparent">
        <Image
          src={imageUrl}
          alt={alt}
          width={1200}
          height={800}
          className="w-full h-auto object-contain rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
