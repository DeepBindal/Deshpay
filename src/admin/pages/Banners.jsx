import { useEffect } from "react";
import { useAdminBannersStore } from "../../store/admin/banners.store";
import CreateBannerModal from "../components/CreateBannerModal";

export default function AdminBanners() {
  const { banners, loading, error, fetchBanners, toggleBanner } =
    useAdminBannersStore();

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold">Banners</h1>
          <p className="text-sm text-slate-500">Homepage promotional banners</p>
        </div>

        <CreateBannerModal />
      </div>

      {loading && <div>Loading banners…</div>}
      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div
            key={b._id}
            className="rounded-2xl border bg-white overflow-hidden shadow-sm"
          >
            <img
              src={b.imageUrl}
              alt={b.title}
              className="h-40 w-full object-cover"
            />

            <div className="p-4 space-y-2">
              <div className="font-bold">{b.title}</div>
              <div className="text-sm text-slate-500">{b.subtitle}</div>

              <div className="flex justify-between items-center pt-2">
                <span
                  className={`text-xs font-semibold ${
                    b.isActive ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {b.isActive ? "Active" : "Disabled"}
                </span>

                <button
                  onClick={() => toggleBanner(b._id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    b.isActive
                      ? "bg-rose-500 text-white"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {b.isActive ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
