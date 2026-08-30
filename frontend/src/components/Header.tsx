"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PunctuationMark } from "@/components/PunctuationMark";
import { Wordmark } from "@/components/Wordmark";

const LINKS = [
  { href: "/list", label: "Your List" },
  { href: "/about", label: "About" },
] as const;

/**
 * Shared across every page: the mark at column 1, the wordmark centred,
 * and the nav at column 12. Whichever page you are on, its own link
 * becomes the way back to the feed.
 */
export function Header() {
  const pathname = usePathname();

  return (
    <>
      <PunctuationMark />
      <Wordmark />

      <nav className="top-nav">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              className="top-nav__link"
              href={active ? "/" : link.href}
            >
              {active ? "Back to Feed" : link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
