import HowToModal from "@/components/how-to-modal";
import LandingPageHero from "@/components/landing-page/landing-page-hero";
import LoginCard from "@/components/login-card";
import SignupCard from "@/components/signup-card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div id="landingPage" className="flex flex-col gap-10 h-full">
      <section className="flex flex-col md:flex-row justify-between items-center md:gap-20 gap-2">
        <div className="pt-20 pb-5 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
            Where your fitness meets the <span className="text-cyan-500">real rewards</span>
          </h1>
          <p className="mt-6 text-xl max-w-prose text-primary">
            Welcome to Endurance Vault. Train, log Strava activities, earn coins and buy card packs to expand your{" "}
            <span className="font-bold">World Tour cycling</span> collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <HowToModal />
            <Button variant="ghost">
              <a target="_blank" href="https://github.com/dodosaurus/endurancevault">
                Open source codebase &rarr;
              </a>
            </Button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <SignupCard />
          {/* <LoginCard /> */}
        </div>
      </section>
      <section className="flex flex-col justify-center items-center my-5 gap-10 pt-10">
        <LandingPageHero />
        <h1 className="max-w-[1000px] text-center text-3xl font-bold tracking-tight text-primary sm:text-4xl md:mt-5">
          Unlock your potential by motivating yourself and your friends buy acquiring more common,{" "}
          <span className="text-green-600">uncommon</span>, <span className="text-sky-600">rare</span>,{" "}
          <span className="text-violet-400">epic</span> and <span className="text-amber-600">legendary</span> cards!
        </h1>
      </section>
    </div>
  );
}
