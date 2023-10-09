import type { APIGatewayEvent, Context } from 'aws-lambda'

import { logger } from 'src/lib/logger'

interface Board {
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

  const rough = []
  roughStock.forEach((board) => {
    for (let i = 0; i < board.qty; i++) {
      rough.push({
        width: board.width,
        length: board.length,
        thickness: board.thickness,
      })
    }
  })

  const finished = []
  finishedBoards.forEach((board) => {
    for (let i = 0; i < board.qty; i++) {
      finished.push({
        width: board.width,
        length: board.length,
        thickness: board.thickness,
      })
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

function solveCutlist(roughBoards: Board[], finishedBoards: Board[]) {
  const solution = []
  roughBoards.forEach((roughBoard) => {
    solution.push({
      width: roughBoard.width,
      length: roughBoard.length,
      thickness: roughBoard.thickness,
      children: finishedBoards.map((finishedBoard) => {
        return {
          width: finishedBoard.width,
          length: finishedBoard.length,
          thickness: finishedBoard.thickness,
          x: 0,
          y: 0,
          z: 0,
        }
      }),
    })
  })

  return solution
}
