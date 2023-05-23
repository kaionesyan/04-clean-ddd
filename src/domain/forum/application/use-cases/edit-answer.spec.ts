import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

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

    const result = await sut.execute({
      authorId: 'some-author',
      answerId: answer.id.toString(),
      content: 'new-content',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswersRepository.items[0].content).toBe('new-content')
  })

  it('should throw if the answer belongs to another user', async () => {
    const answer = makeAnswer({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      authorId: 'another-author',
      answerId: answer.id.toString(),
      content: 'new-content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should throw if the answer does not exist', async () => {
    const result = await sut.execute({
      authorId: 'another-author',
      answerId: 'non-existing-answer',
      content: 'new-content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
