const currentYear = document.querySelector("#current-year");
const revealTargets = document.querySelectorAll(".hero, .section-grid, .contact-panel");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

revealTargets.forEach((element) => {
  element.classList.add("reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

revealTargets.forEach((element) => {
  observer.observe(element);
});
