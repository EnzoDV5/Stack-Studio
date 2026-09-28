import { Suspense } from 'react'
import { AppRoutes, preloadRoute } from '@/app/router'
import { Cursor } from '@/components/layout/Cursor'
import { Footer } from '@/components/layout/Footer'
import { GrainOverlay } from '@/components/layout/GrainOverlay'
import { Header } from '@/components/layout/Header'
import { PageTransition } from '@/components/layout/PageTransition'
import { Preloader } from '@/components/layout/Preloader'
import { SkipLink } from '@/components/layout/SkipLink'
import { ToneController } from '@/components/layout/ToneController'
import { closingCta, closingCtaCode } from '@/data/pages'
import { chromeCopy, footerNav, legalNav, primaryCta, primaryNav } from '@/data/navigation'
import { site, whatsappHref } from '@/data/site'
import { usePageviewTracking } from '@/hooks/useAnalytics'
import { useScrollRefresh } from '@/hooks/useScrollRefresh'
import { ClosingCta } from '@/sections/shared/ClosingCta'

/** The app shell: global chrome around the routed page. The app layer is where data meets layout. */
export function App() {
  usePageviewTracking()
  useScrollRefresh()

  return (
    <>
      <SkipLink label={chromeCopy.skipLink} />
      <Preloader label={chromeCopy.preloaderLabel} />

      <Header
        nav={primaryNav}
        cta={primaryCta}
        homeLabel={chromeCopy.homeLabel}
        menuLabel={chromeCopy.menuLabel}
        menuOpenLabel={chromeCopy.menuOpen}
        menu={{
          label: chromeCopy.menuLabel,
          closeLabel: chromeCopy.menuClose,
          email: site.email,
          socials: site.socials,
        }}
      />

      <PageTransition preload={preloadRoute} label={chromeCopy.transitionLabel}>
        {(location) => (
          <>
            <main id="main" tabIndex={-1} className="outline-none">
              <Suspense fallback={<div className="min-h-dvh" aria-hidden="true" />}>
                <AppRoutes location={location} />
              </Suspense>
            </main>
            {!location.pathname.startsWith(primaryCta.to) && (
              <ClosingCta
                content={closingCta}
                codeLines={closingCtaCode}
                location={`closing-band:${location.pathname}`}
              />
            )}
            <ToneController pathname={location.pathname} />
            <Footer
              headings={{
                contact: chromeCopy.contactHeading,
                social: chromeCopy.socialHeading,
                nav: chromeCopy.navHeading,
              }}
              email={site.email}
              whatsapp={{ href: whatsappHref(), label: chromeCopy.whatsappLabel }}
              responsePromise={site.responsePromise}
              socials={site.socials}
              nav={footerNav}
              legalNav={legalNav}
              copyright={site.legal.copyright}
              location={`${site.location.city}, ${site.location.country}`}
              backToTopLabel={chromeCopy.backToTop}
            />
          </>
        )}
      </PageTransition>

      <Cursor />
      <GrainOverlay />
    </>
  )
}
