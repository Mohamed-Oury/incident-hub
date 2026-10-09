"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Archive,
  Reply,
  Search,
  Filter,
  CheckCircle,
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  content: string;
  read: boolean;
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/admin/messages");
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        if (data.length > 0 && !selectedMessage) {
          setSelectedMessage(data[0]);
        }
      } else {
        console.error("Erreur lors du chargement des messages");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, read: true } : m))
        );
        if (selectedMessage?.id === messageId) {
          setSelectedMessage((prev) => (prev ? { ...prev, read: true } : null));
        }
      }
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        if (selectedMessage?.id === messageId) {
          const remaining = messages.filter((m) => m.id !== messageId);
          setSelectedMessage(remaining.length > 0 ? remaining[0] : null);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du message:", error);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "unread"
        ? !message.read
        : message.read;

    const matchesSearch =
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (message.subject && message.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter((m) => !m.read).length;
  const readCount = messages.filter((m) => m.read).length;
  const todayCount = messages.filter((m) => {
    const msgDate = new Date(m.createdAt).toDateString();
    const today = new Date().toDateString();
    return msgDate === today;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7d1538]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-8 bg-[#7d1538] rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          </div>
          <p className="text-gray-600 text-base">
            Gérez les messages de contact reçus
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 space-y-1">
          <p className="text-3xl font-bold text-[#7d1538]">{messages.length}</p>
          <p className="text-sm font-medium text-gray-500">Total Messages</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 space-y-1">
          <p className="text-3xl font-bold text-[#7d1538]">{unreadCount}</p>
          <p className="text-sm font-medium text-gray-500">Non Lus</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 space-y-1">
          <p className="text-3xl font-bold text-[#7d1538]">{readCount}</p>
          <p className="text-sm font-medium text-gray-500">Lus</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 space-y-1">
          <p className="text-3xl font-bold text-[#7d1538]">{todayCount}</p>
          <p className="text-sm font-medium text-gray-500">Aujourd'hui</p>
        </div>
      </div>

      {/* Grille principale Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des messages (2 Colonnes) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 space-y-4">
            {/* Header de la boite & filtres */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Boîte de réception</h2>

              <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === "all"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === "unread"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Non lus {unreadCount > 0 && `(${unreadCount})`}
                </button>
                <button
                  onClick={() => setFilter("read")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === "read"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Lus
                </button>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou sujet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7d1538] text-xs text-gray-900"
              />
            </div>

            {/* Liste des cartes messages */}
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  Aucun message
                </h3>
                <p className="text-xs text-gray-500">
                  {filter === "all"
                    ? "Aucun message reçu pour le moment."
                    : filter === "unread"
                    ? "Tous vos messages sont lus."
                    : "Aucun message lu."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMessages.map((message) => {
                  const isSelected = selectedMessage?.id === message.id;
                  return (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.read) {
                          markAsRead(message.id);
                        }
                      }}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-[#7d1538] bg-rose-50/50 shadow-sm"
                          : !message.read
                          ? "border-blue-200 bg-blue-50/40 hover:bg-blue-50/70"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {message.read ? (
                              <MailOpen className="w-4 h-4 text-gray-400 shrink-0" />
                            ) : (
                              <Mail className="w-4 h-4 text-[#7d1538] shrink-0" />
                            )}
                            <span
                              className={`text-sm font-semibold truncate ${
                                !message.read ? "text-gray-900" : "text-gray-700"
                              }`}
                            >
                              {message.name}
                            </span>
                            <span className="text-xs text-gray-400 truncate">
                              ({message.email})
                            </span>
                            {!message.read && (
                              <span className="px-2 py-0.5 bg-[#7d1538] text-white text-[10px] font-bold rounded-full uppercase">
                                Nouveau
                              </span>
                            )}
                          </div>

                          <p
                            className={`text-xs mb-1 line-clamp-1 ${
                              !message.read ? "font-bold text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {message.subject || "Pas de sujet"}
                          </p>

                          <p className="text-xs text-gray-500 line-clamp-1">
                            {message.content}
                          </p>

                          <p className="text-[11px] text-gray-400 mt-2">
                            {new Date(message.createdAt).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(message.id);
                          }}
                          className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Supprimer le message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Détail du message (1 Colonne) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">
              Détail du message
            </h2>

            {selectedMessage ? (
              <div className="space-y-6 pt-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {selectedMessage.subject || "Pas de sujet"}
                  </h3>
                  <div className="text-xs text-gray-600 space-y-1.5 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <p>
                      <strong className="text-gray-800">De :</strong> {selectedMessage.name}
                    </p>
                    <p>
                      <strong className="text-gray-800">Email :</strong>{" "}
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-[#7d1538] underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </p>
                    <p>
                      <strong className="text-gray-800">Date :</strong>{" "}
                      {new Date(selectedMessage.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="flex items-center space-x-2 pt-1">
                      <strong className="text-gray-800">Statut :</strong>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          selectedMessage.read
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {selectedMessage.read ? "Lu" : "Non lu"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed bg-white p-3 border border-gray-100 rounded-xl">
                    {selectedMessage.content}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <button
                    onClick={() => {
                      const subject = `Re: ${selectedMessage.subject || "Votre message"}`;
                      const body = `\n\n\n--- Message original ---\nDe: ${selectedMessage.name}\nDate: ${new Date(
                        selectedMessage.createdAt
                      ).toLocaleString("fr-FR")}\n\n${selectedMessage.content}`;
                      window.open(
                        `mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                          subject
                        )}&body=${encodeURIComponent(body)}`
                      );
                    }}
                    className="w-full py-2.5 bg-[#7d1538] hover:bg-[#63102c] text-white rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center transition-colors"
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Répondre par email
                  </button>

                  <button
                    onClick={() => {
                      deleteMessage(selectedMessage.id);
                    }}
                    className="w-full py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer le message
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-xs text-gray-500">
                  Sélectionnez un message pour afficher ses détails
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
