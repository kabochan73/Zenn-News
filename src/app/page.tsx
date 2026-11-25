import { Suspense } from "react";
import { HomeEntryRedirect } from "@/components/marketing/HomeEntryRedirect";
import { LandingPage } from "@/components/marketing/LandingPage";
import { getCurrentSession } from "@/lib/auth";

async function HomeContent() {
  const session = await getCurrentSession();

  if (session) {
    return <HomeEntryRedirect />;
  }

  return <LandingPage />;
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
