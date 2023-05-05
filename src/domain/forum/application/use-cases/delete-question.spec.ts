import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should delete the question', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryQuestionsRepository.create(question)

    await sut.execute({
      authorId: 'some-author',
      questionId: question.id.toString(),
    })

    expect(inMemoryQuestionsRepository.items.length).toBe(0)
  })

  it('should throw if the question belongs to another user', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryQuestionsRepository.create(question)

    await expect(
      sut.execute({
        authorId: 'another-author',
        questionId: question.id.toString(),
      }),
    ).rejects.toEqual(new Error('Not allowed'))
  })

  it('should throw if the question does not exist', async () => {
    await expect(
      sut.execute({
        authorId: 'another-author',
        questionId: 'non-existing-question',
      }),
    ).rejects.toEqual(new Error('Question not found'))
  })
})
