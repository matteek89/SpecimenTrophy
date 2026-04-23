let leaderboardData = {};

const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");
const selectedValue = document.getElementById("selectedValue");

const leaderboardHead = document.getElementById("leaderboardHead");
const leaderboardBody = document.getElementById("leaderboardBody");
const tableTitle = document.getElementById("tableTitle");
const leaderboardTable = document.getElementById("leaderboardTable");

const API_URL = "https://matteek89-specimentrophy.vercel.app/api/topplistor-tvaman";

function getDropdownItems() {
  return dropdownMenu.querySelectorAll(".dropdown-item");
}

function setActiveDropdownItem(value) {
  getDropdownItems().forEach((item) => {
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
      <th>Deltagare</th>
      <th>Lag</th>
      <th>Vikt</th>
      <th>Datum</th>
      <th>Poäng</th>
    </tr>
  `;

  if (!rows || rows.length === 0) {
    leaderboardBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="6">Ingen data för vald art ännu.</td>
      </tr>
    `;
    return;
  }

  leaderboardBody.innerHTML = rows
    .slice(0, 10)
    .map((row) => `
      <tr>
        <td>${row.placering ?? ""}</td>
        <td>${row.namn ?? ""}</td>
        <td>${row.lag ?? ""}</td>
        <td>${row.vikt ?? ""}</td>
        <td>${row.datum ?? ""}</td>
        <td>${row.poang ?? ""}</td>
      </tr>
    `)
    .join("");
}

function renderTotalTable(rows) {
  tableTitle.textContent = "Totalen";
  leaderboardTable.className = "total-table";

  leaderboardHead.innerHTML = `
    <tr>
      <th>#</th>
      <th>Lag</th>
      <th>Poäng</th>
      <th>Antal</th>
    </tr>
  `;

  if (!rows || rows.length === 0) {
    leaderboardBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">Ingen totaldata ännu.</td>
      </tr>
    `;
    return;
  }

  leaderboardBody.innerHTML = rows
    .map((row) => `
      <tr>
        <td>${row.placering ?? ""}</td>
        <td>${row.lag ?? row.namn ?? ""}</td>
        <td>${row.poang ?? 0}</td>
        <td>${row.antal ?? 0}</td>
      </tr>
    `)
    .join("");
}

function renderPointPickerTable(rows) {
  tableTitle.textContent = "Bäste poängplockare";
  leaderboardTable.className = "total-table";

  leaderboardHead.innerHTML = `
    <tr>
      <th>#</th>
      <th>Deltagare</th>
      <th>Poäng</th>
    </tr>
  `;

  if (!rows || rows.length === 0) {
    leaderboardBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="3">Ingen data ännu.</td>
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
      </tr>
    `)
    .join("");
}

function renderSelected(value) {
  const rows = leaderboardData[value] || [];
  selectedValue.textContent = value;
  setActiveDropdownItem(value);

  if (value === "Totalen") {
    renderTotalTable(rows);
  } else if (value === "Bäste poängplockare") {
    renderPointPickerTable(rows);
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
  dropdownMenu.classList.contains("active") ? closeDropdown() : openDropdown();
}

function buildDropdownFromData(data) {
  dropdownMenu.innerHTML = "";

  const keys = Object.keys(data || {});
  const special = ["Totalen", "Bäste poängplockare"];
  const species = keys.filter((key) => !special.includes(key));
  const orderedKeys = [
    ...species,
    ...special.filter((key) => keys.includes(key))
  ];

  orderedKeys.forEach((key, index) => {
    const div = document.createElement("div");
    div.className = "dropdown-item";
    if (index === 0) div.classList.add("active");
    div.dataset.value = key;
    div.setAttribute("role", "option");
    div.textContent = key;

    div.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      renderSelected(key);
      closeDropdown();
    });

    dropdownMenu.appendChild(div);
  });
}

async function loadLeaderboardData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Kunde inte läsa topplistor");
    }

    leaderboardData = data;
    buildDropdownFromData(leaderboardData);

    const firstKey =
      Object.keys(leaderboardData).find(
        (key) => key !== "Totalen" && key !== "Bäste poängplockare"
      ) ||
      Object.keys(leaderboardData)[0];

    if (firstKey) {
      renderSelected(firstKey);
    }
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

document.addEventListener("click", (event) => {
  if (!event.target.closest(".custom-dropdown")) {
    closeDropdown();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDropdown();
  }
});

loadLeaderboardData();
