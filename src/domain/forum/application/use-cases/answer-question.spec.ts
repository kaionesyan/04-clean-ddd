import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  test('create an answer', async () => {
    const result = await sut.execute({
      questionId: 'question-id',
      instructorId: 'instructor-id',
      content: 'New answer',
    })

    const answer = result.value?.answer

    expect(result.isRight()).toBeTruthy()
    expect(answer?.id).toBeTruthy()
    expect(inMemoryAnswersRepository.items[0].id).toEqual(answer?.id)
  })
})
