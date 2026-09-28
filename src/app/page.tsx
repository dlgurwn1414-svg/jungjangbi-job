import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WorkerCTA from "@/components/WorkerCTA";
import EquipmentCategories from "@/components/EquipmentCategories";
import Footer from "@/components/Footer";
import PopularWorkers from "@/components/PopularWorkers";
import RecommendedJobs from "@/components/RecommendedJobs";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <PopularWorkers />
        <RecommendedJobs />
        <WorkerCTA />
        <EquipmentCategories />
      </main>

      <Footer />
    </>
  );
}