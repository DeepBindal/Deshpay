import { useState } from "react";
import { useAdminBannersStore } from "../../store/admin/banners.store";

export default function CreateBannerModal() {
  const { createBanner } = useAdminBannersStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: null,
  });

  const submit = async () => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("subtitle", form.subtitle);
    fd.append("image", form.image);

    await createBanner(fd);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm"
      >
        Add Banner
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-extrabold">Create Banner</h2>

            <input
              className="w-full border rounded-xl px-3 py-2 text-sm"
              placeholder="Title"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input
              className="w-full border rounded-xl px-3 py-2 text-sm"
              placeholder="Subtitle"
              onChange={(e) =>
                setForm({
                  ...form,
                  subtitle: e.target.value,
                })
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({
                  ...form,
                  image: e.target.files[0],
                })
              }
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="border rounded-lg px-3 py-1.5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="bg-indigo-600 text-white rounded-lg px-4 py-1.5 text-sm"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
