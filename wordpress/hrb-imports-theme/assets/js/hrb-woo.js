(function () {
  const menuToggle = document.querySelector("#menuToggle");
  const desktopNav = document.querySelector(".desktop-nav");

  if (menuToggle && desktopNav) {
    menuToggle.addEventListener("click", function () {
      desktopNav.classList.toggle("is-open");
    });
  }

  document.addEventListener("click", function (event) {
    const scrollButton = event.target.closest("[data-scroll]");
    if (!scrollButton) return;

    const rail = document.querySelector("#" + scrollButton.dataset.scroll);
    if (!rail) return;

    rail.scrollBy({
      left: Number(scrollButton.dataset.direction) * 312,
      behavior: "smooth",
    });
  });

  document.addEventListener("click", function (event) {
    const thumb = event.target.closest("#productThumbs button[data-image]");
    if (!thumb) return;

    const mainImage = document.querySelector("#mainProductImage");
    if (!mainImage) return;

    mainImage.src = thumb.dataset.image;
    document.querySelectorAll("#productThumbs button").forEach(function (button) {
      button.classList.toggle("is-active", button === thumb);
    });
  });
})();
