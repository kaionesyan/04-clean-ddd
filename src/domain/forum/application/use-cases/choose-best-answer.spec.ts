import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { ChooseBestAnswerUseCase } from './choose-best-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { makeQuestion } from '@/test/factories/make-question'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ChooseBestAnswerUseCase

describe('Delete answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new ChooseBestAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    )
  })

  it('should choose the best answer', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      authorId: question.authorId.toString(),
      answerId: answer.id.toString(),
    })

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should throw if the answer does not exist', async () => {
    await expect(
      sut.execute({
        authorId: 'non-existing-author',
        answerId: 'non-existing-answer',
      }),
    ).rejects.toEqual(new Error('Answer not found'))
  })

  it('should throw if the question does not exist', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    await expect(
      sut.execute({
        authorId: 'non-existing-author',
        answerId: answer.id.toString(),
      }),
    ).rejects.toEqual(new Error('Question not found'))
  })

  it('should throw if the question belongs to another user', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    await expect(
      sut.execute({
        authorId: 'another-author',
        answerId: answer.id.toString(),
      }),
    ).rejects.toEqual(new Error('Not allowed'))
  })
})
