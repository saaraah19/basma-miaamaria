"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import {
  useMessagesQuery,
  useDevisRequestsQuery,
  useMarkMessageRead,
  useMarkDevisRead,
  useDeleteMessage,
  useDeleteDevisRequest,
} from "@/lib/admin-queries";
import "./messages.css";

function DetailPanel({ item, kind }) {
  return (
    <tr>
      <td colSpan={5} className="message-detail-cell">
        <div className="message-detail-row">
          <span className="message-detail-label">Email</span>
          <a href={`mailto:${item.email}`}>{item.email}</a>
        </div>
        {item.phone && (
          <div className="message-detail-row">
            <span className="message-detail-label">Téléphone</span>
            <a href={`tel:${item.phone.replace(/\s/g, "")}`}>{item.phone}</a>
          </div>
        )}

        {kind === "messages" ? (
          <div className="message-detail-row">
            <span className="message-detail-label">Message</span>
            <p className="message-detail-text">{item.message}</p>
          </div>
        ) : (
          <>
            {item.surface && (
              <div className="message-detail-row">
                <span className="message-detail-label">Surface</span>
                <span>{item.surface}</span>
              </div>
            )}
            {item.budget && (
              <div className="message-detail-row">
                <span className="message-detail-label">Budget</span>
                <span>{item.budget}</span>
              </div>
            )}
            {item.details && (
              <div className="message-detail-row">
                <span className="message-detail-label">Détails</span>
                <p className="message-detail-text">{item.details}</p>
              </div>
            )}
          </>
        )}
      </td>
    </tr>
  );
}

function Row({ item, kind, isOpen, onToggle, onMarkRead, onDelete }) {
  const [copied, setCopied] = useState(false);
  const subject = kind === "messages" ? item.subject : `Demande de devis — ${item.projectType}`;
  const mailtoHref = `mailto:${item.email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;

  const copyEmail = async () => {
    await navigator.clipboard.writeText(item.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <tr
        style={{ fontWeight: item.isRead ? 400 : 700, background: isOpen ? "var(--color-hover)" : undefined }}
      >
        <td style={{ paddingLeft: "1.5rem" }}>
          {!item.isRead && <span className="unread-dot" aria-label="Non lu" />}
          {item.name}
        </td>
        <td>{subject}</td>
        <td>{new Date(item.createdAt).toLocaleDateString("fr-FR")}</td>
        <td>
          <div className="row-actions">
            <button className="btn-secondary" onClick={onToggle}>
              {isOpen ? "▲ Masquer" : "👁 Voir"}
            </button>
            <a className="btn-secondary" href={mailtoHref}>✉️ Répondre</a>
            <button className="btn-secondary" onClick={copyEmail} title="Copier l'adresse email">
              {copied ? "✓ Copié" : "📋 Copier"}
            </button>
            {!item.isRead && (
              <button className="btn-secondary" onClick={() => onMarkRead(item.id)}>
                ✓ Marquer lu
              </button>
            )}
            <button className="btn-danger" onClick={() => onDelete(item)}>🗑</button>
          </div>
        </td>
      </tr>
      {isOpen && <DetailPanel item={item} kind={kind} />}
    </>
  );
}

function MessagesContent() {
  const [tab, setTab] = useState("messages");
  const [toDelete, setToDelete] = useState(null);
  const [openId, setOpenId] = useState(null);

  const { data: messages = [], isLoading: loadingMsg } = useMessagesQuery();
  const { data: devis = [], isLoading: loadingDevis } = useDevisRequestsQuery();

  const markMsgRead = useMarkMessageRead();
  const markDevisReadMutation = useMarkDevisRead();
  const deleteMsg = useDeleteMessage();
  const deleteDevisMutation = useDeleteDevisRequest();

  const list = tab === "messages" ? messages : devis;
  const isLoading = tab === "messages" ? loadingMsg : loadingDevis;
  const unreadCount = list.filter((i) => !i.isRead).length;

  const switchTab = (t) => {
    setTab(t);
    setOpenId(null);
  };

  return (
    <>
      <div className="content-tab-bar">
        <button className={tab === "messages" ? "active" : ""} onClick={() => switchTab("messages")}>
          Contact {messages.some((m) => !m.isRead) && "🔴"}
        </button>
        <button className={tab === "devis" ? "active" : ""} onClick={() => switchTab("devis")}>
          Devis {devis.some((d) => !d.isRead) && "🔴"}
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        {isLoading ? (
          <p className="projects-loading">Chargement…</p>
        ) : list.length === 0 ? (
          <div className="empty-state">
            <p>Aucune demande pour l&apos;instant.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: "1.5rem" }}>
                  Nom ({unreadCount} non lu{unreadCount !== 1 ? "s" : ""})
                </th>
                <th>{tab === "messages" ? "Sujet" : "Type de projet"}</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <Row
                  key={item.id}
                  item={item}
                  kind={tab}
                  isOpen={openId === item.id}
                  onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                  onMarkRead={(id) =>
                    (tab === "messages" ? markMsgRead : markDevisReadMutation).mutate(id)
                  }
                  onDelete={(item) => setToDelete({ ...item, kind: tab })}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {toDelete && (
        <ConfirmModal
          title="Supprimer cette demande ?"
          message="Cette action est irréversible."
          onConfirm={() => {
            (toDelete.kind === "messages" ? deleteMsg : deleteDevisMutation).mutate(toDelete.id);
            setToDelete(null);
            setOpenId(null);
          }}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}

export default function MessagesPage() {
  return (
    <AdminLayout title="Messages & Demandes de devis">
      <MessagesContent />
    </AdminLayout>
  );
}