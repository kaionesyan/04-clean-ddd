import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete answer comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should delete the answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      authorId: 'some-author',
      answerCommentId: answerComment.id.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items.length).toBe(0)
  })

  it('should throw if the answer belongs to another user', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryAnswerCommentsRepository.create(answerComment)

    await expect(
      sut.execute({
        authorId: 'another-author',
        answerCommentId: answerComment.id.toString(),
      }),
    ).rejects.toEqual(new Error('Not allowed'))
  })

  it('should throw if the answer does not exist', async () => {
    await expect(
      sut.execute({
        authorId: 'another-author',
        answerCommentId: 'non-existing-answer-comment',
      }),
    ).rejects.toEqual(new Error('Answer comment not found'))
  })
})
