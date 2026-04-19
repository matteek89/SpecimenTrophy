const leaderboardData = {
  "Björkna": [
    { placering: 1, namn: "Mattias", vikt: "1450 g", datum: "2026-04-10", poang: 102 },
    { placering: 2, namn: "Anders Wimmerstedt", vikt: "1380 g", datum: "2026-04-09", poang: 96 },
    { placering: 3, namn: "Johan", vikt: "1320 g", datum: "2026-04-08", poang: 91 }
  ],
  "Brax": [
    { placering: 1, namn: "Mattias", vikt: "3820 g", datum: "2026-04-05", poang: 114 },
    { placering: 2, namn: "Peter", vikt: "3610 g", datum: "2026-04-03", poang: 108 }
  ],
  "Id": [
    { placering: 1, namn: "Anders Wimmerstedt", vikt: "2750 g", datum: "2026-04-04", poang: 98 }
  ],
  "Mört": [
    { placering: 1, namn: "Johan", vikt: "920 g", datum: "2026-04-01", poang: 85 }
  ],
  "Ruda": [],
  "Sarv": [],
  "Sutare": [],
  "Vimma": [],
  "Bäste poängplockare": [
    { placering: 1, namn: "Mattias", poang: 420, antal: 6 },
    { placering: 2, namn: "Anders Wimmerstedt", poang: 310, antal: 4 },
    { placering: 3, namn: "Johan", poang: 85, antal: 1 },
    { placering: 4, namn: "Peter", poang: 0, antal: 0 },
    { placering: 5, namn: "Kalle", poang: 0, antal: 0 },
    { placering: 6, namn: "Anna", poang: 0, antal: 0 }
  ]
};

const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");
const selectedValue = document.getElementById("selectedValue");
const dropdownItems = document.querySelectorAll(".dropdown-item");

const leaderboardHead = document.getElementById("leaderboardHead");
const leaderboardBody = document.getElementById("leaderboardBody");
const tableTitle = document.getElementById("tableTitle");
const tableElement = document.querySelector("table");

function setActiveDropdownItem(value) {
  dropdownItems.forEach((item) => {
    const isActive = item.dataset.value === value;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function renderSpeciesTable(species, rows) {
  tableTitle.textContent = species;
  tableElement.className = "species-table";

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
    .map((row) => `
      <tr>
        <td>${row.placering ?? ""}</td>
        <td>${row.namn ?? ""}</td>
        <td>${row.vikt ?? ""}</td>
        <td>${row.datum ?? ""}</td>
        <td>${row.poang ?? ""}</td>
      </tr>
    `)
    .join("");
}

function renderTotalTable(rows) {
  tableTitle.textContent = "Bäste poängplockare";
  tableElement.className = "total-table";

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

dropdownButton.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  toggleDropdown();
});

dropdownButton.addEventListener("touchend", (event) => {
  event.preventDefault();
  event.stopPropagation();
  toggleDropdown();
}, { passive: false });

dropdownItems.forEach((item) => {
  const handleSelect = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const value = item.dataset.value;
    renderSelected(value);
    closeDropdown();
  };

  item.addEventListener("click", handleSelect);
  item.addEventListener("touchend", handleSelect, { passive: false });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".custom-dropdown")) {
    closeDropdown();
  }
});

renderSelected("Björkna");
