export function isChineseCharacter(input: string) {
  return /^\p{Unified_Ideograph}$/u.test(input)
}

export function filterNonChineseChars(input: string) {
  return Array.from(input).filter(isChineseCharacter).join('')
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('filterNonChineseChars', () => {
    expect(filterNonChineseChars('Hello World!')).toBe('')
    expect(filterNonChineseChars('こんにちは')).toBe('')
    expect(filterNonChineseChars('안녕하세요')).toBe('')
    expect(filterNonChineseChars('你好啊')).toMatchInlineSnapshot('"你好啊"')
    expect(filterNonChineseChars('Hello，你好!')).toMatchInlineSnapshot('"你好"')
    expect(filterNonChineseChars('甲𠀀乙')).toBe('甲𠀀乙')
  })
}
