"use client";

import { useState, useMemo, useEffect } from "react";
import ProjectCard from "./ProjectCard";

const ALL_LABEL = "Tous";

export default function ProjectsFilterGrid({ projects, categoryNames }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_LABEL);

  // The page is pre-rendered once for everybody, so the category can't come
  // from the server any more: read it from the URL (?category=…) on arrival.
  // Done in an effect (not useSearchParams) so the static HTML still contains
  // every project card for search engines.
  const namesKey = categoryNames.join("|");
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("category");
    if (wanted && namesKey.split("|").includes(wanted)) setActiveCategory(wanted);
  }, [namesKey]);

  const filtered = useMemo(() => {
    const byCategory =
      activeCategory === ALL_LABEL ? projects : projects.filter((p) => p.category === activeCategory);

    const query = search.trim().toLowerCase();
    if (!query) return byCategory;

    return byCategory.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [projects, activeCategory, search]);

  return (
    <>
      <div className="projects-search">
        <input
          type="text"
          className="projects-search-input"
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Rechercher un projet"
        />
        {search && (
          <button
            type="button"
            className="projects-search-clear"
            onClick={() => setSearch("")}
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>

      <nav className="projects-filters" aria-label="Filtrer par catégorie">
        {[ALL_LABEL, ...categoryNames].map((cat) => {
          const href =
            cat === ALL_LABEL ? "/projects/" : `/projects/?category=${encodeURIComponent(cat)}`;
          return (
            // A real link (crawlable, works without JS); with JS we just
            // switch the filter in place and keep the URL shareable.
            <a
              key={cat}
              href={href}
              className={activeCategory === cat ? "active" : ""}
              aria-current={activeCategory === cat ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory(cat);
                window.history.replaceState(null, "", href);
              }}
            >
              {cat}
            </a>
          );
        })}
      </nav>

      {filtered.length === 0 ? (
        <p className="projects-empty">
          {search
            ? `Aucun projet ne correspond à "${search}".`
            : "Aucun projet dans cette catégorie pour le moment."}
        </p>
      ) : (
        <div className="projects-grid">
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} priority={index < 4} />
          ))}
        </div>
      )}
    </>
  );
}