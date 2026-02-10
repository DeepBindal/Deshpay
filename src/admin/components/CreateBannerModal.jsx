import { useEffect, useMemo, useState } from "react";
import { useAdminBannersStore } from "../../store/admin/banners.store";

export default function CreateBannerModal() {
  const { createBanner } = useAdminBannersStore();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: null,
  });

  const previewUrl = useMemo(() => {
    if (!form.image) return "";
    return URL.createObjectURL(form.image);
  }, [form.image]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    // cleanup object URL
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetForm = () => {
    setForm({ title: "", subtitle: "", image: null });
    setErr("");
    setSaving(false);
  };

  const close = () => {
    setOpen(false);
    resetForm();
  };

  const submit = async () => {
    setErr("");

    if (!form.title.trim()) return setErr("Title is required.");
    if (!form.image) return setErr("Please select an image.");

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("subtitle", form.subtitle.trim());
    fd.append("image", form.image);

    try {
      setSaving(true);
      await createBanner(fd);
      close();
    } catch (e) {
      setErr(e?.message || "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99]"
      >
        + Add Banner
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
            onClick={close}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Create Banner
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Upload an image and set title/subtitle for homepage banner.
                </p>
              </div>

              <button
                onClick={close}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 p-6">
              {err && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {err}
                </div>
              )}

              {/* Preview */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Preview
                </div>
                <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-44 place-items-center text-sm text-slate-500">
                      No image selected
                    </div>
                  )}
                </div>
              </div>

              {/* Fields */}
              <Field
                label="Title"
                placeholder="e.g. Cashback Week is Live!"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <Field
                label="Subtitle"
                placeholder="e.g. Pay bills & get rewards"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />

              {/* File */}
              <div>
                <label className="ml-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Banner Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-slate-700 hover:file:bg-slate-200"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files?.[0] || null })
                  }
                />
                <div className="mt-1 ml-1 text-xs text-slate-500">
                  Recommended: 1200×500 (or similar wide banner)
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 p-6">
              <button
                onClick={close}
                disabled={saving}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="ml-1 text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <input
        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-200"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
