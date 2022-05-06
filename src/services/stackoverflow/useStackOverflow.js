import { useContext } from 'react'

import StackOverflowContext from './StackOverflowContext';

const useStackOverflow = () => {
  return useContext(StackOverflowContext)
}

export default useStackOverflow