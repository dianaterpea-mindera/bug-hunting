/** Resolve a file from /public for the current Vite base URL (e.g. GitHub Pages). */
export function publicAsset(path: string): string {
  if (
    path.startsWith('data:') ||
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:')
  ) {
    return path
  }

  const normalized = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${normalized}`
}
