import { render } from '@redwoodjs/testing/web'

import Cutlist from './Cutlist'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Cutlist', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Cutlist />)
    }).not.toThrow()
  })
})
