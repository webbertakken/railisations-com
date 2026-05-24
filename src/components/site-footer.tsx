export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-inverse-surface border-outline-variant mt-auto w-full border-t">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-margin-mobile md:px-margin-desktop py-8 md:gap-gutter md:flex-row md:py-12">
        <span className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight opacity-90 transition-opacity hover:opacity-100">
          Copper Lessons
        </span>
        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-6">
          <a
            href="#privacy"
            className="font-label-sm text-label-sm text-primary hover:text-primary-fixed-dim underline transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            className="font-label-sm text-label-sm text-on-surface hover:text-primary-fixed-dim transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#accessibility"
            className="font-label-sm text-label-sm text-on-surface hover:text-primary-fixed-dim transition-colors"
          >
            Accessibility
          </a>
        </nav>
        <p className="font-label-sm text-label-sm text-on-surface text-center opacity-60 md:text-right">
          © {year} Industrial Heritage Archives. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
