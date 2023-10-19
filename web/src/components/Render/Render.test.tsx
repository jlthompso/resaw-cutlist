import { render } from '@redwoodjs/testing/web'

import Render from './Render'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Render', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Render />)
    }).not.toThrow()
  })
})
