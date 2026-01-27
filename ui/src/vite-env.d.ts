/// <reference types="vite/client" />

// Declare CSS module types
declare module '*.css' {
  const content: Record<string, string>
  export default content
}
