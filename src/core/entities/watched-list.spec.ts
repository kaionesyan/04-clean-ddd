import { WatchedList } from './watched-list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('Watched list', () => {
  it('should be able to create a watched list with initial items', () => {
    const list = new NumberWatchedList([1, 3])

    expect(list.currentItems).toEqual([1, 3])
  })

  it('should be able to watch new items added to the list', () => {
    const list = new NumberWatchedList([1, 3])

    list.add(4)

    expect(list.currentItems).toEqual([1, 3, 4])
    expect(list.getNewItems()).toEqual([4])
  })

  it('should be able to watch items removed from the list', () => {
    const list = new NumberWatchedList([1, 3])

    list.remove(3)

    expect(list.currentItems).toEqual([1])
    expect(list.getRemovedItems()).toEqual([3])
  })

  it('should be able to add a new item even if it was removed before', () => {
    const list = new NumberWatchedList([1, 3])

    list.remove(3)
    list.add(3)

    expect(list.currentItems).toEqual([1, 3])
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
  })

  it('should update watched list items', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.update([1, 3, 5])

    expect(list.getNewItems()).toEqual([5])
    expect(list.getRemovedItems()).toEqual([2])
  })
})
