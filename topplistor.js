const leaderboardData = {
  "Björkna": [
    { placering: 1, namn: "Mattias", vikt: "1450 g", datum: "10/04", poang: 102 },
    { placering: 2, namn: "Anders Wimmerstedt", vikt: "1380 g", datum: "2026-04-09", poang: 96 },
    { placering: 3, namn: "Johan", vikt: "1320 g", datum: "2026-04-08", poang: 91 }
  ],
  "Brax": [
    { placering: 1, namn: "Mattias", vikt: "3820 g", datum: "2026-04-05", poang: 114 },
    { placering: 2, namn: "Peter", vikt: "3610 g", datum: "2026-04-03", poang: 108 }
  ],
  "Id": [
    { placering: 1, namn: "Andreas", vikt: "2750 g", datum: "2026-04-04", poang: 98 }
  ],
  "Mört": [
    { placering: 1, namn: "Johan", vikt: "920 g", datum: "2026-04-01", poang: 85 }
  ],
  "Ruda": [],
  "Sarv": [],
  "Sutare": [],
  "Vimma": []
};

const speciesSelect = document.getElementById("speciesSelect");
const leaderboardBody = document.getElementById("leaderboardBody");
const tableTitle = document.getElementById("tableTitle");

function renderSpecies(species) {
  const rows = leaderboardData[species] || [];
  tableTitle.textContent = `${species} - Top 12`;

  if (rows.length === 0) {
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
        <td>${row.placering}</td>
        <td>${row.namn}</td>
        <td>${row.vikt}</td>
        <td>${row.datum}</td>
        <td>${row.poang}</td>
      </tr>
    `)
    .join("");
}

speciesSelect.addEventListener("change", (event) => {
  renderSpecies(event.target.value);
});

renderSpecies(speciesSelect.value);
