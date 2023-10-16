import { MetaTags } from '@redwoodjs/web'

import Cutlist from 'src/components/Cutlist/Cutlist'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <Cutlist />
    </>
  )
}

export default HomePage
