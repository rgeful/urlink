import NavBar from "../components/landing/NavBar";
import Hero from "../components/landing/Hero";
import Hero3 from "../components/landing/Hero3";
import Hero2 from "../components/landing/Hero2";
import Footer from "../components/landing/Footer";
import MarqueeComponent from "@/components/landing/Marquee";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">

      <NavBar />
      <Hero />
      <Hero3 />
      <div className="py-16">
        <MarqueeComponent />
      </div>
      <Hero2 />
      <Footer />
    </main>
  );
}