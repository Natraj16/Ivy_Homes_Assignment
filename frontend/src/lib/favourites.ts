export function getSavedListingIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const user = localStorage.getItem('ivy_user');
    if (!user) return [];
    const email = JSON.parse(user).email;
    const key = `ivy_saved_${email}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveListingId(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const user = localStorage.getItem('ivy_user');
    if (!user) return;
    const email = JSON.parse(user).email;
    const key = `ivy_saved_${email}`;
    const saved = getSavedListingIds();
    if (!saved.includes(id)) {
      localStorage.setItem(key, JSON.stringify([...saved, id]));
    }
  } catch (e) {
    console.error("Failed to save listing", e);
  }
}

export function removeListingId(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const user = localStorage.getItem('ivy_user');
    if (!user) return;
    const email = JSON.parse(user).email;
    const key = `ivy_saved_${email}`;
    const saved = getSavedListingIds();
    localStorage.setItem(key, JSON.stringify(saved.filter(x => x !== id)));
  } catch (e) {
    console.error("Failed to remove listing", e);
  }
}
