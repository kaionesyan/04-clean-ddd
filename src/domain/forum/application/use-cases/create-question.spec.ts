import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should create a question', async () => {
    const result = await sut.execute({
      authorId: 'author-id',
      title: 'A title',
      content: 'New question',
    })

    const question = result.value?.question

    expect(result.isRight()).toBe(true)
    expect(question?.id).toBeTruthy()
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(question?.id)
  })
})
