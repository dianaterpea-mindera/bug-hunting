type Props = {
  src: string
  alt: string
  caption?: string
}

/** Cropped scene image that expands in place on hover to show the full picture. */
export function SceneIllustration({ src, alt, caption }: Props) {
  return (
    <div className="scene-illustration" title="Treci cu mouse-ul pentru imaginea completă">
      <img src={src} alt={alt} />
      {caption ? <span className="caption">{caption}</span> : null}
    </div>
  )
}
