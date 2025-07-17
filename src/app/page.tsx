import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ValueProposition from "@/components/ValueProposition";
import ServicesGrid from "@/components/ServicesGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="gradient-bg min-h-screen">
      <Header />
      <HeroSection />
      <ValueProposition />
      <ServicesGrid />
      <TestimonialsSection />
      <ContactForm />
      <Footer />
    </main>
  );
}
