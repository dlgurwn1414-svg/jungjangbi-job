import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UrgentJobs from "@/components/UrgentJobs";
import WorkerCTA from "@/components/WorkerCTA";
import EquipmentCategories from "@/components/EquipmentCategories";
import Footer from "@/components/Footer";
import PopularWorkers from "@/components/PopularWorkers";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <UrgentJobs />
        <PopularWorkers />
        <WorkerCTA />
        <EquipmentCategories />
      </main>

      <Footer />
    </>
  );
}