import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should delete the answer', async () => {
    const answer = makeAnswer({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      authorId: 'some-author',
      answerId: answer.id.toString(),
    })

    expect(inMemoryAnswersRepository.items.length).toBe(0)
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
      }),
    ).rejects.toEqual(new Error('Not allowed'))
  })

  it('should throw if the answer does not exist', async () => {
    await expect(
      sut.execute({
        authorId: 'another-author',
        answerId: 'non-existing-answer',
      }),
    ).rejects.toEqual(new Error('Answer not found'))
  })
})
