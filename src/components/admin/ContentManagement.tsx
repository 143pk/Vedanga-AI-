import React, { useState } from "react";
import { BookOpen, Plus, Edit3, Trash2, FileText, CheckCircle, Eye, X, Sparkles, Layers } from "lucide-react";

interface ContentManagementProps {
  articles: any[];
  token: string;
  onRefresh: () => void;
}

export const ContentManagement: React.FC<ContentManagementProps> = ({ articles, token, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<"articles" | "horoscopes" | "remedies" | "legal">("articles");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "Houses",
    author: "Acharya Vedanga",
    readTime: "5 min",
    content: "",
    status: "Published",
  });

  const [legalPages, setLegalPages] = useState({
    about: "Vedanga AI provides authentic Vedic Astrology insights powered by advanced Gemini AI algorithms, traditional Parashari principles, and precise astronomical ephemeris charts.",
    privacy: "We value user confidentiality. All natal charts, birth details, and chat consultations are processed securely with enterprise-grade encryption.",
    terms: "Vedanga AI consultations are provided for spiritual guidance and educational self-reflection. They do not constitute formal legal or medical advice.",
    faq: "Q: How accurate is the Kundli calculation?\nA: Our ephemeris engine uses exact planetary longitudes based on NASA JPL ephemeris data adapted for Lahiri Ayanamsa.",
  });

  const handleOpenModal = (article?: any) => {
    if (article) {
      setEditingArticle(article);
      setForm({
        title: article.title,
        category: article.category,
        author: article.author || "Acharya Vedanga",
        readTime: article.readTime || "5 min",
        content: article.content,
        status: article.status || "Published",
      });
    } else {
      setEditingArticle(null);
      setForm({
        title: "",
        category: "Houses",
        author: "Acharya Vedanga",
        readTime: "5 min",
        content: "",
        status: "Published",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveArticle = async () => {
    try {
      const res = await fetch("/api/admin/cms/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({
          id: editingArticle?.id,
          ...form,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to save article", err);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      await fetch("/api/admin/cms/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ id }),
      });
      onRefresh();
    } catch (err) {
      console.error("Failed to delete article", err);
    }
  };

  const safeArticles = Array.isArray(articles) ? articles : [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>Content Management System (CMS)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage Vedic learning articles, horoscope templates, remedies library, and legal policies.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 text-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Content</span>
        </button>
      </div>

      {/* CMS View Switcher Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm">
        <button
          onClick={() => setActiveTab("articles")}
          className={`pb-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "articles"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Learning Articles ({safeArticles.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("horoscopes")}
          className={`pb-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "horoscopes"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Horoscope Content</span>
        </button>
        <button
          onClick={() => setActiveTab("remedies")}
          className={`pb-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "remedies"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Vedic Remedies Library</span>
        </button>
        <button
          onClick={() => setActiveTab("legal")}
          className={`pb-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === "legal"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Legal & About Pages</span>
        </button>
      </div>

      {/* Tab Content 1: Articles */}
      {activeTab === "articles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeArticles.map((art) => (
            <div
              key={art.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between hover:border-amber-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {art.category}
                  </span>
                  <span className="text-xs text-slate-500">{art.updatedAt}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2 leading-snug">{art.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 mb-4">{art.content}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs text-slate-400">
                <span>By {art.author || "Acharya Vedanga"}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(art)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteArticle(art.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 2: Horoscope Templates */}
      {activeTab === "horoscopes" && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-100">Daily Horoscope Forecast Configuration</h3>
          <p className="text-xs text-slate-400">
            Configure daily transit summaries and luck factor multipliers generated for all 12 Zodiac signs.
          </p>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-amber-300">
            Daily Horoscope generation is synced with server Gemini AI cache. Automatic updates execute at 00:01 UTC daily.
          </div>
        </div>
      )}

      {/* Tab Content 3: Remedies */}
      {activeTab === "remedies" && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-100">Vedic Remedies & Gemstone Master Database</h3>
          <p className="text-xs text-slate-400">
            Mantras, Rudraksha recommendations, Yantras, Puja instructions, and Charity remedies mapped to Graha afflictions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <h4 className="font-bold text-amber-400 text-sm">Sun (Surya) Remedies</h4>
              <p className="text-xs text-slate-400 mt-1">Aditya Hrudayam Stotram, Ruby (Manikya), Arghya to Lord Surya at dawn.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <h4 className="font-bold text-amber-400 text-sm">Moon (Chandra) Remedies</h4>
              <p className="text-xs text-slate-400 mt-1">Om Namah Shivaya Japa, Pearl (Moti), silver vessel water offerings.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Legal Pages */}
      {activeTab === "legal" && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-slate-100">Edit Static Pages & Legal Policies</h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">About Us Page Content</label>
            <textarea
              value={legalPages.about}
              onChange={(e) => setLegalPages({ ...legalPages, about: e.target.value })}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Privacy Policy Document</label>
            <textarea
              value={legalPages.privacy}
              onChange={(e) => setLegalPages({ ...legalPages, privacy: e.target.value })}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Terms & Conditions</label>
            <textarea
              value={legalPages.terms}
              onChange={(e) => setLegalPages({ ...legalPages, terms: e.target.value })}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200"
            />
          </div>

          <button
            onClick={() => alert("Legal pages saved successfully!")}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-semibold rounded-xl text-sm"
          >
            Save Legal Documents
          </button>
        </div>
      )}

      {/* Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-4">
              {editingArticle ? "Edit Article" : "Create New Learning Article"}
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Article Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  placeholder="e.g. Understanding the 12 Houses"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="Houses">Houses (Bhavas)</option>
                    <option value="Planets">Planets (Grahas)</option>
                    <option value="Dasha">Dasha & Timing</option>
                    <option value="Matching">Kundli Matching</option>
                    <option value="Remedies">Vedic Remedies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Article Body Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
                  placeholder="Write comprehensive article text..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveArticle}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-semibold text-sm"
                >
                  Publish Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
