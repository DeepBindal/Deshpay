import { useEffect, useMemo, useState } from "react";

export default function ProviderModal({ provider, onClose, onSave, saving }) {
  const isEditing = !!provider?._id;

  const initial = useMemo(
    () => ({
      name: provider?.name || "",
      region: provider?.region || "",
      category: provider?.category || "",
      domain: provider?.domain || "",
      tags: (provider?.tags || []).join(", "),
      logoUrl: provider?.logoUrl || "",
    }),
    [provider],
  );

  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setForm(initial);
    setTouched(false);
  }, [initial]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.category.trim()) e.category = "Category is required";
    // domain is optional, but if you want required:
    // if (!form.domain.trim()) e.domain = "Domain is required";
    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0 && !saving;

  const handleChange = (field) => (evt) => {
    setTouched(true);
    setForm((p) => ({ ...p, [field]: evt.target.value }));
  };

  const handleSubmit = () => {
    setTouched(true);
    if (!canSubmit) return;

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      name: form.name.trim(),
      region: form.region.trim() || null,
      category: form.category.trim(),
      domain: form.domain.trim() || null,
      logoUrl: form.logoUrl.trim() || null,
      tags,
    };

    onSave?.(isEditing ? provider._id : null, payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              {isEditing ? "Edit Provider" : "Create Provider"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update provider information and save changes."
                : "Fill details to create a new provider."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          <Field
            label="Provider Name"
            placeholder="e.g. Airtel, Jio, PayTM"
            value={form.name}
            onChange={handleChange("name")}
            error={touched ? errors.name : null}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Category"
              placeholder="e.g. Mobile, DTH, Electricity"
              value={form.category}
              onChange={handleChange("category")}
              error={touched ? errors.category : null}
            />
            <Field
              label="Region"
              placeholder="e.g. India, Delhi, AP"
              value={form.region}
              onChange={handleChange("region")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Domain"
              placeholder="e.g. airtel.in"
              value={form.domain}
              onChange={handleChange("domain")}
            />
            <Field
              label="Logo URL"
              placeholder="https://..."
              value={form.logoUrl}
              onChange={handleChange("logoUrl")}
            />
          </div>

          <Field
            label="Tags"
            placeholder="e.g. prepaid, postpaid, fiber"
            helper="Comma separated. Example: prepaid, fiber, bills"
            value={form.tags}
            onChange={handleChange("tags")}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 p-6">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Provider"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, helper, error }) {
  return (
    <div>
      <label className="ml-1 text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <input
        className={`mt-1 w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition
          ${error ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200 focus:ring-2 focus:ring-indigo-200"}
        `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {helper && !error && (
        <div className="mt-1 ml-1 text-xs text-slate-500">{helper}</div>
      )}
      {error && (
        <div className="mt-1 ml-1 text-xs font-semibold text-rose-600">
          {error}
        </div>
      )}
    </div>
  );
}
