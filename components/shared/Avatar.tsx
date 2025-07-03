'use client';

import Image from 'next/image';
import defaultAvatar from '../../public/images/default-avatar.png';

interface AvatarProps {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  image?: string;
  altText?: string;
}

export default function Avatar({ size, image, altText = 'User avatar' }: AvatarProps) {
  const sizeMap = {
    xs: { width: 32, height: 32, class: 'h-8 w-8' },
    sm: { width: 40, height: 40, class: 'h-10 w-10' },
    md: { width: 48, height: 48, class: 'h-12 w-12' },
    lg: { width: 80, height: 80, class: 'h-20 w-20' },
    xl: { width: 160, height: 160, class: 'h-40 w-40' },
  };

  const { width, height, class: sizeClass } = sizeMap[size];

  return (
    <div className="flex items-center justify-center">
      <div className={`relative ${sizeClass}`}>
        <Image
          src={image || defaultAvatar}
          alt={altText}
          className="rounded-full object-cover"
          width={width}
          height={height}
        />
      </div>
    </div>
  );
}