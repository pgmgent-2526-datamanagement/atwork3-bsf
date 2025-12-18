import Image from "next/image";
import styles from "./QRCodeBlock.module.css";
import { CountdownTimer } from "./CountdownTimer";

type Props = {
  title: string;
  description?: string;
  imageSrc: string;
  endTime: string; 
};

export default function QRCodeBlock({
  title,
  description,
  imageSrc,
  endTime,
}: Props) {
  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}

      <Image
        src={imageSrc}
        alt={title}
        width={240}
        height={240}
        priority
      />

      {/* ⏱️ puur visueel */}
      <CountdownTimer endTime={endTime} />
    </div>
  );
}
