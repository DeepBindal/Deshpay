import { useEffect } from "react";
import { useAdminBannersStore } from "../../store/admin/banners.store";
import CreateBannerModal from "../components/CreateBannerModal";

export default function AdminBanners() {
  const {
    banners = [],
    loading,
    error,
    fetchBanners,
    toggleBanner,
  } = useAdminBannersStore();

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Banners
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Homepage promotional banners
          </p>
        </div>

        <CreateBannerModal />
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Loading banners…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <div className="font-semibold">Couldn’t load banners</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && banners.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-base font-bold text-slate-900">
            No banners yet
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Upload your first banner to show on the homepage.
          </div>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && banners.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {banners.map((b) => (
            <div
              key={b._id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="h-44 w-full object-cover"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${
                    b.isActive
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-rose-200"
                  }`}
                >
                  {b.isActive ? "Active" : "Disabled"}
                </span>
              </div>

              <div className="p-5">
                <div className="text-sm font-extrabold text-slate-900 line-clamp-1">
                  {b.title || "—"}
                </div>
                <div className="mt-1 text-sm text-slate-500 line-clamp-2">
                  {b.subtitle || "—"}
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={() => toggleBanner(b._id)}
                    className={`rounded-2xl px-4 py-2 text-xs font-extrabold shadow-sm transition active:scale-[0.99] ${
                      b.isActive
                        ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
                        : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    {b.isActive ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
