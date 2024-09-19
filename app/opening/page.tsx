import OpenedCards from "@/components/app-card/opened-cards";
import BackButton from "@/components/opening/back-button";
import ScrollToTop from "@/components/scroll-to-top";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { verifySession } from "@/server/auth/session";
import { openingSync } from "@/server/interface/synchronizers";

export default async function Opening() {
  const { athleteId } = await verifySession();
  const { newestCards } = await openingSync(athleteId as number);

  return (
    <div id="opening" className="flex-grow flex justify-center items-center w-full">
      <ScrollToTop />
      <Card className="w-full max-w-screen-xl">
        <CardHeader className="flex flex-col gap-2 text-center">
          <CardTitle>NICE! You have 4 new cards</CardTitle>
        </CardHeader>
        <CardContent>
          <OpenedCards newestCards={newestCards} />
          <div className="flex justify-center mt-4">
            <BackButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}