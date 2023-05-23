import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

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

    const result = await sut.execute({
      authorId: 'some-author',
      questionId: question.id.toString(),
      title: 'new-title',
      content: 'new-content',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items[0].title).toBe('new-title')
    expect(inMemoryQuestionsRepository.items[0].content).toBe('new-content')
  })

  it('should throw if the question belongs to another user', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('some-author'),
    })
    await inMemoryQuestionsRepository.create(question)

    const result = await sut.execute({
      authorId: 'another-author',
      questionId: question.id.toString(),
      title: 'new-title',
      content: 'new-content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should throw if the question does not exist', async () => {
    const result = await sut.execute({
      authorId: 'another-author',
      questionId: 'non-existing-question',
      title: 'new-title',
      content: 'new-content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
