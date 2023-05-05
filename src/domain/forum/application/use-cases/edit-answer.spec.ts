import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should edit the answer', async () => {
    const answer = makeAnswer({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      authorId: 'some-author',
      answerId: answer.id.toString(),
      content: 'new-content',
    })

    expect(inMemoryAnswersRepository.items[0].content).toBe('new-content')
  })

  it('should throw if the answer belongs to another user', async () => {
    const answer = makeAnswer({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryAnswersRepository.create(answer)

    await expect(
      sut.execute({
        authorId: 'another-author',
        answerId: answer.id.toString(),
        content: 'new-content',
      }),
    ).rejects.toEqual(new Error('Not allowed'))
  })

  it('should throw if the answer does not exist', async () => {
    await expect(
      sut.execute({
        authorId: 'another-author',
        answerId: 'non-existing-answer',
        content: 'new-content',
      }),
    ).rejects.toEqual(new Error('Answer not found'))
  })
})
