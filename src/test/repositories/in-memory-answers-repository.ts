import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  async findById(id: string): Promise<Answer | null> {
    return this.items.find((item) => item.id.toString() === id) || null
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)
  }

  async save(answer: Answer): Promise<void> {
    const index = this.items.findIndex((item) => item.id === answer.id)
    this.items[index] = answer
  }

  async delete(answer: Answer): Promise<void> {
    this.items = this.items.filter(
      (item) => item.id.toString() !== answer.id.toString(),
    )
  }
}
