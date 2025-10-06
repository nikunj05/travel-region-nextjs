"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCmsStore } from "@/store/cmsStore";
import AboutUs from "@/components/AboutUs/AboutUs";
import "./CmsPage.scss";

interface CmsPageProps {
  slug: string;
}

export default function CmsPage({ slug }: CmsPageProps) {
  const {
    currentPage,
    detailLoading,
    detailError,
    fetchPageBySlug,
    clearCurrentPage,
  } = useCmsStore();
// console.log(currentPage)
  useEffect(() => {
    fetchPageBySlug(slug);
    return () => {
      clearCurrentPage();
    };
  }, [slug, fetchPageBySlug, clearCurrentPage]);

  const html = currentPage?.content || "";

  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [processedHtml, setProcessedHtml] = useState<string>(html);

  useEffect(() => {
    if (!html) {
      setProcessedHtml("");
      setHeadings([]);
      return;
    }
    
    // Only process HTML on client side to avoid hydration mismatch
    if (typeof window === "undefined") {
      setProcessedHtml(html);
      setHeadings([]);
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const found: { id: string; text: string; level: number }[] = [];

    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    // Collect native heading tags
    const headingsNodes = doc.querySelectorAll("h1, h2, h3, h4");
    headingsNodes.forEach((node) => {
      const text = node.textContent?.trim() || "";
      if (!text) return;
      const level = Number(node.tagName.substring(1));
      const id = node.getAttribute("id") || slugify(text);
      let uniqueId = id;
      let counter = 1;
      while (
        doc.getElementById(uniqueId) &&
        node.getAttribute("id") !== uniqueId
      ) {
        uniqueId = `${id}-${counter++}`;
      }
      node.setAttribute("id", uniqueId);
      if (level >= 2) {
        found.push({ id: uniqueId, text, level });
      }
    });

    // Handle CMS content that uses <p><strong>Heading</strong><br>...
    const strongParas = Array.from(
      doc.querySelectorAll("p > strong:first-child")
    )
      .map((strong) => strong.parentElement)
      .filter((p): p is HTMLElement => !!p);

    strongParas.forEach((p) => {
      // Only consider if the strong is the very first meaningful content
      const strong = p.querySelector("strong");
      if (!strong) return;
      const text = (strong.textContent || "").trim();
      if (!text) return;

      const id = p.getAttribute("id") || slugify(text);
      let uniqueId = id;
      let counter = 1;
      while (
        doc.getElementById(uniqueId) &&
        p.getAttribute("id") !== uniqueId
      ) {
        uniqueId = `${id}-${counter++}`;
      }
      p.setAttribute("id", uniqueId);

      // Avoid duplicates if already captured via an existing heading
      const exists = found.some((h) => h.id === uniqueId || h.text === text);
      if (!exists) {
        found.push({ id: uniqueId, text, level: 2 });
      }
    });

    setHeadings(found);
    setProcessedHtml(doc.body.innerHTML);
  }, [html]);

  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      // Keep heading slightly below the sticky header
      const headerOffset = 130;
      const y =
        el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      history.replaceState(null, "", `#${id}`);
    }
  };

  // Active section tracking
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop
          );
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-130px 0px -60% 0px",
        threshold: [0, 0.2, 0.5, 1],
      }
    );

    const nodes: HTMLElement[] = headings
      .map((h) => document.getElementById(h.id) as HTMLElement | null)
      .filter((n): n is HTMLElement => n !== null);
    nodes.forEach((n) => observer.observe(n));

    return () => observer.disconnect();
  }, [headings]);

  if (detailLoading)
    return <div className="container section-space-tb">Loading...</div>;
  if (detailError)
    return <div className="container section-space-tb">{detailError}</div>;
  if (!currentPage) return null;

  // Render About Us page with special layout
  if (currentPage.about_us) {
    return <AboutUs page={currentPage} />;
  }

  // Render Terms/Privacy Policy with sidebar TOC
  return (
    <div className="privacy-policy-page section-space-b">
      {slug === 'privacy-policy' && (
        <section className="banner-section-common privacy-policy-banner-section">
          <div className="container">
            <div className="banner-content">
              <div className="banner-bradcumb-menu text-center">
                <div className="banner-bradcumb-inner">
                  <ul className="banner-bradcumb-list p-0 m-0">
                    <li className="banner-bradcumb-item">
                      <Link href="/" className="banner-bradcumb-link">
                        Home
                      </Link>
                    </li>
                    <span className="banner-bradcumb-arrow">
                      <svg
                        width="19"
                        height="18"
                        viewBox="0 0 19 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.25004 13.5L11.75 8.99996L7.25 4.5"
                          stroke="white"
                          stroke-width="1.125"
                          stroke-miterlimit="16"
                        />
                      </svg>
                    </span>
                    <li className="banner-bradcumb-item current-page">
                      Privacy & Policy
                    </li>
                  </ul>
                </div>
              </div>
              <div className="heading_section text-center">
                <h1 className="section-title">Privacy & Policy</h1>
                <p className="section-description">
                  Your privacy is important to us. This page explains how we
                  collect, <br /> use, and protect your personal information.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
      {slug === 'terms-conditions' && (
        <section className="banner-section-common terms-condition-banner-section">
          <div className="container">
            <div className="banner-content">
              <div className="banner-bradcumb-menu text-center">
                <div className="banner-bradcumb-inner">
                  <ul className="banner-bradcumb-list p-0 m-0">
                    <li className="banner-bradcumb-item">
                      <Link href="/" className="banner-bradcumb-link">
                        Home
                      </Link>
                    </li>
                    <span className="banner-bradcumb-arrow">
                      <svg
                        width="19"
                        height="18"
                        viewBox="0 0 19 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.25004 13.5L11.75 8.99996L7.25 4.5"
                          stroke="white"
                          stroke-width="1.125"
                          stroke-miterlimit="16"
                        />
                      </svg>
                    </span>
                    <li className="banner-bradcumb-item current-page">
                      Terms & Conditions
                    </li>
                  </ul>
                </div>
              </div>
              <div className="heading_section text-center">
                <h1 className="section-title">Terms & Conditions</h1>
                <p className="section-description">
                  Please read these terms carefully before using our hotel booking
                  services.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
      <div className="container">
        <div className="privacy-policy-content">
          <aside className="privacy-policy-sidebar">
            {/* <div className="privacy-policy-sidebar-inner"> */}
            <nav aria-label="On this page" className="side-bar-content">
              {/* <div className="cms-toc-title">Introduction</div> */}
              <ul className="pvc-sidebar-list">
                {headings.map((h) => (
                  <li
                    key={h.id}
                    className={`pvc-sidebar-item level-${h.level}`}
                  >
                    <a
                      className={`pvc-sidebar-link ${
                        activeId === h.id ? "active" : ""
                      }`}
                      href={`#${h.id}`}
                      onClick={(e) => handleTocClick(e, h.id)}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            {/* </div> */}
          </aside>
          <div className="privacy-policy-main cms-content">
            {/* <h1 className="mb-3">{currentPage.title}</h1> */}
            <div
              className="policy-content-wrapper"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
