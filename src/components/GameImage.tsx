import React, { useState, useEffect } from 'react';
import { resolveAssetUrl } from '../utils/assets';

interface GameImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  fallback?: React.ReactNode;
}

export const GameImage: React.FC<GameImageProps> = ({
  src,
  alt = '',
  fallback = null,
  className = '',
  loading = 'eager',
  decoding = 'async',
  onError,
  ...rest
}) => {
  const resolvedSrc = resolveAssetUrl(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [resolvedSrc]);

  if (!resolvedSrc || hasError) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={className}
      onError={(e) => {
        setHasError(true);
        if (onError) onError(e);
      }}
      {...rest}
    />
  );
};
