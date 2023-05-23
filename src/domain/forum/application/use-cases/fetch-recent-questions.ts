import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface FetchRecentQuestionsRequest {
  page: number
}

interface FetchRecentQuestionsResponse {
  questions: Question[]
}

export class FetchRecentQuestions {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return { questions }
  }
}
