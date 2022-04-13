export interface ReportMarkdown{
  filepath: string
  frontmatter: ReportDocumentConfig
  raw: string
}

export interface ReportDocument{
  raw: string
  config: ReportDocumentConfig
}

export interface ReportDocumentConfig{
  logo?: string
  title: string
  subtitle?: string
  subtitlePosition?: string
  tocLevel?: string
}
