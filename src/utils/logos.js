// vite: .env -> VITE_LOGO_DEV_KEY=xxxx (publishable key)
const LOGO_DEV_KEY = import.meta.env.VITE_LOGO_DEV_KEY;

// Prefer name lookup (less manual work)
// (For higher accuracy on utilities, you can later switch specific ones to domain lookup)
export const logoUrlByName = (name, { size = 96, theme = "light" } = {}) =>
  `https://img.logo.dev/name/${encodeURIComponent(name)}?token=${LOGO_DEV_KEY}&size=${size}&format=png&theme=${theme}`;

// Optional: domain lookup (best accuracy when you know the domain)
export const logoUrlByDomain = (domain, { size = 96, theme = "light" } = {}) =>
  `https://img.logo.dev/${domain}?token=${LOGO_DEV_KEY}&size=${size}&format=png&theme=${theme}`;
