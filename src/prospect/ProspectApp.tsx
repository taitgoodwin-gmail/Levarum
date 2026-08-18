import { useEffect } from 'react'

import './site.css'

import { ROUTES, usePath } from '../router'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { HowItWorks } from './pages/HowItWorks'
import { WhatWeAutomate } from './pages/WhatWeAutomate'
import { Questions } from './pages/Questions'
import { Partners } from './pages/Partners'
import { Start } from './pages/Start'

/**
 * The prospect surface.
 *
 * This component and everything under ./pages, ./components and ./content is
 * the entire prospect rendering path. It imports no operator module and
 * renders no route into the console, which is how the never-reveal boundary is
 * held in the build rather than only in the copy — see
 * scripts/check-boundary.mjs, which fails CI if that ever stops being true.
 */

const TITLES: Record<string, string> = {
  [ROUTES.home]: 'Levarum — get your week back',
  [ROUTES.howItWorks]: 'How it works — Levarum',
  [ROUTES.whatWeAutomate]: 'What we automate — Levarum',
  [ROUTES.questions]: 'Questions — Levarum',
  [ROUTES.start]: 'Build my Game Plan — Levarum',
  [ROUTES.partners]: 'Implementation partners — Levarum',
}

export function ProspectApp() {
  const path = usePath()

  // A single-page app has to announce its own page changes; without this a
  // screen reader stays on the title of whichever page was loaded first.
  useEffect(() => {
    document.title = TITLES[path] ?? TITLES[ROUTES.home]
  }, [path])

  return (
    <div className="lv-page">
      <a className="lv-skip" href="#lv-main">
        Skip to content
      </a>

      <Nav current={path} hideStart={path === ROUTES.start} />

      <main id="lv-main" className="lv-main">
        {path === ROUTES.howItWorks ? (
          <HowItWorks />
        ) : path === ROUTES.whatWeAutomate ? (
          <WhatWeAutomate />
        ) : path === ROUTES.questions ? (
          <Questions />
        ) : path === ROUTES.start ? (
          <Start />
        ) : path === ROUTES.partners ? (
          <Partners />
        ) : (
          <Home />
        )}
      </main>

      <Footer current={path} />
    </div>
  )
}
