(function () {
  const DIRECTORY_PATH = "Nuova cartella/";
  const DIRECTORY_URL = encodeURI(DIRECTORY_PATH);
  const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
  const grid = document.getElementById("patientGrid");

  if (!grid) {
    return;
  }

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function isImageFile(fileName) {
    const lower = fileName.toLowerCase();
    return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
  }

  function splitPatientInfo(fileName) {
    const noExtension = fileName.replace(/\.[^/.]+$/u, "");
    const parts = noExtension.split(" - ");
    const name = (parts.shift() || "Sconosciuto").trim();
    const diagnosis = (parts.join(" - ") || "Non specificata").trim();

    return { name, diagnosis };
  }

  function getFileNameFromHref(href, baseUrl) {
    try {
      const absolute = new URL(href, baseUrl);
      const pathname = absolute.pathname;
      const rawName = pathname.split("/").pop() || "";
      return decodeURIComponent(rawName);
    } catch {
      return "";
    }
  }

  function extractImageEntries(directoryHtml, responseUrl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(directoryHtml, "text/html");
    const anchors = Array.from(doc.querySelectorAll("a[href]"));

    const entries = anchors
      .map((anchor) => {
        const href = anchor.getAttribute("href") || "";
        const fileName = getFileNameFromHref(href, responseUrl);
        if (!fileName || !isImageFile(fileName)) {
          return null;
        }

        const imageUrl = new URL(href, responseUrl).toString();
        const info = splitPatientInfo(fileName);
        return {
          imageUrl,
          ...info,
        };
      })
      .filter(Boolean);

    entries.sort((a, b) => a.name.localeCompare(b.name, "it", { sensitivity: "base" }));
    return entries;
  }

  function renderPatients(entries) {
    if (!entries.length) {
      grid.innerHTML = '<p class="card">Nessun paziente trovato nella cartella.</p>';
      return;
    }

    const cards = entries.map((entry) => {
      const safeName = escapeHtml(entry.name);
      const safeDiagnosis = escapeHtml(entry.diagnosis);
      const safeImageUrl = escapeHtml(entry.imageUrl);

      return [
        '<article class="patient-item">',
        `  <img class="patient-photo" src="${safeImageUrl}" alt="${safeName}" loading="lazy" />`,
        "  <div>",
        `    <h3>${safeName}</h3>`,
        `    <p>${safeDiagnosis}</p>`,
        "  </div>",
        "</article>",
      ].join("\n");
    });

    grid.innerHTML = cards.join("\n");
  }

  async function initPatients() {
    try {
      const response = await fetch(DIRECTORY_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Directory non leggibile: ${response.status}`);
      }

      const html = await response.text();
      const entries = extractImageEntries(html, response.url);
      renderPatients(entries);
    } catch (error) {
      console.error(error);
      grid.innerHTML = '<p class="card">Impossibile caricare i pazienti automaticamente. Controlla che il server permetta la lista file della cartella.</p>';
    }
  }

  initPatients();
})();