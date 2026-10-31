const WHATSAPP_NUMBER = "919711853825";

const DESTINATIONS = [
  { name: "U.S.A", tag: "Cities • Landmarks • Adventure", color1: "#1f3c88", color2: "#6a8dff" },
  { name: "Canada", tag: "Nature • Cities • Adventure", color1: "#9e1b1b", color2: "#f26b6b" },
  { name: "Europe", tag: "History • Art • Romance", color1: "#4a1f6d", color2: "#a369d6" },
  { name: "Singapore", tag: "Modern City • Gardens • Culture", color1: "#0d6e5c", color2: "#4fd1b5" },
  { name: "Malaysia", tag: "Cities • Rainforests • Culture", color1: "#174a2e", color2: "#4fbf7a" },
  { name: "Indonesia", tag: "Beaches • Temples • Adventure", color1: "#7a3b12", color2: "#e3a857" },
  { name: "Dubai", tag: "Skyline • Shopping • Desert Safari", color1: "#2d2d2d", color2: "#d4af37" },
  { name: "Thailand", tag: "Beaches • Culture • Food", color1: "#0e7a7a", color2: "#4fd1c5" },
  { name: "Vietnam", tag: "Culture • Landscapes • Food", color1: "#8a1c1c", color2: "#f2c230" },
  { name: "Maldives", tag: "Island • Luxury • Relaxation", color1: "#0a4f8a", color2: "#5fc3e8" },
  { name: "South Africa", tag: "Safari • Coast • Adventure", color1: "#3b5e1f", color2: "#e37a2c" },
];

const DOMESTIC_DESTINATIONS = [
  { name: "Goa", tag: "Beaches • Culture • Fun", color1: "#b3261e", color2: "#f2a900" },
  { name: "Andaman", tag: "Islands • Beaches • Water Sports", color1: "#0a6e8a", color2: "#5fd0d6" },
  { name: "Jammu & Kashmir", tag: "Mountains • Lakes • Valleys", color1: "#1f3c6e", color2: "#8fb8e8" },
  { name: "Uttarakhand Chardham", tag: "Pilgrimage • Himalayas • Peace", color1: "#5a3a1f", color2: "#c99a4f" },
];

function toast(message, isError) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.toggle("error", !!isError);
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2800);
}

/**
 * Optimistic UI: flip the button to its success state immediately,
 * then perform the real (best-effort) action. Roll back only if it fails.
 */
function optimisticSubmit(button, { successText, errorText, action }) {
  const original = button.textContent;
  button.disabled = true;
  button.textContent = successText;
  button.classList.add("is-success");

  let ok = true;
  try {
    ok = action() !== false;
  } catch (e) {
    ok = false;
  }

  if (!ok) {
    button.textContent = errorText;
    button.classList.remove("is-success");
    button.classList.add("is-error");
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove("is-error");
      button.disabled = false;
    }, 2500);
    return;
  }

  toast(successText);
  setTimeout(() => {
    button.textContent = original;
    button.classList.remove("is-success");
    button.disabled = false;
  }, 2200);
}

function openWhatsApp(message) {
  const win = window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
  return !!win; // null/undefined if the popup was blocked -> treated as failure
}

/* nav toggle */
document.getElementById("nav-toggle").addEventListener("click", (e) => {
  const nav = document.getElementById("main-nav");
  const open = nav.classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".main-nav a").forEach((a) =>
  a.addEventListener("click", () => document.getElementById("main-nav").classList.remove("open"))
);

/* enquiry tabs */
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("enquire-type").value = tab.dataset.tab;
  });
});

/* enquiry form -> WhatsApp (optimistic) */
document.getElementById("enquire-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const type = document.getElementById("enquire-type").value;
  const from = document.getElementById("eq-from").value.trim();
  const to = document.getElementById("eq-to").value.trim();
  const date = document.getElementById("eq-date").value;
  const phone = document.getElementById("eq-phone").value.trim();

  const message =
    `New ${type} enquiry from kshitijtourism.com\n` +
    (from ? `From: ${from}\n` : "") +
    `To/Destination: ${to}\n` +
    (date ? `Date: ${date}\n` : "") +
    `Phone: ${phone}`;

  optimisticSubmit(e.target.querySelector(".enquire-submit"), {
    successText: "Sent ✓",
    errorText: "Enable pop-ups & retry",
    action: () => openWhatsApp(message),
  });
});

/* destination cards (rendered here so adding a destination is a one-line data change) */
function renderDestinationGrid(gridId, destinations) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = destinations.map(
    (d) => `
    <div class="dest-card">
      <div class="dest-img" style="background:linear-gradient(135deg, ${d.color1}, ${d.color2})">${d.name}</div>
      <div class="dest-body">
        <h3>${d.name}</h3>
        <p>${d.tag}</p>
        <button class="btn btn-accent dest-enquire" data-dest="${d.name}" type="button">Enquire Now</button>
      </div>
    </div>`
  ).join("");

  grid.querySelectorAll(".dest-enquire").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dest = btn.dataset.dest;
      optimisticSubmit(btn, {
        successText: "Sent ✓",
        errorText: "Enable pop-ups & retry",
        action: () =>
          openWhatsApp(`Hi Kshitij Tourism, I'm interested in a tour package to ${dest}. Please share details.`),
      });
    });
  });
}

renderDestinationGrid("destination-grid", DESTINATIONS);
renderDestinationGrid("domestic-destination-grid", DOMESTIC_DESTINATIONS);

/* newsletter -> saved locally (optimistic) */
document.getElementById("newsletter-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const emailInput = document.getElementById("newsletter-email");
  const email = emailInput.value.trim();

  optimisticSubmit(e.target.querySelector("button"), {
    successText: "Subscribed ✓",
    errorText: "Couldn't save, retry",
    action: () => {
      const list = JSON.parse(localStorage.getItem("kt_subscribers") || "[]");
      if (!list.includes(email)) list.push(email);
      localStorage.setItem("kt_subscribers", JSON.stringify(list));
      emailInput.value = "";
    },
  });
});

/* contact form -> WhatsApp (optimistic) */
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("c-name").value.trim();
  const phone = document.getElementById("c-phone").value.trim();
  const msg = document.getElementById("c-message").value.trim();

  const message = `New contact form message from kshitijtourism.com\nName: ${name}\nPhone: ${phone}\nMessage: ${msg}`;

  optimisticSubmit(e.target.querySelector("button"), {
    successText: "Message Sent ✓",
    errorText: "Enable pop-ups & retry",
    action: () => openWhatsApp(message),
  });
});
