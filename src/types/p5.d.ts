// Type declarations for p5.js global usage
declare global {
  interface Window {
    p5: typeof import('p5');
    P5: typeof import('p5');
  }
  
  // Allow p5 to be used directly
  const p5: typeof import('p5');
  const P5: typeof import('p5');
}

export {};