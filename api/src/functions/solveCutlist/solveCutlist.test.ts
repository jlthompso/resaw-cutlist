import { mockHttpEvent } from '@redwoodjs/testing/api'

import { handler } from './solveCutlist'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-functions

describe('solveCutlist function', () => {
  it('Should place one board', async () => {
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
    expect(data.length).toEqual(1)
    expect(data[0].children.length).toEqual(1)
  })

  it("Should place no boards (can't cut all)", async () => {
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
            qty: 2,
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
    expect(data.length).toEqual(0)
  })

  it('Should place no boards (rough too small)', async () => {
    const httpEvent = mockHttpEvent({
      payload: JSON.stringify({
        roughStock: [
          {
            qty: 1,
            width: 6,
            length: 12,
            thickness: 12,
          },
        ],
        finishedBoards: [
          {
            qty: 2,
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
    expect(data.length).toEqual(0)
  })

  it('Should place two boards', async () => {
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
            thickness: 6,
          },
        ],
      }),
    })

    const response = await handler(httpEvent, null)
    const data = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(data.length).toEqual(1)
    expect(data[0].children.length).toEqual(1)
  })

  it('Should rotate board', async () => {
    const httpEvent = mockHttpEvent({
      payload: JSON.stringify({
        roughStock: [
          {
            qty: 1,
            width: 6,
            length: 12,
            thickness: 1,
          },
        ],
        finishedBoards: [
          {
            qty: 1,
            width: 12,
            length: 6,
            thickness: 1,
          },
        ],
      }),
    })

    const response = await handler(httpEvent, null)
    const data = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(data.length).toEqual(1)
    expect(data[0].children.length).toEqual(1)
  })

  it('Should rotate boards', async () => {
    const httpEvent = mockHttpEvent({
      payload: JSON.stringify({
        roughStock: [
          {
            qty: 1,
            width: 6,
            length: 12,
            thickness: 2,
          },
        ],
        finishedBoards: [
          {
            qty: 2,
            width: 6,
            length: 1,
            thickness: 12,
          },
        ],
      }),
    })

    const response = await handler(httpEvent, null)
    const data = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(data.length).toEqual(1)
    expect(data[0].children.length).toEqual(2)
  })

  // You can also use scenarios to test your api functions
  // See guide here: https://redwoodjs.com/docs/testing#scenarios
  //
  // scenario('Scenario test', async () => {
  //
  // })
})
