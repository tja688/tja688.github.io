export function Footer() {
  return (
    <footer className="site-footer wrap">
      <div>
        <p className="eyebrow">THANKS FOR PLAYING</p>
        <h2>下个小世界，再见。</h2>
        <p>这里会继续放一些新游戏，和不太成熟的新点子。</p>
      </div>
      <div className="footer-links">
        <a
          href="https://tja688.itch.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          itch.io <span aria-hidden="true">↗</span>
        </a>
        <a
          href="https://github.com/tja688"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <a href="#">
          回到起点 <span aria-hidden="true">↑</span>
        </a>
      </div>
      <div className="footer-bottom">
        <span>小游档案 / INDEPENDENT GAMES</span>
        <span>
          MADE WITH CURIOSITY <span aria-hidden="true">✦</span>
        </span>
      </div>
    </footer>
  );
}
