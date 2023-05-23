import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from '@/test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete question comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should delete the question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryQuestionCommentsRepository.create(questionComment)

    await sut.execute({
      authorId: 'some-author',
      questionCommentId: questionComment.id.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.items.length).toBe(0)
  })

  it('should throw if the question belongs to another user', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryQuestionCommentsRepository.create(questionComment)

    await expect(
      sut.execute({
        authorId: 'another-author',
        questionCommentId: questionComment.id.toString(),
      }),
    ).rejects.toEqual(new Error('Not allowed'))
  })

  it('should throw if the question does not exist', async () => {
    await expect(
      sut.execute({
        authorId: 'another-author',
        questionCommentId: 'non-existing-question-comment',
      }),
    ).rejects.toEqual(new Error('Question comment not found'))
  })
})
