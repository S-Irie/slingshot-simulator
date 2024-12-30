import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styles from "./index.module.scss";

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button type="button" className={styles["button-base"]} {...props}>
      {children}
    </button>
  );
};

export default Button;
