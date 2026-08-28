type AnimalGlyphProps = {
  emoji: string
  icon?: string
  /** Use the large photo-frame glyph style */
  big?: boolean
}

export function AnimalGlyph({ emoji, icon, big = false }: AnimalGlyphProps) {
  if (icon) {
    return (
      <span className={big ? 'big animal-glyph-wrap' : 'animal-emoji animal-glyph-wrap'}>
        <img src={icon} alt="" className="animal-glyph" />
      </span>
    )
  }

  return big ? <span className="big">{emoji}</span> : <span className="animal-emoji">{emoji}</span>
}
