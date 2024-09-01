"use client";

import GraphChart from "@/components/GraphChart";
import { useCallback, useMemo, useState } from "react";
import InputForm from "../components/InputForm";
import type { TextLogProps } from "../components/TextLog";
import TextLog from "../components/TextLog";
import styles from "./Home.module.scss";

export default function Home() {
  const [inputValueTurnover, setInputValueTurnover] = useState<string>("18");
  const [inputValueProbabilityFirstHit, setInputValueProbabilityFirstHit] =
    useState<string>("319");
  const [inputValueRushEntryRate, setInputValueRushEntryRate] =
    useState<string>("70");
  const [inputValueRushContinuationRate, setInputValueRushContinuationRate] =
    useState<string>("80");
  const [inputValueFirstPayout, setInputValueFirstPayout] =
    useState<string>("300");
  const [inputValueGuaranteedPayout, setInputValueGuaranteedPayout] =
    useState<string>("1500");

  const [logs, setLogs] = useState<TextLogProps[]>([]);

  const [isAccordianOpen, setIsAccordianOpen] = useState<boolean>(true);

  const formValidation = useMemo(() => {
    const errors = [];
    if (!Number(inputValueTurnover)) {
      errors.push("回転率は数値で入力してください");
    }
    if (!Number(inputValueProbabilityFirstHit)) {
      errors.push("初当たり確率は数値で入力してください");
    }
    if (!Number(inputValueRushEntryRate)) {
      errors.push("Rush突入率は数値で入力してください");
    }
    if (!Number(inputValueRushContinuationRate)) {
      errors.push("Rush継続率は数値で入力してください");
    }
    if (!Number(inputValueFirstPayout)) {
      errors.push("初当たり出玉は数値で入力してください");
    }
    if (!Number(inputValueGuaranteedPayout)) {
      errors.push("確変当たり出玉は数値で入力してください");
    }
    return errors;
  }, [
    inputValueTurnover,
    inputValueProbabilityFirstHit,
    inputValueRushEntryRate,
    inputValueRushContinuationRate,
    inputValueFirstPayout,
    inputValueGuaranteedPayout,
  ]);

  // 初当たり回転数
  const handleFirstHit = useCallback(() => {
    const hit = Math.floor(
      Math.random() * Number(inputValueProbabilityFirstHit),
    );

    let count = 0;
    while (true) {
      count += 1;
      const randam = Math.floor(
        Math.random() * Number(inputValueProbabilityFirstHit),
      );
      if (hit === randam) {
        break;
      }
    }

    return count;
  }, [inputValueProbabilityFirstHit]);

  // Rushシミュレーション
  const handleRush = useCallback(() => {
    // Rush突入判定
    const rushEntry = Math.random() * 100 < Number(inputValueRushEntryRate);
    if (rushEntry) {
      const handleRush = (count: number) => {
        // Rush継続判定
        const rushContinuation =
          Math.random() * 100 < Number(inputValueRushContinuationRate);
        if (rushContinuation) {
          return handleRush(count + 1);
        }
        return count;
      };
      const result = handleRush(0);

      return result;
    }

    return -1;
  }, [inputValueRushEntryRate, inputValueRushContinuationRate]);

  // シミュレーション
  const handleSimulation = useCallback(() => {
    if (formValidation.length > 0) {
      alert("入力値を確認してください");
      return;
    }

    const count = handleFirstHit();

    const rushCount = handleRush();

    const isRush = rushCount !== -1;

    setLogs((prev) => [
      ...prev,
      {
        firstHitCount: count,
        isRush: isRush,
        extendedGame: isRush ? rushCount + 1 : 1,
        production: isRush
          ? Math.floor(
              Number(inputValueGuaranteedPayout) * rushCount +
                Number(inputValueFirstPayout),
            )
          : Math.floor(Number(inputValueFirstPayout)),
        usage: Math.floor((count / Number(inputValueTurnover)) * 250),
      },
    ]);
  }, [
    formValidation,
    inputValueGuaranteedPayout,
    inputValueFirstPayout,
    inputValueTurnover,
    handleRush,
    handleFirstHit,
  ]);

  // リセット
  const handleReset = () => {
    setLogs([]);
    setIsAccordianOpen(true);
  };

  // 平均
  const averages = useMemo(() => {
    if (logs.length === 0) return null;

    const totals = logs.reduce(
      (acc, log) => {
        acc.firstHitCount += log.firstHitCount;
        acc.rushCount += log.isRush ? 1 : 0;
        acc.extendedGame += log.extendedGame;
        acc.production += log.production;
        acc.usage += log.usage;
        return acc;
      },
      {
        firstHitCount: 0,
        rushCount: 0,
        extendedGame: 0,
        production: 0,
        usage: 0,
      },
    );

    // 少数第2位まで表示ようにする関数
    const round = (num: number) => Math.round(num * 100) / 100;

    const averages = {
      firstHitCount: round(totals.firstHitCount / logs.length),
      rushCount: totals.rushCount,
      extendedGame: round(totals.extendedGame / logs.length),
      production: totals.production,
      usage: totals.usage,
    };

    return averages;
  }, [logs]);

  const graphData = useMemo(() => {
    let sumFirstHitCount = 0;
    let sumAllUsage = 0;
    const data = logs.map((log, index) => {
      sumFirstHitCount += log.firstHitCount;
      sumAllUsage += log.production - log.usage;
      return {
        x: sumFirstHitCount,
        y: sumAllUsage,
      };
    });

    return data;
  }, [logs]);

  return (
    <main className={styles["main-wrapper"]}>
      <h1 className={styles.title}>パチンコシミュレーション</h1>
      <div className={styles.form}>
        <InputForm
          title="回転率"
          inputValue={inputValueTurnover}
          handleInputChange={setInputValueTurnover}
        />
        <InputForm
          title="初当たり確率"
          inputValue={inputValueProbabilityFirstHit}
          handleInputChange={setInputValueProbabilityFirstHit}
        />
        <InputForm
          title="Rush突入率"
          inputValue={inputValueRushEntryRate}
          handleInputChange={setInputValueRushEntryRate}
        />
        <InputForm
          title="Rush継続率"
          inputValue={inputValueRushContinuationRate}
          handleInputChange={setInputValueRushContinuationRate}
        />
        <InputForm
          title="初当たり出玉"
          inputValue={inputValueFirstPayout}
          handleInputChange={setInputValueFirstPayout}
        />
        <InputForm
          title="確変当たり出玉"
          inputValue={inputValueGuaranteedPayout}
          handleInputChange={setInputValueGuaranteedPayout}
        />
      </div>
      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.button}
          onClick={handleSimulation}
        >
          1回
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            for (let i = 0; i < 10; i++) {
              handleSimulation();
            }
          }}
        >
          10回
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            for (let i = 0; i < 100; i++) {
              handleSimulation();
            }
          }}
        >
          100回
        </button>
        <button type="button" className={styles.button} onClick={handleReset}>
          リセット
        </button>
      </div>
      {averages && (
        <div className={styles.total}>
          <h2 className={styles.title}>合計/平均</h2>
          <p>{(averages.production - averages.usage) * 4}円</p>
          <div className={styles.texts}>
            <p className={styles.text}>
              初当たり平均回転数
              <br />
              {averages.firstHitCount}
            </p>
            <p className={styles.text}>
              Rush突入
              <br />
              {averages.rushCount}/{logs.length}
            </p>
            <p className={styles.text}>
              平均連チャン数
              <br />
              {averages.extendedGame}
            </p>
            <p className={styles.text}>
              トータル獲得出玉
              <br />
              {averages.production}
            </p>
            <p className={styles.text}>
              トータル使用玉
              <br />
              {averages.usage}
            </p>
          </div>
        </div>
      )}
      {logs.length > 0 && (
        <div className={styles.graph}>
          <h2>グラフ</h2>
          <GraphChart data={graphData} />
        </div>
      )}
      {logs.length > 0 && (
        <div className={styles.log}>
          <h2 className={styles.title}>
            ログ
            <button
              className={styles.button}
              onClick={() => setIsAccordianOpen(!isAccordianOpen)}
              type="button"
            >
              {isAccordianOpen ? "▼" : "▲"}
            </button>
          </h2>
          {isAccordianOpen && (
            <div className={styles.logs}>
              {logs.map((log, index) => (
                <TextLog
                  {...log}
                  key={
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    index
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
