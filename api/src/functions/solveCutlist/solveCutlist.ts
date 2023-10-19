import type { APIGatewayEvent, Context } from 'aws-lambda'

import { logger } from 'src/lib/logger'

interface inputBoard {
  qty: number
  width: number
  length: number
  thickness: number
}

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: solveCutlist function`)

  const { roughStock, finishedBoards } = JSON.parse(event.body)

  const rough: RoughBoard[] = []
  roughStock.forEach((board: inputBoard) => {
    for (let i = 0; i < board.qty; i++) {
      rough.push(new RoughBoard([board.width, board.length, board.thickness]))
    }
  })

  const finished: FinishedBoard[] = []
  finishedBoards.forEach((board: inputBoard) => {
    for (let i = 0; i < board.qty; i++) {
      finished.push(
        new FinishedBoard([board.width, board.length, board.thickness])
      )
    }
  })

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(solveCutlist(rough, finished)),
  }
}

function solveCutlist(
  roughBoards: RoughBoard[],
  finishedBoards: FinishedBoard[]
) {
  roughBoards = roughBoards.sort((a, b) => a.volume - b.volume)
  if (
    finishedBoards
      .sort((a, b) => b.volume - a.volume)
      .every((finishedBoard) =>
        roughBoards.some((roughBoard) => roughBoard.cut(finishedBoard))
      )
  ) {
    return roughBoards.filter((board) => board.children.length)
  }

  return []
}

class Board {
  constructor(protected dimensions: number[]) {}

  get width(): number {
    return this.dimensions[0]
  }

  get length(): number {
    return this.dimensions[1]
  }

  get thickness(): number {
    return this.dimensions[2]
  }

  get volume(): number {
    return this.dimensions.reduce((acc, val) => acc * val)
  }
}

class RoughBoard extends Board {
  children: FinishedBoard[] = []
  #grid = [...Array(this.width)].map((_) =>
    [...Array(this.length)].map((_) => Array(this.thickness).fill(false))
  )

  #boardCanBeCut(board: FinishedBoard, origin: number[]): boolean {
    const [x, y, z] = origin
    if (
      x + board.width <= this.width &&
      y + board.length <= this.length &&
      z + board.thickness <= this.thickness
    ) {
      for (let i = x; i < x + board.width; i++) {
        for (let j = y; j < y + board.length; j++) {
          for (let k = z; k < z + board.thickness; k++) {
            if (this.#grid[i][j][k]) return false
          }
        }
      }
    } else {
      return false
    }
    return true
  }

  #placeBoardOnGrid(board: FinishedBoard, origin: number[]): boolean {
    for (let rotation = 0; rotation < 6; rotation++) {
      if (this.#boardCanBeCut(board, origin)) {
        const [x, y, z] = origin
        for (let i = x; i < x + board.width; i++) {
          for (let j = y; j < y + board.length; j++) {
            this.#grid[i][j].fill(true, z, z + board.thickness)
          }
        }
        this.children.push(board)
        board.origin = origin
        return true
      }
      board.rotate()
    }
    return false
  }

  cut(board: FinishedBoard): boolean {
    if (!this.children.length) {
      return this.#placeBoardOnGrid(board, [0, 0, 0])
    } else {
      for (let i = 0; i < 3; i++) {
        for (const child of this.children) {
          const [x, y, z] = child.origin
          const w = child.width
          const l = child.length
          const t = child.thickness
          let pivot: number[]
          switch (i) {
            case 0:
              pivot = [x, y + l, z] // back lower right corner (longer stock)
              break
            case 1:
              pivot = [x + w, y, z] // front lower left corner (wider stock)
              break
            default:
              pivot = [x, y, z + t] // back upper left corner (thicker stock)
              break
          }
          if (this.#placeBoardOnGrid(board, pivot)) return true
        }
      }
    }
    return false
  }
}

class FinishedBoard extends Board {
  #rotation = 0
  origin: number[] = null

  rotate() {
    const [w, l, t] = this.dimensions
    this.dimensions = this.#rotation ? [w, t, l] : [t, l, w]
    this.#rotation ^= 1
  }
}
