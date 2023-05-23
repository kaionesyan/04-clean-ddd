import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { FetchRecentQuestions } from './fetch-recent-questions'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestions

describe('Fetch recent questions', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestions(inMemoryQuestionsRepository)
  })

  it('should fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) }),
    )

    const { questions } = await sut.execute({ page: 1 })

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const { questions } = await sut.execute({ page: 2 })

    expect(questions).toHaveLength(2)
  })
})
