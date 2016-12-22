import { p } from './utils'

/**
 * A node for priorioty linked list / stack and such
 */
class PriorityNode {
  key: number
  priority: number

  constructor(key: number, priority:  number) {
    this.key = key
    this.priority = priority
  }
}

/**
 * A priority queue with highest priority always on top
 * This queue is sorted by priority for each enqueue
 */
export class PriorityQueue {

  nodes: PriorityNode[] = []

  /**
   * Enqueue a new node
   * @param {[type]} priority
   * @param {[type]} key
   */
  enqueue(priority: number, key: any){
    this.nodes.push(new PriorityNode(key, priority))
    this.nodes.sort(
      function(a, b) {
        return a.priority - b.priority
      }
    )
  }

  /**
   * Dequeue the highest priority key
   */
  dequeue(): any {
    return this.nodes.shift().key
  }

  /**
   * Checks if empty
   */
  empty(): boolean {
    return !this.nodes.length
  }
}

/**
 * EXAMPLE USAGE:
 *
 *   let q = new PriorityQueue()
 *
 *   q.enqueue(1, [123])
 *   q.enqueue(2, 11111)
 *   q.enqueue(0, 'alain')
 *
 *   while (!q.empty()) {
 *     p(q.dequeue())
 *   }
 *
 */
