import { useEffect } from "react";

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  shouldEscape: boolean = true
) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    if (shouldEscape) {
      document.addEventListener("keydown", (event) => handleEscape(event));
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
      if (shouldEscape) {
        document.removeEventListener("keydown", (event) => handleEscape(event));
      }
    };
    // eslint-disable-next-line
  }, []);
};

export default useClickOutside;
