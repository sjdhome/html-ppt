import { useState } from "react";
import styles from "./DemoCounter.module.css";

export default function DemoCounter() {
  const [count, setCount] = useState(0);

  return (
    <aside className={styles.counter}>
      <p className={styles.label}>React component from MDX: {count}</p>
      <button
        className={styles.button}
        type="button"
        onClick={() => {
          setCount((currentCount) => currentCount + 1);
        }}
      >
        Increment
      </button>
    </aside>
  );
}
