export function SiteNav() {
  return (
    <header className="site-header">
      <div className="wrap nav-inner">
        <a href="#" className="brand" aria-label="小游档案首页">
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="currentColor"
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <path d="M4 3h16v2h2v14h-2v2H4v-2H2V5h2zm2 4v10h12V7zm2 2h2v2h2v2h-2v2H8v-2H6v-2h2zm7 2h2v2h-2z" />
          </svg>
          <span>
            小游档案<small>SMALL GAME ARCHIVE</small>
          </span>
        </a>
        <nav aria-label="主导航">
          <a href="#selected">精选作品</a>
          <a href="#games">
            全部游戏{" "}
            <span className="nav-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </nav>
        <span className="nav-stamp">
          <span className="signal" /> PRESS START
        </span>
      </div>
    </header>
  );
}
