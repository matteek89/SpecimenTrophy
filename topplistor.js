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

const speciesSelect = document.getElementById("speciesSelect");
const leaderboardHead = document.getElementById("leaderboardHead");
const leaderboardBody = document.getElementById("leaderboardBody");
const tableTitle = document.getElementById("tableTitle");
const tableElement = document.querySelector("table");

function renderSpeciesTable(species, rows) {
  tableTitle.textContent = `${species} - Top 12`;
  tableElement.className = "species-table";

  leaderboardHead.innerHTML = `
    <tr>
      <th>Plac.</th>
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
    .map(row => `
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
      <th>Plac.</th>
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

  leaderboardBody.innerHTML = rows.map(row => `
    <tr>
      <td>${row.placering ?? ""}</td>
      <td>${row.namn ?? ""}</td>
      <td>${row.poang ?? 0}</td>
      <td>${row.antal ?? 0}</td>
    </tr>
  `).join("");
}

function renderSelected(value) {
  const rows = leaderboardData[value] || [];

  if (value === "Bäste poängplockare") {
    renderTotalTable(rows);
    return;
  }

  renderSpeciesTable(value, rows);
}

speciesSelect.addEventListener("change", (event) => {
  renderSelected(event.target.value);
});

renderSelected(speciesSelect.value);
