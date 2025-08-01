import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ShortenedURL, ClickDetail } from '../types';
import { logger } from '../../../logging-middleware';

interface URLShortenerContextType {
  shortenedUrls: ShortenedURL[];
  addShortenedUrl: (url: ShortenedURL) => void;
  addClick: (shortcode: string, click: ClickDetail) => void;
  getShortenedUrl: (shortcode: string) => ShortenedURL | undefined;
  isShortcodeUnique: (shortcode: string) => boolean;
}

const URLShortenerContext = createContext<URLShortenerContextType | undefined>(undefined);

export const useURLShortener = () => {
  const context = useContext(URLShortenerContext);
  if (!context) {
    throw new Error('useURLShortener must be used within a URLShortenerProvider');
  }
  return context;
};

interface URLShortenerProviderProps {
  children: ReactNode;
}

export const URLShortenerProvider: React.FC<URLShortenerProviderProps> = ({ children }) => {
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedURL[]>([]);

  // Add a new shortened URL, ensuring shortcode uniqueness
  const addShortenedUrl = (url: ShortenedURL) => {
    if (!isShortcodeUnique(url.shortcode)) {
      logger.error('Attempted to add duplicate shortcode', { shortcode: url.shortcode });
      return;
    }
    setShortenedUrls(prev => [...prev, url]);
    logger.info('URL shortened successfully', { 
      shortcode: url.shortcode, 
      originalUrl: url.originalUrl 
    });
  };

  // Add a click to a shortened URL, with error logging if shortcode not found
  const addClick = (shortcode: string, click: ClickDetail) => {
    const exists = shortenedUrls.some(url => url.shortcode === shortcode);
    if (!exists) {
      logger.error('Attempted to add click to non-existent shortcode', { shortcode, clickId: click.id });
      return;
    }
    setShortenedUrls(prev => 
      prev.map(url => 
        url.shortcode === shortcode 
          ? { 
              ...url, 
              clickCount: url.clickCount + 1,
              clicks: [...url.clicks, click]
            }
          : url
      )
    );
    logger.info('Click recorded', { shortcode, clickId: click.id });
  };

  // Get a shortened URL by shortcode
  const getShortenedUrl = (shortcode: string): ShortenedURL | undefined => {
    return shortenedUrls.find(url => url.shortcode === shortcode);
  };

  // Check if a shortcode is unique
  const isShortcodeUnique = (shortcode: string): boolean => {
    return !shortenedUrls.some(url => url.shortcode === shortcode);
  };

  return (
    <URLShortenerContext.Provider value={{
      shortenedUrls,
      addShortenedUrl,
      addClick,
      getShortenedUrl,
      isShortcodeUnique
    }}>
      {children}
    </URLShortenerContext.Provider>
  );
};