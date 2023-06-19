import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachment'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should delete the answer', async () => {
    const answer = makeAnswer({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryAnswersRepository.create(answer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )
    const result = await sut.execute({
      authorId: 'some-author',
      answerId: answer.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswersRepository.items.length).toBe(0)
    expect(inMemoryAnswerAttachmentsRepository.items.length).toBe(0)
  })

  it('should throw if the answer belongs to another user', async () => {
    const answer = makeAnswer({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      authorId: 'another-author',
      answerId: answer.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should throw if the answer does not exist', async () => {
    const result = await sut.execute({
      authorId: 'another-author',
      answerId: 'non-existing-answer',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
