import { useEffect } from 'react';

export default function useKeyboardShortcut(key, callback, ctrlKey = false) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if ctrlKey matches requirements (ctrl or cmd/meta)
      const ctrlMatching = ctrlKey ? (event.ctrlKey || event.metaKey) : true;
      
      if (event.key === key && ctrlMatching) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, ctrlKey]);
}
