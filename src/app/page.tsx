import { Hero } from "@/components/landing/Hero";
import { Specialties } from "@/components/landing/Specialties";
import { WhyUs } from "@/components/landing/WhyUs";
import { ClinicInfo } from "@/components/landing/ClinicInfo";

export default function Home() {
  return (
    <main>
      <Hero />
      <Specialties />
      <WhyUs />
      <ClinicInfo />
    </main>
  );
}
