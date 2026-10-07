import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shop/brand-divider";
import { Category } from "@/types";

interface ShopHeroProps {
  categories: Category[];
  buildCategoryHref: (categoryId?: string) => string;
}

export function ShopHero({ categories, buildCategoryHref }: ShopHeroProps) {
  const featured = categories.slice(0, 3);

  return (
    <section className="relative -mt-6 flex min-h-[55dvh] items-center overflow-hidden bg-zinc-900 sm:min-h-[65dvh] md:-mt-10">
      <Image
        src="/ImgGym.webp"
        alt=""
        aria-hidden
        fill
        loading="eager"
        fetchPriority="high"
        quality={50}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/75 to-zinc-950/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-brand/25 blur-3xl sm:size-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 size-64 rounded-full bg-brand/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[110rem] px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:px-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-6xl">
            Todo para tu <span className="text-brand">rendimiento</span>
          </h1>
          <p className="max-w-lg text-base text-zinc-300 sm:text-lg">
            Proteínas, creatinas, pre-entrenos y todo lo que necesitas para entrenar al máximo.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild className="h-10 px-5">
              <a href="#catalogo">
                Ver productos <ArrowRight />
              </a>
            </Button>
            {featured.map((category) => (
              <Button
                key={category.id}
                asChild
                variant="outline"
                className="h-10 border-zinc-700 bg-transparent px-4 text-zinc-200 hover:border-neon hover:bg-transparent hover:text-neon"
              >
                <Link href={buildCategoryHref(String(category.id))} scroll={false}>
                  {category.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
