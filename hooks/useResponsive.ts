'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../redux/uiSlice';

export function useResponsive() {
  const dispatch = useDispatch();
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    function handleResize() {
      const newDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setDimensions(newDimensions);
      // Optionally dispatch a loading or UI action if needed
      // dispatch(setLoading(false));
    }

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const isMobile = dimensions.width < 768;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;
  const isDesktop = dimensions.width >= 1024;
  const isLargeDesktop = dimensions.width >= 1280;

  return {
    dimensions,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : isLargeDesktop ? 'large' : 'desktop',
  };
}

export function useBreakpoint() {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // Responsive class helpers
    responsiveClasses: {
      container: 'w-full px-4 sm:px-6 lg:px-8',
      grid: {
        mobile: 'grid-cols-1',
        tablet: 'grid-cols-2',
        desktop: 'grid-cols-3',
        large: 'grid-cols-4',
      },
      text: {
        mobile: 'text-sm',
        tablet: 'text-base',
        desktop: 'text-lg',
        large: 'text-xl',
      },
      spacing: {
        mobile: 'space-y-4',
        tablet: 'space-y-6',
        desktop: 'space-y-8',
        large: 'space-y-10',
      },
    },
  };
} 