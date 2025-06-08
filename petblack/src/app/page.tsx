import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Image
                    className={styles.logo}
                    src="/istockphoto-1188966913-612x612.jpg"
                    alt="Next.js logo"
                    width={612}
                    height={612}
                    priority
                />
            </main>
        </div>
    );
}
