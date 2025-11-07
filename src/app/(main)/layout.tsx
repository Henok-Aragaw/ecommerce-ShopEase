import Navbar from '@/components/nav-bar'

import { ReactNode } from 'react'

const RootLayout = async({children}:{children:ReactNode}) => {

  return (
    <div>
        <Navbar />
        {children}
    </div>
  )
}

export default RootLayout