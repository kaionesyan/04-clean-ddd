import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from '@/test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should get the question by its slug', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ slug: Slug.create('a-title') }),
    )

    const result = await sut.execute({
      slug: 'a-title',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.question.id).toBeTruthy()
      expect(inMemoryQuestionsRepository.items[0].id).toEqual(
        result.value.question.id,
      )
    }
  })
})
