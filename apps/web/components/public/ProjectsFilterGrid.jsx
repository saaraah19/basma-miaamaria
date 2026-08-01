"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ProjectCard from "./ProjectCard";

const ALL_LABEL = "Tous";

export default function ProjectsFilterGrid({ projects, categoryNames, activeCategory }) {
  const [search, setSearch] = useState("");

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
          const href = cat === ALL_LABEL ? "/projects" : `/projects?category=${encodeURIComponent(cat)}`;
          return (
            <Link
              key={cat}
              href={href}
              className={activeCategory === cat ? "active" : ""}
              aria-current={activeCategory === cat ? "true" : undefined}
            >
              {cat}
            </Link>
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