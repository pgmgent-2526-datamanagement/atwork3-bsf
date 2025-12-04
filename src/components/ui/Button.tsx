import styles from "./Button.module.css";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, ...props }: Props) {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
}
