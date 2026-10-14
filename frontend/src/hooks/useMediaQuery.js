import { useState, useEffect } from "react";

/**
 * Reactive media query hook. Unlike reading window.innerWidth during render,
 * this re-renders the component when the viewport crosses the breakpoint
 * (resize, device rotation, split-screen, etc).
 */
export function useMediaQuery(query) {
  const getMatch = () =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange); // older Safari
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

export const useIsMobile = (maxWidth = 768) =>
  useMediaQuery(`(max-width: ${maxWidth}px)`);

export default useMediaQuery;
