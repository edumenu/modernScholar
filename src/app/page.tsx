import Image from "next/image";
import { Button } from "@/components/ui/button/button";
import { CTAButton } from "@/components/ui/button/cta-button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      {/* <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
        <Button variant="default" size="lg">
          Hello World
        </Button>
        <Button variant="secondary" size="lg">
          Hello World
        </Button>
        <Button variant="outline" size="lg">
          Hello World
        </Button>
        <Button variant="ghost" size="lg">
          Hello World
        </Button>
        <Button variant="destructive" size="lg">
          Hello World
        </Button>
      </div>
      <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
        <CTAButton label="Get Started" variant="primary" />
        <CTAButton label="Learn More" variant="secondary" />
      </div> */}
    </div>
  );
}
