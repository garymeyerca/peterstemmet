import { buildInquiryMailto, getFocusWrapTarget } from "./interaction-logic.js";

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const showreel = document.querySelector("[data-showreel]");
const reelButtons = document.querySelectorAll("[data-video-id]");
const revealItems = document.querySelectorAll(".reveal");
const mobileBreakpoint = 800;
let headerIsScrolled;
let previousMobileState;

const updateHeader = () => {
  const isScrolled = window.scrollY > 16;
  if (isScrolled === headerIsScrolled) return;
  headerIsScrolled = isScrolled;
  header?.classList.toggle("is-scrolled", isScrolled);
};

const setMenuOpen = (isOpen) => {
  if (!menuToggle || !navigation) return;
  const isMobile = window.innerWidth <= mobileBreakpoint;
  const shouldOpen = isMobile && isOpen;
  menuToggle.setAttribute("aria-expanded", String(shouldOpen));
  menuToggle.setAttribute("aria-label", shouldOpen ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("is-open", shouldOpen);
  navigation.toggleAttribute("inert", isMobile && !shouldOpen);
  document.body.classList.toggle("menu-open", shouldOpen);
};

const syncNavigationState = () => {
  const isMobile = window.innerWidth <= mobileBreakpoint;
  if (isMobile === previousMobileState) return;
  previousMobileState = isMobile;
  setMenuOpen(false);
};

menuToggle?.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  setMenuOpen(willOpen);
  if (willOpen) navigation?.querySelector("a")?.focus();
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", syncNavigationState);
document.addEventListener("keydown", (event) => {
  const isMenuOpen = menuToggle?.getAttribute("aria-expanded") === "true";

  if (event.key === "Escape" && isMenuOpen) {
    setMenuOpen(false);
    menuToggle.focus();
  }

  if (event.key === "Tab" && isMenuOpen && menuToggle && navigation) {
    const focusableElements = [menuToggle, ...navigation.querySelectorAll("a")];
    const wrapTarget = getFocusWrapTarget(document.activeElement, focusableElements, event.shiftKey);

    if (wrapTarget) {
      event.preventDefault();
      wrapTarget.focus();
    }
  }
});
updateHeader();
syncNavigationState();

reelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!showreel || button.classList.contains("is-active")) return;

    reelButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    const videoId = button.dataset.videoId;
    showreel.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
    showreel.title = `Peter Stemmet ${button.textContent.trim().toLowerCase()} showreel`;
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const data = new FormData(contactForm);
  const name = data.get("name");
  const email = data.get("email");
  const organisation = data.get("organisation") || "Not provided";
  const service = data.get("service");
  const message = data.get("message");

  if (formNote) {
    formNote.textContent = "Your email app is opening with a ready-to-send message.";
    formNote.classList.add("is-success");
  }

  window.location.href = buildInquiryMailto(contactForm.action, {
    name,
    email,
    organisation,
    service,
    message,
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});
