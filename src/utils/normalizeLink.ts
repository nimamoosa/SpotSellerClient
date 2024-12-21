export default function normalizeSiteLink(link: string): string {
  try {
    const url = new URL(link);
    return `${url.protocol}//${url.host}`;
  } catch (error) {
    return link; // Return the original input if invalid
  }
}
