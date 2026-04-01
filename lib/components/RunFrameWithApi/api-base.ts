export const API_BASE = (() => {
  const envValue = (window as any).TSCIRCUIT_FILESERVER_API_BASE_URL
  if (envValue) {
    // If it's an absolute URL, make sure it's secure if the page is secure
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      envValue.startsWith("http://") &&
      !envValue.includes("localhost")
    ) {
      console.warn(
        `[VHL-API] Insecure API_BASE detected on HTTPS page: ${envValue}. Upgrading to https:`,
      )
      return envValue.replace("http://", "https://")
    }
    return envValue
  }
  return "/api"
})()
console.log(`[VHL-API] API_BASE initialized to: ${API_BASE}`)
