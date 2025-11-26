import Image from "next/image";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import Hero3 from "../components/Hero3";
import Hero2 from "../components/Hero2";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">

      <NavBar />
      <Hero />
      <Hero3 />
      <Hero2 />
      <Footer />
    </main>
  );
}