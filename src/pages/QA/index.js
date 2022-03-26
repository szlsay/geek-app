import styles from './index.module.scss'
import Img from '@/components/Img'
const Question = () => {
  return (
    <div className={styles.root}>
      <div style={{ height: 2000 }}></div>
      <div style={{ height: 400 }}>
        <Img src="https://fuss10.elemecdn.com/e/5d/4a7af544c0c25941171jpeg.jpeg"></Img>
      </div>
    </div>
  )
}

export default Question
