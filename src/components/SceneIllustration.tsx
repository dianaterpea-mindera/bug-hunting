import { publicAsset } from '../lib/publicAsset'

type Props = {
  src: string
  alt: string
  caption?: string
}

/** Scene image at its natural dimensions (no crop or hover zoom). */
export function SceneIllustration({ src, alt, caption }: Props) {
  return (
    <div className="scene-illustration">
      <img src={publicAsset(src)} alt={alt} />
      {caption ? <span className="caption">{caption}</span> : null}
    </div>
  )
}
