let leaderboardData = {};
let galleryData = [];

const TOPPLISTOR_URL = "https://matteek89-specimentrophy.vercel.app/api/topplistor";
const GALLERY_URL = "https://script.google.com/macros/s/AKfycbwSmQto2auLW0HnvmEJtgbICMDLfICicsHbEleftelti_EcU7LI2zDdWloVGAOPW4e2Zw/exec?mode=gallery";

const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");
const selectedValue = document.getElementById("selectedValue");
const dropdownItems = document.querySelectorAll(".dropdown-item");

const leaderboardHead = document.getElementById("leaderboardHead");
const leaderboardBody = document.getElementById("leaderboardBody");
const tableTitle = document.getElementById("tableTitle");
const leaderboardTable = document.getElementById("leaderboardTable");

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeWeight(value) {
  return String(value ?? "").replace(/\s/g, "").replace(",", ".").trim();
}

function findImageForRow(species, row) {
  return galleryData.find((item) =>
    normalize(item.art) === normalize(species) &&
    normalize(item.deltagare) === normalize(row.namn) &&
    normalizeWeight(item.vikt) === normalizeWeight(row.vikt) &&
    normalize(item.datum) === normalize(row.datum)
  );
}

function openImageModal(imageUrl) {
  let modal = document.getElementById("imageModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "imageModal";
    modal.innerHTML = `
      <div class="image-modal-backdrop">
        <button class="image-modal-close" type="button">×</button>
        <img class="image-modal-img" src="" alt="Fångstbild">
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (
        event.target.id === "imageModal" ||
        event.target.classList.contains("image-modal-backdrop") ||
        event.target.classList.contains("image-modal-close")
      ) {
        closeImageModal();
      }
    });
  }

  modal.querySelector(".image-modal-img").src = imageUrl;
  modal.classList.add("show");
}

function closeImageModal() {
  const modal = document.getElementById("imageModal");
  if (modal) {
    modal.classList.remove("show");
    modal.querySelector(".image-modal-img").src = "";
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeImageModal();
    closeDropdown();
  }
});

function setActiveDropdownItem(value) {
  dropdownItems.forEach((item) => {
    const active = item.dataset.value === value;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", active ? "true" : "false");
  });
}

function renderSpeciesTable(species, rows) {
  tableTitle.textContent = species;
  leaderboardTable.className = "species-table";

  leaderboardHead.innerHTML = `
    <tr>
      <th>#</th>
      <th>Namn</th>
      <th>Vikt</th>
      <th>Datum</th>
      <th>Poäng</th>
    </tr>
  `;

  if (!rows || rows.length === 0) {
    leaderboardBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="5">Ingen data för vald art ännu.</td>
      </tr>
    `;
    return;
  }

  leaderboardBody.innerHTML = rows
    .slice(0, 12)
    .map((row, index) => {
      const imageMatch = findImageForRow(species, row);
      const clickableClass = imageMatch ? "clickable-row" : "";

      return `
        <tr class="${clickableClass}" data-index="${index}">
          <td>${row.placering ?? ""}</td>
          <td>${row.namn ?? ""}</td>
          <td>${row.vikt ?? ""}</td>
          <td>${row.datum ?? ""}</td>
          <td>${row.poang ?? ""}</td>
        </tr>
      `;
    })
    .join("");

  leaderboardBody.querySelectorAll("tr").forEach((tr) => {
    const row = rows[Number(tr.dataset.index)];
    const imageMatch = findImageForRow(species, row);

    if (imageMatch) {
      tr.addEventListener("click", () => {
        openImageModal(imageMatch.imageUrl);
      });
    }
  });
}

function renderTotalTable(rows) {
  tableTitle.textContent = "Bäste poängplockare";
  leaderboardTable.className = "total-table";

  leaderboardHead.innerHTML = `
    <tr>
      <th>#</th>
      <th>Namn</th>
      <th>Poäng</th>
      <th>Antal</th>
    </tr>
  `;

  if (!rows || rows.length === 0) {
    leaderboardBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">Ingen data för poängplockare ännu.</td>
      </tr>
    `;
    return;
  }

  leaderboardBody.innerHTML = rows
    .map((row) => `
      <tr>
        <td>${row.placering ?? ""}</td>
        <td>${row.namn ?? ""}</td>
        <td>${row.poang ?? 0}</td>
        <td>${row.antal ?? 0}</td>
      </tr>
    `)
    .join("");
}

function renderSelected(value) {
  const rows = leaderboardData[value] || [];
  selectedValue.textContent = value;
  setActiveDropdownItem(value);

  if (value === "Bäste poängplockare") {
    renderTotalTable(rows);
  } else {
    renderSpeciesTable(value, rows);
  }
}

function openDropdown() {
  dropdownMenu.classList.add("active");
  dropdownButton.classList.add("open");
  dropdownButton.setAttribute("aria-expanded", "true");
}

function closeDropdown() {
  dropdownMenu.classList.remove("active");
  dropdownButton.classList.remove("open");
  dropdownButton.setAttribute("aria-expanded", "false");
}

function toggleDropdown() {
  if (dropdownMenu.classList.contains("active")) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

async function loadGalleryData() {
  try {
    const response = await fetch(`${GALLERY_URL}&t=${Date.now()}`);
    const data = await response.json();
    galleryData = data.gallery || [];
  } catch (error) {
    console.warn("Kunde inte läsa galleri-data:", error);
    galleryData = [];
  }
}

async function loadLeaderboardData() {
  try {
    await loadGalleryData();

    const response = await fetch(TOPPLISTOR_URL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Kunde inte läsa topplistor");
    }

    leaderboardData = data;
    renderSelected("Björkna");
  } catch (error) {
    console.error("Fel vid hämtning av topplistor:", error);

    leaderboardHead.innerHTML = `
      <tr>
        <th>Meddelande</th>
      </tr>
    `;

    leaderboardBody.innerHTML = `
      <tr class="empty-row">
        <td>Kunde inte läsa topplistor just nu.</td>
      </tr>
    `;
  }
}

dropdownButton.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  toggleDropdown();
});

dropdownButton.addEventListener("touchstart", (event) => {
  event.stopPropagation();
}, { passive: true });

dropdownItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    renderSelected(item.dataset.value);
    closeDropdown();
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".custom-dropdown")) {
    closeDropdown();
  }
});

loadLeaderboardData();
