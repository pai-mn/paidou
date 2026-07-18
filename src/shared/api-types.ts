export interface ApiSuccess<T> {
  data: T
}

export interface ApiError {
  error: {
    code: string
    message: string
  }
}

export interface DailyGame {
  date: string
  day: number
  nextGameAt: string
  serverTime: string
  answer: {
    word: string
    hint: string
    pinyin: string[]
  }
}

export interface Pronunciations {
  pronunciations: Record<string, string[]>
}
