"use client";

import Button from "@/components/Button";
import InputForm from "@/components/InputForm";
import { type FC, useCallback, useEffect, useState } from "react";
import styles from "./Click.module.scss";

const Click: FC = () => {
  const [hit, setHit] = useState<boolean>(false);
  // 回転数
  const [turnover, setTurnover] = useState<number>(0);
  // 初当たり確率
  const [probabilityFirstHit, setProbabilityFirstHit] = useState<string>("319");

  // 初当たり確率で回転数を計算
  const handleSimulation = () => {
    if (hit) {
      setHit(false);
      setTurnover(0);
    }

    const probability = Number(probabilityFirstHit);
    const result = Number.isNaN(probability)
      ? 0
      : Math.floor(Math.random() * probability);
    const isHit = result + 1 === Number(probabilityFirstHit);
    setTurnover((prevTurnover) => prevTurnover + 1);
    if (isHit) {
      stopSimulation();
      setHit(true);
    }
  };
  // リセット
  const handleReset = () => {
    setHit(false);
    setTurnover(0);
  };

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startSimulation = () => {
    if (!intervalId) {
      const id = setInterval(handleSimulation, 10);
      setIntervalId(id);
    }
  };

  const stopSimulation = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  useEffect(() => {
    if (hit) {
      stopSimulation();
    }
  }, [hit, stopSimulation]);

  return (
    <div className={styles["click-wrapper"]}>
      <h1 className={styles.title}>パチンコシミュレーション 初当たりType</h1>
      <div className={styles.form}>
        <InputForm
          title="初当たり確率（整数のみ）"
          inputValue={probabilityFirstHit}
          handleInputChange={setProbabilityFirstHit}
        />
      </div>
      <div className={styles.buttons}>
        <Button onClick={handleSimulation} disabled={hit}>
          1回
        </Button>
        <Button
          onMouseDown={startSimulation}
          onMouseUp={stopSimulation}
          disabled={hit}
        >
          自動連打
        </Button>
        <Button onClick={handleReset}>リセット</Button>
      </div>
      <div className={styles.result}>
        {hit ? <p>当たり！</p> : <p>はずれ</p>}
        <p>回転数: {turnover}</p>
      </div>
    </div>
  );
};

export default Click;
