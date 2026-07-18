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
  day: number
  answer: {
    word: string
    hint: string
  }
}

export interface IdiomValidation {
  validity: Record<string, boolean>
}
