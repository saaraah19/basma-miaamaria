"use client";

import { useState } from "react";
import * as Icons from "react-icons/fa";
import { FiSearch, FiX } from "react-icons/fi";
import "./IconPicker.css";

const POPULAR_ICONS = [
  "FaHome", "FaBuilding", "FaCity", "FaTree", "FaPaintRoller",
  "FaCouch", "FaLightbulb", "FaHammer", "FaWrench", "FaRuler",
  "FaDraftingCompass", "FaHardHat", "FaBath", "FaBed", "FaUtensils",
];

export default function IconPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const iconList = Object.keys(Icons)
    .filter((name) => name.startsWith("Fa") && (search === "" || name.toLowerCase().includes(search.toLowerCase())))
    .slice(0, 60);

  const SelectedIcon = value && Icons[value] ? Icons[value] : null;

  const select = (iconName) => {
    onChange(iconName);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="icon-picker">
      <label>Icône</label>

      <div className="icon-picker-trigger" onClick={() => setIsOpen(!isOpen)}>
        {SelectedIcon ? (
          <div className="selected-icon">
            <SelectedIcon />
            <span>{value.replace("Fa", "")}</span>
          </div>
        ) : (
          <div className="selected-icon placeholder"><span>Choisir une icône</span></div>
        )}
        <span className="dropdown-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="icon-picker-dropdown">
          <div className="icon-picker-header">
            <div className="icon-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              {search && <FiX onClick={() => setSearch("")} className="clear-search" />}
            </div>
          </div>

          <div className="icon-grid">
            {iconList.map((iconName) => {
              const IconComponent = Icons[iconName];
              return (
                <div
                  key={iconName}
                  className={`icon-item ${value === iconName ? "selected" : ""}`}
                  onClick={() => select(iconName)}
                >
                  <IconComponent />
                  <span className="icon-name">{iconName.replace("Fa", "")}</span>
                </div>
              );
            })}
          </div>

          <div className="popular-icons">
            <div className="popular-title">Populaires</div>
            <div className="popular-grid">
              {POPULAR_ICONS.map((iconName) => {
                const IconComponent = Icons[iconName];
                return (
                  <div
                    key={iconName}
                    className={`popular-icon ${value === iconName ? "selected" : ""}`}
                    onClick={() => select(iconName)}
                    title={iconName}
                  >
                    <IconComponent />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
