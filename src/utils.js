export const hashRole = async (role) => {
  const secret = "attendict_2026_secret_salt";
  const encoder = new TextEncoder();
  const data = encoder.encode(role + secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};
