import { test, expect, type Page } from '@playwright/test'

async function checkLayoutAndContrast(page: Page) {
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all(document.querySelector('main')?.getAnimations().map(a => a.finished) || []) })
  const evidence = await page.evaluate(() => {
    function rgba(color: string) { const values = color.match(/[\d.]+/g)?.map(Number) || []; return [values[0] / 255, values[1] / 255, values[2] / 255, values[3] ?? 1] }
    function luminance(color: number[]) { return color.slice(0, 3).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0) }
    const pairs = new Map<string, number>()
    for (const node of document.querySelectorAll<HTMLElement>('h1,h2,p,span,button,a,label,li')) {
      if (!Array.from(node.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()) || !node.getBoundingClientRect().width) continue
      const style = getComputedStyle(node)
      if (style.visibility === 'hidden' || style.display === 'none') continue
      const ancestors: HTMLElement[] = []; let parent: HTMLElement | null = node
      while (parent) { ancestors.unshift(parent); parent = parent.parentElement }
      let background = [1, 1, 1]
      for (const ancestor of ancestors) { const color = rgba(getComputedStyle(ancestor).backgroundColor); background = background.map((v, i) => color[i] * color[3] + v * (1 - color[3])) }
      const color = rgba(style.color); const foreground = background.map((v, i) => color[i] * color[3] + v * (1 - color[3]))
      const a = luminance(foreground); const b = luminance(background)
      pairs.set(`${foreground.slice(0, 3).map(v => Math.round(v * 255))} / ${background.map(v => Math.round(v * 255))}`, (Math.max(a, b) + .05) / (Math.min(a, b) + .05))
    }
    return { overflow: document.documentElement.scrollWidth > innerWidth, pairs: Array.from(pairs), failures: Array.from(pairs).filter(([, ratio]) => ratio < 4.5) }
  })
  expect(evidence.overflow).toBe(false)
  expect(evidence.failures).toEqual([])
  return evidence
}

async function start(page: Page) {
  await page.goto('/')
  await page.getByRole('radio', { name: 'Trades & contracting' }).click()
  await page.getByRole('radio', { name: 'A steady share of my week' }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
}
async function plan(page: Page) {
  await start(page)
  await page.getByRole('button', { name: 'Chasing invoices and payments' }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Build my plan', exact: true }).click()
}
test('single selection, multiple selections, Back, Continue, persistence and logo', async ({ page }, info) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Choose a business type')
  await page.getByRole('radio', { name: 'Home services' }).click()
  await page.getByRole('radio', { name: 'Trades & contracting' }).click()
  await expect(page.getByRole('radio', { name: 'Home services' })).toHaveAttribute('aria-checked', 'false')
  await page.getByRole('radio', { name: 'A steady share of my week' }).click()
  await expect(page.locator('[role=radio][aria-checked=true]')).toHaveCount(2)
  await checkLayoutAndContrast(page)
  await page.screenshot({ path: info.outputPath('step-1.png'), fullPage: true })
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Choose at least one')
  const invoice = page.getByRole('button', { name: 'Chasing invoices and payments' })
  const copying = page.getByRole('button', { name: 'Copying details between tools by hand' })
  await invoice.click(); await copying.click()
  await expect(page.locator('[aria-pressed=true]')).toHaveCount(2)
  await invoice.click()
  await expect(copying).toHaveAttribute('aria-pressed', 'true')
  await expect(invoice).toHaveAttribute('aria-pressed', 'false')
  await checkLayoutAndContrast(page)
  await page.screenshot({ path: info.outputPath('step-2.png'), fullPage: true })
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Your plan will contain' })).toBeVisible()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(copying).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page.getByRole('radio', { name: 'Trades & contracting' })).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByRole('radio', { name: 'A steady share of my week' })).toHaveAttribute('aria-checked', 'true')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await checkLayoutAndContrast(page)
  await page.screenshot({ path: info.outputPath('step-3.png'), fullPage: true })
  await page.getByRole('button', { name: 'Build my plan', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'A practical place to start.' })).toBeVisible()
  await expect(page.getByText('Stop copying the same details between tools')).toBeVisible()
  await expect(page.getByText('Not estimated from these answers.')).toHaveCount(2)
  const contrast = await checkLayoutAndContrast(page)
  await info.attach('rendered-contrast', { body: JSON.stringify(contrast), contentType: 'application/json' })
  await page.screenshot({ path: info.outputPath('plan.png'), fullPage: true })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.locator('header').getByRole('button', { name: 'LEVARUM', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'What kind of business do you run?' })).toBeVisible()
})
test('keyboard selection and navigation focus', async ({ page }) => {
  await page.goto('/')
  const home = page.getByRole('radio', { name: 'Home services' })
  await home.focus(); await home.press('ArrowRight')
  await expect(page.getByRole('radio', { name: 'Trades & contracting' })).toHaveAttribute('aria-checked', 'true')
  const workload = page.getByRole('radio', { name: 'A little each week' })
  await workload.focus(); await workload.press('Space')
  await page.getByRole('button', { name: 'Continue', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Where does the week actually go?' })).toBeFocused()
  const invoice = page.getByRole('button', { name: 'Chasing invoices and payments' })
  await invoice.focus(); await invoice.press('Space')
  await expect(invoice).toHaveAttribute('aria-pressed', 'true')
})
test('failed submission preserves input; confirmation requires saved response', async ({ page }) => {
  await plan(page)
  await page.getByRole('button', { name: 'Request a 15-min call' }).click()
  await page.getByLabel('Your email').fill('launch-check@example.com')
  await page.getByLabel('Hours spent on back-office work each week').selectOption('5 to 15')
  await page.getByLabel('I agree that Levarum').check()
  await page.route('**/api/leads', route => route.fulfill({ status: 503, json: { error: 'Could not save intake' } }))
  await page.getByRole('button', { name: 'Send my call request' }).click()
  await expect(page.getByRole('alert')).toContainText('We could not confirm')
  await expect(page.getByLabel('Your email')).toHaveValue('launch-check@example.com')
  await page.unroute('**/api/leads')
  let payload: Record<string, unknown> = {}
  await page.route('**/api/leads', route => { payload = route.request().postDataJSON(); return route.fulfill({ status: 200, json: { saved: true } }) })
  await page.getByRole('button', { name: 'Send my call request' }).click()
  await expect(page.getByRole('heading', { name: 'Call request received.' })).toBeVisible()
  expect(payload).toMatchObject({ business: 'Trades and contracting', hours: '5 to 15', pains: ['invoices'], consent: true, intent: 'call' })
  await expect(page.getByText('This is not a confirmed appointment.', { exact: false })).toBeVisible()
})
test('all original Figma assets load', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('radio', { name: 'Trades & contracting' }).click()
  const images = await page.locator('img').evaluateAll(nodes => nodes.map(node => ({ src: (node as HTMLImageElement).src, loaded: (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0 })))
  expect(images.length).toBeGreaterThan(0)
  expect(images.filter(image => !image.loaded)).toEqual([])
})
