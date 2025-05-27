"use client"

import React from 'react'
import styles from './SpherePrediction.module.css'

const SpherePrediction = () => {
  // These are the words that will spin around the sphere
  const words = ['AI', 'PREDICTION']
  
  return (
    <div className={styles.container}>
      {/* Background grid pattern */}
      <div className={styles.gridBackground}>
        <div className={styles.gridPattern}></div>
      </div>
      
      {/* Central sphere container */}
      <div className={styles.sphereContainer}>
        {/* The glowing sphere */}
        <div className={styles.sphere}>
          <div className={styles.sphereInner}></div>
          <div className={styles.sphereGlow}></div>
        </div>
        
        {/* Spinning words around the sphere */}
        <div className={styles.wordsOrbit}>
          {words.map((word, index) => (
            <div
              key={word}
              className={styles.wordItem}
              style={{
                transform: `translate(-50%, -50%) rotate(${(360 / words.length) * index}deg) translateY(-200px) rotate(-${(360 / words.length) * index}deg)`,
                animationDelay: `${index * 0.5}s`
              }}
            >
              <span className={styles.wordText}>{word}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpherePrediction 