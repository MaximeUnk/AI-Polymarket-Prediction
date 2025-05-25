"use client"

import React from 'react'
import styles from './InlineSphere.module.css'

const InlineSphere = () => {
  return (
    <div className={styles.pageBackground}>
      <div className={styles.glowContainer}>
        <div className={styles.glowEffect} />
        <div className={styles.sphere} />
      </div>
      {/* Your page content goes here */}
    </div>
  )
}

export default InlineSphere 