const cases = [
    {
        jaksa: "Charlie Immanuel Manasye Simamora, S.H.",
        tersangka: "Mardianto Bin Johan Alias Anto",
        tindakPidana: "Persetubuhan Terhadap Anak",
        pasalSangkaan: "Pasal 81 Ayat 1 Jo Pasal 76D UU No. 17 Tahun 2016",
        batasPelimpahan: "06-06-2025",
        berakhirPenahanan: "17-06-2025",
        statusPerpanjangan: "Belum Diperpanjang"
    },
    {
        jaksa: "Charlie Immanuel Manasye Simamora, S.H.",
        tersangka: "Nabil Bin Nahar Ali",
        tindakPidana: "Persetubuhan Terhadap Anak",
        pasalSangkaan: "Pasal 81 Ayat 1 Jo Pasal 76D UU No. 17 Tahun 2016",
        batasPelimpahan: "26-05-2025",
        berakhirPenahanan: "04-06-2025",
        statusPerpanjangan: "Perpanjangan Pertama"
    },
    {
        jaksa: "Charlie Immanuel Manasye Simamora, S.H.",
        tersangka: "Zaidatul Fauzi",
        tindakPidana: "Kecelakaan Lalu Lintas",
        pasalSangkaan: "Pasal 310 Ayat 1 dan Pasal 311 Ayat 2 UU RI No. 22 Tahun 2009",
        batasPelimpahan: "Tidak ditahan",
        berakhirPenahanan: "Tidak ditahan",
        statusPerpanjangan: "-"
    },
    {
        jaksa: "Charlie Immanuel Manasye Simamora, S.H.",
        tersangka: "Nadir Bin Kunje",
        tindakPidana: "Narkotika",
        pasalSangkaan: "Pasal 114 Ayat (1) atau Pasal 112 Ayat (1) Undang-undang RI Nomor 35 Tahun 2009",
        batasPelimpahan: "19-05-2025",
        berakhirPenahanan: "28-05-2025",
        statusPerpanjangan: "Belum Diperpanjang"
    },
    {
        jaksa: "Charlie Immanuel Manasye Simamora, S.H.",
        tersangka: "Monika Binti Ulhan",
        tindakPidana: "Narkotika",
        pasalSangkaan: "Pasal 114 ayat (1) dan atau pasal 112 ayat (1) Undang-undang Nomor 35 Tahun 2009",
        batasPelimpahan: "23-05-2025",
        berakhirPenahanan: "02-06-2025",
        statusPerpanjangan: "Belum Diperpanjang"
    },
    {
        jaksa: "Rombelayuk Massudi, S.H.",
        tersangka: "Roni Bin Hasim",
        tindakPidana: "Narkotika",
        pasalSangkaan: "Pasal 114 ayat (1) dan atau pasal 112 ayat (1) Undang-undang Nomor 35 Tahun 2009",
        batasPelimpahan: "23-05-2025",
        berakhirPenahanan: "02-06-2025",
        statusPerpanjangan: "Belum Diperpanjang"
    },
];

function parseDateDMY(dateString) {
    const parts = dateString.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

const tableBody = document.querySelector("#caseTable tbody");
const filterInput = document.getElementById("filterJaksa");

function populateTable(data) {
    tableBody.innerHTML = "";
    data.forEach(item => {
        const row = document.createElement("tr");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const batasDate = parseDateDMY(item.batasPelimpahan);
        batasDate.setHours(0, 0, 0, 0);
        const diffTime = batasDate - today;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) diffDays = 0;
        const alertIcon = diffDays <= 3 && diffDays > 0 ? " ⚠️" : "";
        row.innerHTML = `
            <td>${item.jaksa}</td>
            <td>${item.tersangka}</td>
            <td>${item.tindakPidana}</td>
            <td>${item.pasalSangkaan}</td>
            <td>${item.batasPelimpahan}</td>
            <td>${diffDays} hari${alertIcon}</td>
            <td>${item.berakhirPenahanan}</td>
            <td>${item.statusPerpanjangan}</td>
        `;
        tableBody.appendChild(row);
    });
}

let filteredCases = [...cases];

filterInput.removeEventListener("input", filterInput._listener);

filterInput._listener = () => {
    const filterValue = filterInput.value.toLowerCase();
    filteredCases = cases.filter(c =>
        c.jaksa.toLowerCase().includes(filterValue) ||
        c.tersangka.toLowerCase().includes(filterValue) ||
        c.tindakPidana.toLowerCase().includes(filterValue)
    );
    filteredCases = sortByBatasPelimpahan(filteredCases);
    renderResponsive(filteredCases);
};

filterInput.addEventListener("input", filterInput._listener);

// Enhanced sort function to handle non-date values like "Tidak ditahan"
function sortByBatasPelimpahan(data) {
    return data.slice().sort((a, b) => {
        const dateA = a.batasPelimpahan.toLowerCase() === "tidak ditahan" ? null : parseDateDMY(a.batasPelimpahan);
        const dateB = b.batasPelimpahan.toLowerCase() === "tidak ditahan" ? null : parseDateDMY(b.batasPelimpahan);
        if (dateA === null && dateB === null) return 0;
        if (dateA === null) return 1;
        if (dateB === null) return -1;
        return dateA - dateB;
    });
}

filterInput.addEventListener("input", () => {
    const filterValue = filterInput.value.toLowerCase();
    const filteredCases = cases.filter(c =>
        c.jaksa.toLowerCase().includes(filterValue) ||
        c.tersangka.toLowerCase().includes(filterValue) ||
        c.tindakPidana.toLowerCase().includes(filterValue)
    );
    const sortedFilteredCases = sortByBatasPelimpahan(filteredCases);
    populateTable(sortedFilteredCases);
});

// Card container
const cardContainer = document.getElementById("cardContainer");

// Function to create card HTML for an item
function createCard(item, diffDays, alertIcon) {
    return `
    <div class="case-card">
        <h3>${item.jaksa}</h3>
        <p><strong>Berkas Perkara:</strong> ${item.tersangka}</p>
        <p><strong>Tindak Pidana:</strong> ${item.tindakPidana}</p>
        <p><strong>Pasal Sangkaan:</strong> ${item.pasalSangkaan}</p>
        <p><strong>Batas Waktu Pelimpahan:</strong> ${item.batasPelimpahan}</p>
        <p><strong>Countdown:</strong> ${diffDays} hari${alertIcon}</p>
        <p><strong>Berakhirnya Penahanan:</strong> ${item.berakhirPenahanan}</p>
        <p><strong>Status Perpanjangan Penahanan:</strong> ${item.statusPerpanjangan}</p>
    </div>
    `;
}

// Function to populate cards
function populateCards(data) {
    cardContainer.innerHTML = "";
    data.forEach(item => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const batasDate = parseDateDMY(item.batasPelimpahan);
        batasDate.setHours(0, 0, 0, 0);
        const diffTime = batasDate - today;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) diffDays = 0;
        const alertIcon = diffDays <= 3 && diffDays > 0 ? " ⚠️" : "";
        cardContainer.innerHTML += createCard(item, diffDays, alertIcon);
    });
}

// Function to check screen width and render accordingly
function renderResponsive(data) {
    if (window.innerWidth <= 768) {
        // Show cards, hide table
        cardContainer.style.display = "block";
        caseTable.style.display = "none";
        populateCards(data);
    } else {
        // Show table, hide cards
        cardContainer.style.display = "none";
        caseTable.style.display = "table";
        populateTable(data);
    }
}

// Initial render
window.sortedCases = sortByBatasPelimpahan(cases);
renderResponsive(window.sortedCases);

// Re-render on window resize
window.addEventListener("resize", () => {
    renderResponsive(window.sortedCases);
});

// Scroll animation on table
let scrollTimeout;

const menuToggle = document.querySelector(".menu-toggle");
const navContainer = document.querySelector(".nav-container");

menuToggle.addEventListener("click", () => {
    navContainer.classList.toggle("open");
});

// Function to add a new case, sort, and re-render
function addCase(newCase) {
    cases.push(newCase);
    const sortedCases = sortByBatasPelimpahan(cases);
    // Update global cases array with sorted array
    cases.length = 0;
    cases.push(...sortedCases);
    // Update global sortedCases variable
    window.sortedCases = sortedCases;
    renderResponsive(sortedCases);
}

// Update filter input event listener to use updated global cases array
filterInput.removeEventListener("input", filterInput._listener);


filterInput._listener = () => {
    const filterValue = filterInput.value.toLowerCase();
    const filteredCases = cases.filter(c =>
        c.jaksa.toLowerCase().includes(filterValue) ||
        c.tersangka.toLowerCase().includes(filterValue) ||
        c.tindakPidana.toLowerCase().includes(filterValue)
    );
    const sortedFilteredCases = sortByBatasPelimpahan(filteredCases);
    if (window.innerWidth <= 768) {
        populateCards(sortedFilteredCases);
    } else {
        populateTable(sortedFilteredCases);
    }
};

filterInput.addEventListener("input", filterInput._listener);

window.addEventListener("scroll", () => {
    if (!caseTable.classList.contains("table-scroll-animate")) {
        caseTable.classList.add("table-scroll-animate");
    }
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        caseTable.classList.remove("table-scroll-animate");
    }, 300);
});

// Active/inactive row animation
tableBody.addEventListener("mouseover", (event) => {
    if (event.target.tagName === "TD") {
        const row = event.target.parentElement;
        row.classList.add("active");
        // Set other rows inactive
        Array.from(tableBody.rows).forEach(r => {
            if (r !== row) {
                r.classList.add("inactive");
            }
        });
    }
});

tableBody.addEventListener("mouseout", (event) => {
    if (event.target.tagName === "TD") {
        const row = event.target.parentElement;
        row.classList.remove("active");
        // Remove inactive from all rows
        Array.from(tableBody.rows).forEach(r => {
            r.classList.remove("inactive");
        });
    }
});
