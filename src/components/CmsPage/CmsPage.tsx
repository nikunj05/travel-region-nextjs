'use client'
import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { useCmsStore } from '@/store/cmsStore'
import AboutUs from '@/components/AboutUs/AboutUs'
import './CmsPage.scss'

interface CmsPageProps {
  slug: string
}

export default function CmsPage({ slug }: CmsPageProps) {
  const locale = useLocale()
  const { currentPage, detailLoading, detailError, fetchPageBySlug, clearCurrentPage } = useCmsStore()

  useEffect(() => {
    fetchPageBySlug(slug)
    return () => {
      clearCurrentPage()
    }
  }, [slug, fetchPageBySlug, clearCurrentPage])

  const html = currentPage?.content || ''

  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [processedHtml, setProcessedHtml] = useState<string>(html)

  useEffect(() => {
    if (!html) {
      setProcessedHtml('')
      setHeadings([])
      return
    }
    if (typeof window === 'undefined') {
      setProcessedHtml(html)
      setHeadings([])
      return
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const found: { id: string; text: string; level: number }[] = []

    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

    // Collect native heading tags
    const headingsNodes = doc.querySelectorAll('h1, h2, h3, h4')
    headingsNodes.forEach((node) => {
      const text = node.textContent?.trim() || ''
      if (!text) return
      const level = Number(node.tagName.substring(1))
      let id = node.getAttribute('id') || slugify(text)
      let uniqueId = id
      let counter = 1
      while (doc.getElementById(uniqueId) && node.getAttribute('id') !== uniqueId) {
        uniqueId = `${id}-${counter++}`
      }
      node.setAttribute('id', uniqueId)
      if (level >= 2) {
        found.push({ id: uniqueId, text, level })
      }
    })

    // Handle CMS content that uses <p><strong>Heading</strong><br>...
    const strongParas = Array.from(doc.querySelectorAll('p > strong:first-child'))
      .map((strong) => strong.parentElement)
      .filter((p): p is HTMLElement => !!p)

    strongParas.forEach((p) => {
      // Only consider if the strong is the very first meaningful content
      const strong = p.querySelector('strong')
      if (!strong) return
      const text = (strong.textContent || '').trim()
      if (!text) return

      let id = p.getAttribute('id') || slugify(text)
      let uniqueId = id
      let counter = 1
      while (doc.getElementById(uniqueId) && p.getAttribute('id') !== uniqueId) {
        uniqueId = `${id}-${counter++}`
      }
      p.setAttribute('id', uniqueId)

      // Avoid duplicates if already captured via an existing heading
      const exists = found.some((h) => h.id === uniqueId || h.text === text)
      if (!exists) {
        found.push({ id: uniqueId, text, level: 2 })
      }
    })

    setHeadings(found)
    setProcessedHtml(doc.body.innerHTML)
  }, [html])

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      // Keep heading slightly below the sticky header
      const headerOffset = 130
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      setActiveId(id)
      history.replaceState(null, '', `#${id}`)
    }
  }

  // Active section tracking
  const [activeId, setActiveId] = useState<string | null>(null)
  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)
        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        root: null,
        rootMargin: '-130px 0px -60% 0px',
        threshold: [0, 0.2, 0.5, 1],
      }
    )

    const nodes: HTMLElement[] = headings
      .map((h) => document.getElementById(h.id) as HTMLElement | null)
      .filter((n): n is HTMLElement => n !== null)
    nodes.forEach((n) => observer.observe(n))

    return () => observer.disconnect()
  }, [headings])

  if (detailLoading) return <div className="container section-space-tb">Loading...</div>
  if (detailError) return <div className="container section-space-tb">{detailError}</div>
  if (!currentPage) return null

  // Render About Us page with special layout
  if (currentPage.about_us) {
    return <AboutUs page={currentPage} />
  }

  // Render Terms/Privacy Policy with sidebar TOC
  return (
    <div className="container section-space-tb cms-page">
      <div className="row">
        <aside className="col-lg-3 col-md-4 mb-4 mb-md-0">
          <nav aria-label="On this page" className="cms-toc">
            <div className="cms-toc-title">Introduction</div>
            <ul className="cms-toc-list">
              {headings.map((h) => (
                <li key={h.id} className={`cms-toc-item level-${h.level}`}>
                  <a
                    className={`cms-toc-link ${activeId === h.id ? 'active' : ''}`}
                    href={`#${h.id}`}
                    onClick={(e) => handleTocClick(e, h.id)}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="col-lg-9 col-md-8 cms-content">
          <h1 className="mb-3">{currentPage.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
        </div>
      </div>
    </div>
  )
}


