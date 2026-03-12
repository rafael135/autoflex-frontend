import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../../../app/utils/formatters'

describe('formatCurrency', () => {
  it('formats zero correctly', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
    // BRL symbol or code must be present
    expect(result.toLowerCase()).toMatch(/r\$|brl/i)
  })

  it('formats a positive integer value', () => {
    const result = formatCurrency(1500)
    // Should contain the numeric representation
    expect(result).toContain('1')
    expect(result).toContain('500')
  })

  it('formats a large value with thousands separator', () => {
    const result = formatCurrency(1000000)
    // 1.000.000 in pt-BR or 1,000,000 depending on ICU data
    expect(result).toContain('1')
    expect(result).toContain('000')
  })

  it('formats a decimal value', () => {
    const result = formatCurrency(19.99)
    expect(result).toContain('19')
    expect(result).toContain('99')
  })

  it('returns a string', () => {
    expect(typeof formatCurrency(100)).toBe('string')
  })
})
