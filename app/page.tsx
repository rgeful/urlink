import Image from "next/image";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">

      <NavBar />
      <Hero />
      <Footer />
    </main>
  );
}