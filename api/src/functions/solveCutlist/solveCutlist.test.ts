import { mockHttpEvent } from '@redwoodjs/testing/api'

import { handler } from './solveCutlist'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-functions

describe('solveCutlist function', () => {
  it('Should respond with 200', async () => {
    const httpEvent = mockHttpEvent({
      payload: JSON.stringify({
        roughStock: [
          {
            qty: 1,
            width: 12,
            length: 12,
            thickness: 12,
          },
        ],
        finishedBoards: [
          {
            qty: 1,
            width: 12,
            length: 12,
            thickness: 12,
          },
        ],
      }),
    })

    const response = await handler(httpEvent, null)
    const data = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(data).toEqual([
      {
        width: 12,
        length: 12,
        thickness: 12,
        children: [
          {
            width: 12,
            length: 12,
            thickness: 12,
            x: 0,
            y: 0,
            z: 0,
          },
        ],
      },
    ])
  })

  // You can also use scenarios to test your api functions
  // See guide here: https://redwoodjs.com/docs/testing#scenarios
  //
  // scenario('Scenario test', async () => {
  //
  // })
})
