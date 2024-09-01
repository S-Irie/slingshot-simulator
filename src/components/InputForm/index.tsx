import type { FC } from "react";
import styles from "./index.module.scss";

type InputFormProps = {
  title: string;
  inputValue: string;
  handleInputChange: (value: string) => void;
};

const InputForm: FC<InputFormProps> = ({
  title,
  inputValue,
  handleInputChange,
}) => {
  return (
    <div className={styles["input-form"]}>
      <p className={styles.title}>{title}</p>
      <input
        className={styles.input}
        type="text"
        value={inputValue}
        defaultValue={inputValue}
        onChange={(event) => handleInputChange(event.target.value)}
      />
    </div>
  );
};

export default InputForm;
