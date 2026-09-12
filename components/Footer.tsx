import { Mail } from "lucide-react";
import { Logo } from "./Logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "./icons/SocialIcons";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Courses", href: "#courses" },
  { label: "Pricing", href: "#pricing" },
];

const MORE_LINKS = [
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#" },
];

const SOCIALS = [
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: YoutubeIcon, href: "#", label: "YouTube" },
  { icon: FacebookIcon, href: "#", label: "Facebook" },
  { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-slate-800/80 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-slate-500">
              Smarter Study. Brighter Tomorrow.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Quick Links</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white opacity-0 sm:opacity-100">
              &nbsp;
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 sm:mt-4">
              {MORE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Connect With Us</p>
            <div className="mt-4 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800/80 text-slate-400 transition-all duration-300 hover:border-accent/40 hover:text-accent hover:shadow-[0_0_15px_rgba(0,242,254,0.25)]"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="mt-5 text-xs uppercase tracking-wide text-slate-600">
              Have questions?
            </p>
            <a
              href="mailto:hello@medlearnix.com"
              className="mt-1.5 flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-accent"
            >
              <Mail className="h-4 w-4" />
              hello@medlearnix.com
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 text-xs text-slate-600 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} MedLearnix. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="transition-colors hover:text-accent">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-accent">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-accent">
              Contact
            </a>
          </div>
          <p className="font-hand text-base text-cyan-200/70">
            More nurses. A brighter tomorrow. <span className="text-pink-300">♡</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
