import { useState, useLayoutEffect } from "react";

const useIntersection = (element: any, rootMargin: string) => {
  const [isVisible, setState] = useState(false);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState(entry.isIntersecting);
          observer.unobserve(element.current);
        }
      },
      {
        rootMargin,
      }
    );

    element.current && observer.observe(element.current);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      observer.unobserve(element.current);
    };
  }, [element, rootMargin]);

  return isVisible;
};

export default useIntersection;
