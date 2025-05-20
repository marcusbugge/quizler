import styles from "./page.module.css";
import Quiz from "./sections/quizmaker/Quiz";

export default function Home() {
  return (
    <div className={styles.page}>
      <Quiz />
    </div>
  );
}
