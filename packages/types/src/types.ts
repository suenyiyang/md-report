export interface ReportConfig{
  title: string
  logo?: string
  subtitle?: string
  subtitlePos?: 'up' | 'down'
  coverInfo?: Record<string, any>
  disablePageNumber?: boolean
  disablePageHeader?: boolean
}

export interface ReportMarkdown{
  raw: string
  frontmatter: ReportConfig
}
