// 유튜브 URL에서 video ID 추출 (watch?v=, youtu.be/, 파라미터 포함 모두 대응)
function getYoutubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&?/]+)/,
    /(?:youtu\.be\/)([^&?/]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

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

function cardHtml(book) {
  const id = getYoutubeId(book.url);
  const thumb = id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "";
  const koLink = book.koUrl
    ? `<a class="ko-link" href="${book.koUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">한국어 리드얼라우드 보기</a>`
    : "";

  if (!book.url) {
    return `
      <div class="song-card no-link">
        <div class="thumb-wrap no-thumb">
          <span class="no-thumb-label">영상 준비중</span>
        </div>
        <div class="card-body">
          <span class="card-category">${book.author}</span>
          <span class="card-title">${book.title}</span>
          <span class="card-desc">${book.desc}</span>
        </div>
      </div>
    `;
  }

  return `
    <a class="song-card" href="${book.url}" target="_blank" rel="noopener noreferrer">
      <div class="thumb-wrap">
        ${thumb ? `<img src="${thumb}" alt="${book.title} 썸네일" loading="lazy">` : ""}
        <div class="play-overlay"><span>▶</span></div>
      </div>
      <div class="card-body">
        <span class="card-category">${book.author}</span>
        <span class="card-title">${book.title}</span>
        <span class="card-desc">${book.desc}</span>
        ${koLink}
      </div>
    </a>
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
