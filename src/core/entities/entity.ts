import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<T> {
  private _id: UniqueEntityID
  protected props: T

  get id() {
    return this._id
  }

  protected constructor(props: T, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID(id)
  }

  public equals(entity: Entity<any>) {
    if (entity === this) return true

    if (entity.id === this.id) return true

    return false
  }
}
