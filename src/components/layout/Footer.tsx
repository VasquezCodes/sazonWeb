import { Mail } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { PolkaBand } from "@/components/ui/PolkaBand";

// lucide-react dropped every trademarked brand glyph (Instagram, Facebook,
// Twitter, etc. are no longer exported from the installed package), so the
// Instagram/Facebook marks below are pulled from Simple Icons instead. Mail
// stays a lucide icon since it's a generic (non-brand) glyph.
//
// The colour is baked into the Simple Icons URL, so these two are white to match
// the footer's `celeste` ground and have to be revisited if that ground changes.
const socialIconClasses =
  "opacity-80 transition-all duration-200 hover:opacity-100 hover:scale-110";

export function Footer() {
  return (
    /* Direction 1b specifies the hero only. The footer is extrapolated from it:
       cream is the page's ground, so the footer takes `celeste` at full strength
       to close the page and to give the accent one large surface. */
    <footer className="relative mt-16 bg-celeste text-white">
      <WaveDivider className="absolute -top-12 left-0 h-12 w-full" flip />
      <div className="mx-auto flex max-w-(--shell) flex-col items-center gap-6 px-6 py-16 text-center">
        <Wordmark tone="white" />
        <p className="max-w-md text-sm text-white/90">
          Venezuelan street food, cooked fresh and served with sazón,
          wherever the truck lands next across Australia.
        </p>
        <div className="flex items-center gap-5">
          <a href="#top" aria-label="Instagram" className={socialIconClasses}>
            <img
              src="https://cdn.simpleicons.org/instagram/ffffff"
              alt=""
              width={22}
              height={22}
            />
          </a>
          <a href="#top" aria-label="Facebook" className={socialIconClasses}>
            <img
              src="https://cdn.simpleicons.org/facebook/ffffff"
              alt=""
              width={22}
              height={22}
            />
          </a>
          <a
            href="mailto:hello@sazonstreetfood.com.au"
            aria-label="Email"
            className="text-white transition-opacity duration-200 hover:opacity-70"
          >
            <Mail size={22} />
          </a>
        </div>
      </div>
      <PolkaBand className="h-4 w-full" />
      {/* Full white. This is the smallest text on the page and `celeste` leaves
          little room to fade it — /80 lands at 4.26:1, under AA. */}
      <p className="bg-celeste pb-4 pt-4 text-center text-xs text-white">
        © {new Date().getFullYear()} Sazón Venezuelan Street Food. All rights
        reserved.
      </p>
    </footer>
  );
}
