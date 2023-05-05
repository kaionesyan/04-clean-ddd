import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should edit the question', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryQuestionsRepository.create(question)

    await sut.execute({
      authorId: 'some-author',
      questionId: question.id.toString(),
      title: 'new-title',
      content: 'new-content',
    })

    expect(inMemoryQuestionsRepository.items[0].title).toBe('new-title')
    expect(inMemoryQuestionsRepository.items[0].content).toBe('new-content')
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
        title: 'new-title',
        content: 'new-content',
      }),
    ).rejects.toEqual(new Error('Not allowed'))
  })

  it('should throw if the question does not exist', async () => {
    await expect(
      sut.execute({
        authorId: 'another-author',
        questionId: 'non-existing-question',
        title: 'new-title',
        content: 'new-content',
      }),
    ).rejects.toEqual(new Error('Question not found'))
  })
})
