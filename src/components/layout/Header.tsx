"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { UserMenu } from "@/components/auth/UserMenu";
import { useAuth } from "@/lib/auth/AuthProvider";
import { CLINIC, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[color:var(--color-border)]">
      <Container as="div" className="flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label={`Trang chủ ${CLINIC.name}`}
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--color-primary-bg)] overflow-hidden ring-2 ring-[color:var(--color-primary-soft)] group-hover:ring-[color:var(--color-primary)] transition">
            <Image
              src="/images/mascot/de-men-pointing.png"
              alt="Mascot chú Dế Mèn"
              fill
              className="object-cover object-top scale-125"
              sizes="48px"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs sm:text-sm text-[color:var(--color-text-soft)] font-medium">
              Phòng khám nhi đồng
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-[color:var(--color-accent)] tracking-wide">
              DẾ MÈN
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Menu chính">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full text-sm font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-primary-bg)] hover:text-[color:var(--color-primary-dark)] transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href={`tel:${CLINIC.phone}`}
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-primary-dark)] hover:text-[color:var(--color-primary)]"
            aria-label={`Gọi hotline ${CLINIC.phoneDisplay}`}
          >
            <PhoneIcon className="w-4 h-4" />
            {CLINIC.phoneDisplay}
          </a>
          {!loading && user ? (
            <UserMenu />
          ) : (
            <>
              <Link
                href="/dang-nhap"
                className="text-sm font-semibold text-[color:var(--color-text)] hover:text-[color:var(--color-primary-dark)] px-3 py-2"
              >
                Đăng nhập
              </Link>
              <Button href="/dang-ky-kham" size="sm" variant="primary">
                Đăng ký khám
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-[color:var(--color-text)] hover:bg-[color:var(--color-primary-bg)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label="Mở menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </Container>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "lg:hidden overflow-hidden transition-[max-height] duration-300 border-t border-[color:var(--color-border)]",
          mobileOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <Container className="py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-base font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-primary-bg)]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${CLINIC.phone}`}
            className="px-4 py-3 rounded-lg text-base font-semibold text-[color:var(--color-primary-dark)] flex items-center gap-2"
          >
            <PhoneIcon className="w-5 h-5" />
            {CLINIC.phoneDisplay}
          </a>
          {!loading && !user && (
            <Link
              href="/dang-nhap"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-base font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-primary-bg)]"
            >
              Đăng nhập
            </Link>
          )}
          <Button href="/dang-ky-kham" size="md" variant="primary" className="mt-2">
            Đăng ký khám
          </Button>
        </Container>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}
