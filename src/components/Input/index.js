import React, { useEffect, useRef } from 'react'
import styles from './index.module.scss'
import classNames from 'classnames'
export default function Input({
  extra,
  onExtraClick,
  className,
  autoFocus,
  ...rest
}) {
  // focus
  const inputRef = useRef(null)
  useEffect(() => {
    if (autoFocus) {
      inputRef.current.focus()
    }
  }, [autoFocus])
  return (
    <div className={styles.root}>
      <input
        ref={inputRef}
        className={classNames('input', className)}
        {...rest}
      />
      {extra ? (
        <div className="extra" onClick={onExtraClick}>
          {extra}
        </div>
      ) : null}
    </div>
  )
}
