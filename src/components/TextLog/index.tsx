import type { FC } from "react";
import styles from "./index.module.scss";

export type TextLogProps = {
  firstHitCount: number;
  isRush: boolean;
  extendedGame: number;
  production: number;
  usage: number;
};

const TextLog: FC<TextLogProps> = ({
  firstHitCount,
  isRush,
  extendedGame,
  production,
  usage,
}) => {
  return (
    <div className={styles["text-log"]}>
      <p className={styles.text}>初当たり回転数：{firstHitCount}</p>
      <p className={styles.text}>{isRush ? "Rush" : "通常"}</p>
      <p className={styles.text}>連チャン数：{extendedGame}</p>
      <p className={styles.text}>獲得出玉：{production}</p>
      <p className={styles.text}>使用出玉：{usage}</p>
    </div>
  );
};

export default TextLog;
