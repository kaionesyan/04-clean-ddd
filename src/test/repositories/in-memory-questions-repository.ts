import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Question | null> {
    return this.items.find((item) => item.id.toString() === id) || null
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return this.items.find((item) => item.slug.value === slug) || null
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    return this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20)
  }

  async create(question: Question): Promise<void> {
    this.items.push(question)

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question): Promise<void> {
    const index = this.items.findIndex((item) => item.id === question.id)
    this.items[index] = question
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    const index = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(index, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
