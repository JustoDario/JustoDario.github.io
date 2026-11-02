// Resolves a file in public/ against Vite's base. Paths are not URL-encoded on
// purpose, so names such as "c++logo.png" reach the server unchanged.
export const assetUrl = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
