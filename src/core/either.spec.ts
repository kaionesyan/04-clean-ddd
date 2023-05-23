import { Either, left, right } from './either'

function doSomething(shouldSucceed: boolean): Either<string, number> {
  if (shouldSucceed) {
    return right(10)
  }

  return left('error')
}

test('success result', () => {
  const successResult = doSomething(true)

  expect(successResult.isRight()).toBe(true)
  expect(successResult.isLeft()).toBe(false)
  expect(successResult.value).toBe(10)
})

test('error result', () => {
  const errorResult = doSomething(false)

  expect(errorResult.isRight()).toBe(false)
  expect(errorResult.isLeft()).toBe(true)
  expect(errorResult.value).toBe('error')
})
