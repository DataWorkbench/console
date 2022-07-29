import { BehaviorSubject } from 'rxjs'

// eslint-disable-next-line import/prefer-default-export
export const fieldChangeSubject$ = new BehaviorSubject<[string, string] | null>(null)
