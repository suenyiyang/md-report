import type Token from 'markdown-it/lib/token'

export interface SliceResult {
  tokens: Token[]
  offset: number
}

export function sliceSection(tokens: Token[]): SliceResult {
  let offset = 0
  if (tokens[0].tag === 'h1') {
    while (tokens[offset].nesting >= 0 || tokens[offset].tag !== 'h1')
      offset++
  }
  return {
    tokens: tokens.slice(0, offset + 1),
    offset: offset + 1,
  }
}

export function sliceParagraph(tokens: Token[]): SliceResult {
  let offset = 0
  // Code block.
  if (tokens[0].type !== 'fence') {
    // Normal paragraphs.
    while (tokens[offset].level > 0 || tokens[offset].nesting >= 0)
      offset++
  }
  // Return paragraph tokens.
  return {
    tokens: tokens.slice(0, offset + 1),
    offset: offset + 1,
  }
}

export function sliceTableRow(tokens: Token[]): SliceResult {
  let offset = 0
  while (tokens[offset].type !== 'tr_open')
    offset++
  return {
    tokens: tokens.slice(0, offset),
    offset,
  }
}

export function sliceInlineText(tokens: Token[]): SliceResult {
  if (tokens[0].tag === 'img' || tokens[0].tag === 'code') {
    return {
      tokens: tokens.slice(0, 1),
      offset: 1,
    }
  }
  return sliceParagraph(tokens)
}
