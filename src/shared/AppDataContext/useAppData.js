import { useContext } from 'react'

import AppDataContext from './AppDataContext'

const useAppData = () => {
  return useContext(AppDataContext)
}

export default useAppData