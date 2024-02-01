import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  // const recipes = await getRecipes();

  return (
    <main>
      <section className="pt-16">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-2xl sm:text-2xl md:text-2xl lg:text-4xl">
            Getting started with Armitage and Sourcecred{" "}
          </h2>
        </div>
      </section>
    </main>
  );
}
