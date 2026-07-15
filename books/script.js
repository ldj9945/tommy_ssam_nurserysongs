const grid = document.getElementById("song-grid");
const emptyState = document.getElementById("empty-state");
const resultCount = document.getElementById("result-count");
const searchInput = document.getElementById("search-input");
const tabsWrap = document.getElementById("category-tabs");

const AVAILABILITY_FILTERS = ["전체", "영상 있음", "영상 준비중"];
let activeFilter = "전체";
let searchTerm = "";

function buildTabs() {
  tabsWrap.innerHTML = AVAILABILITY_FILTERS.map(
    (f) => `<button class="tab-btn${f === activeFilter ? " active" : ""}" data-filter="${f}">${f}</button>`
  ).join("");

  tabsWrap.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      buildTabs();
      render();
    });
  });
}

function readRowHtml(url, label, title) {
  if (!url) {
    return `
      <div class="read-row disabled">
        <span class="read-row-icon">📖</span>
        <span class="read-row-text">
          <span class="read-row-label">${label}</span>
          <span class="read-row-title">영상 준비중</span>
        </span>
      </div>
    `;
  }
  return `
    <a class="read-row" href="${url}" target="_blank" rel="noopener noreferrer">
      <span class="read-row-icon">📖</span>
      <span class="read-row-text">
        <span class="read-row-label">${label}</span>
        <span class="read-row-title">${title}</span>
      </span>
      <span class="read-row-chevron">›</span>
    </a>
  `;
}

function cardHtml(book) {
  const cover = book.cover
    ? `<img src="${book.cover}" alt="${book.title} 표지" loading="lazy">`
    : `<span class="book-cover-fallback">📕</span>`;

  const koRow = book.koUrl ? readRowHtml(book.koUrl, "READ ALOUD (한국어)", book.title) : "";

  return `
    <div class="book-card">
      <div class="book-cover-wrap">${cover}</div>
      <div class="book-info">
        <span class="book-title">${book.title}</span>
        <span class="book-author">${book.author}</span>
        <span class="book-desc">${book.desc}</span>
      </div>
      ${readRowHtml(book.url, "READ ALOUD", book.title)}
      ${koRow}
    </div>
  `;
}

function render() {
  const term = searchTerm.trim().toLowerCase();

  const filtered = BOOKS.filter((book) => {
    const matchFilter =
      activeFilter === "전체" ||
      (activeFilter === "영상 있음" && !!book.url) ||
      (activeFilter === "영상 준비중" && !book.url);
    const matchSearch =
      !term ||
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.desc.toLowerCase().includes(term);
    return matchFilter && matchSearch;
  });

  resultCount.textContent = `총 ${filtered.length}권`;

  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    grid.innerHTML = filtered.map(cardHtml).join("");
  }
}

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value;
  render();
});

buildTabs();
render();
