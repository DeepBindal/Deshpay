export const groupProvidersByRegion = (providers = []) => {
  return providers.reduce((acc, p) => {
    const key = p.region || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});
};
