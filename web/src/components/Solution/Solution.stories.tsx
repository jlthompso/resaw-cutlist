// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from '@storybook/react'

import Solution from './Solution'

const meta: Meta<typeof Solution> = {
  component: Solution,
}

export default meta

type Story = StoryObj<typeof Solution>

export const Primary: Story = {}
