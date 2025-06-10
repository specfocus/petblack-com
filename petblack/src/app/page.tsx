import Image from "next/image";
import styles from "./page.module.css";

const images = [
    {alt: 'dog', src: '/istockphoto-1188966913-612x612.jpg', height: 612, width: 612},
    {alt: 'bird', src: '/photo-1709439681846-60a076f48892_small.jpg', height: 720, width: 480},
    {alt: 'cat', src: '/blackcat_Lifeonwhite_Alamy_Stock_Photo.jpeg', height: 855, width: 656},
    {alt: 'fish', src: '/117919784-black-goldfish-isolated-on-background.jpg', height: 450, width: 450},
    // {alt: 'dog and cat', src: '/360_F_316422277_s4yn3aOAojJnQPZE1SfKOFIPvSKqCxjv.jpg', height: 360, width: 548}
];

// Export revalidate to regenerate page every 5 seconds
export const revalidate = 5;

export default function Home() {
    const index = (Date.now() >> Math.round((3 * Math.random()))) % images.length;
    const props = images[index];
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Image
                    {...props}
                    className={styles.logo}
                    priority
                />
            </main>
        </div>
    );
}
