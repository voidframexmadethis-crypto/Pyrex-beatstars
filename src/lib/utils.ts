export const getSafeKey = (item: any, index: number, prefix: string = 'item') => {
  if (!item) return `${prefix}-empty-${index}`;
  const uniqueId = item.id || item.uuid || item.slug || item.title || item.name || item.trackId;
  return uniqueId ? `${prefix}-${uniqueId}-${index}` : `${prefix}-fallback-${index}`;
};
