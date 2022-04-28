import React from 'react'
import cn from 'classnames'

import StackOverflowLogin from 'components/StackOverflowLogin'
import TwitterLogin from 'components/TwitterLogin'

import styles from './Socials.module.scss'
import sceneStyles from '../scenes.module.scss'

const Socials = ({ className }) => {
  return (
    <div className={cn([className, styles.socials])}>
      <div className={sceneStyles.label}>
        Login with social networks to claim your tips from there
      </div>

      <div className={sceneStyles.content}>
        <StackOverflowLogin />
        <TwitterLogin />
      </div>
    </div>
  )
}

export default Socials
