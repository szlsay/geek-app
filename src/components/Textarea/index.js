import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
export default function Textarea({
  maxLength = 100,
  className,
  value,
  onChange,
  ...rest
}) {
  const [content, setContent] = useState(value || '')
  const handleChange = (e) => {
    setContent(e.target.value)
    onChange && onChange(e)
  }
  const textRef = useRef(null)
  useEffect(() => {
    textRef.current.focus()
    // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement/setSelectionRange
    textRef.current.setSelectionRange(-1, -1)
  }, [])
  return (
    <div className={styles.root}>
      {/* 文本输入框 */}
      <textarea
        {...rest}
        className={classNames('textarea', className)}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        ref={textRef}
      />

      {/* 当前字数/最大允许字数 */}
      <div className="count">
        {content.length}/{maxLength}
      </div>
    </div>
  )
}
