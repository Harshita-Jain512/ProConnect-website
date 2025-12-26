import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import UserLayout from "@/layout/UserLayout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <Head>
        <title>Connect with Friends</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer__left}>
            <p>Connect with Friends without Exaggeration</p>
            <p>A True social media platform, with stories no blufs</p>
            <div
              className={styles.buttonJoin}
              onClick={() => {
                router.push("/login");
              }}
            >
              <p>Join Now</p>
            </div>
          </div>
          <div className={styles.mainContainer__right}>
            <img src="images/Connections.jpeg" alt="Connections" />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
