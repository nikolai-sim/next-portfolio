import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import { useRef, useEffect } from "react";
import { getPositions } from "../components/singleComponents/Utils/Utils";
import Hero from "../components/Home/Hero";
import SoulAether from "../components/Home/SoulAether";
import KiwiKickz from "../components/Home/KiwiKickz";
import Card from "../components/singleComponents/Card";
import Tria from "../components/Home/Tria";
import Loader from "../components/singleComponents/loader/Loader";

const saDescription =
  " 3D WebGL experiential website marketing NFTs, Graphic Novels, Mobile Games and more...";

const kkDescription = `E-commerce platform for sneaker on-selling.`;

const pfdecription = `Mobile word game app developed using react-native. Essentially hangman minus the capital punishment.`;

const Home: NextPage = () => {
  const fwdRef = useRef<HTMLHeadingElement>(null);
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Nikolai Sim Portfolio</title>
          <meta
            name="description"
            content="Portfolio of software developer Nikolai Sim"
          />
          <link rel="icon" href="/fav.png" />
        </Head>

        <main className={styles.main}>
          {/* <Loader /> */}
          <Hero />
          <Card
            title="Soul Æther"
            description={saDescription}
            subtitle={"website by Psychoactive Studios"}
            rightCol={<Tria />}
            link={"https://soulaether.xyz"}
          />
          <Card
            title="Kiwikickz"
            description={kkDescription}
            subtitle={"Final Project for Dev Academy Aotearoa"}
            //   rightCol={<Tria />}
            link={"https://kiwikickz.herokuapp.com/"}
          />
          <Card
            title="Pizza Fun"
            description={pfdecription}
            link={"https://expo.dev/@nikolai-sim/pizza-fun"}
          />
          <Card title="More " subtitle="coming soon..." />
        </main>
      </div>
    </>
  );
};

export default Home;
