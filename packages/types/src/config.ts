import type { IParagraphStyleOptions } from 'docx'

// Normal paragraphs.
export type ThemeKey = 'normal' |
// Heading.
'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8' | 'h9' |
// Table header and imageFooter.
'tableHeader' | 'imageFooter' |
// Title, subtitle, and cover info.
'title' | 'subtitle' | 'coverInfo' |
// Content and abstract.
'contentTitle' | 'abstractTitle' | 'keywords' |
// Code, mark.
'code' | 'mark'

export interface ThemeConfig extends IParagraphStyleOptions {
  id: ThemeKey
}
