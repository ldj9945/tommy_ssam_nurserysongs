// 유튜브 URL에서 video ID 추출 (watch?v=, youtu.be/, 파라미터 포함 모두 대응)
function getYoutubeId(url) {
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

let activeCategory = "전체";
let searchTerm = "";

// PDF 원본 구성과 동일한 번호(0. 너서리라임 ~ 11. 기본표현)를 붙여서 표기
function categoryLabel(cat) {
  const idx = CATEGORIES.indexOf(cat);
  return idx === -1 ? cat : `${idx}. ${cat}`;
}

function buildTabs() {
  const cats = ["전체", ...CATEGORIES];
  tabsWrap.innerHTML = cats
    .map(
      (c) =>
        `<button class="tab-btn${c === activeCategory ? " active" : ""}" data-cat="${c}">${categoryLabel(c)}</button>`
    )
    .join("");

  tabsWrap.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      buildTabs();
      render();
    });
  });
}

function cardHtml(song) {
  const id = getYoutubeId(song.url);
  const thumb = id
    ? `https://img.youtube.com/vi/${id}/mqdefault.jpg`
    : "";
  return `
    <a class="song-card" href="${song.url}" target="_blank" rel="noopener noreferrer">
      <div class="thumb-wrap">
        ${thumb ? `<img src="${thumb}" alt="${song.title} 썸네일" loading="lazy">` : ""}
        <div class="play-overlay"><span>▶</span></div>
      </div>
      <div class="card-body">
        <span class="card-category">${categoryLabel(song.category)}</span>
        <span class="card-title">${song.title}</span>
        <span class="card-desc">${song.desc}</span>
      </div>
    </a>
  `;
}

function render() {
  const term = searchTerm.trim().toLowerCase();

  const filtered = SONGS.filter((song) => {
    const matchCategory = activeCategory === "전체" || song.category === activeCategory;
    const matchSearch =
      !term ||
      song.title.toLowerCase().includes(term) ||
      song.desc.toLowerCase().includes(term) ||
      song.category.toLowerCase().includes(term);
    return matchCategory && matchSearch;
  });

  resultCount.textContent = `총 ${filtered.length}곡`;

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
