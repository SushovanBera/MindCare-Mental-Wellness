/* MindCare demo website interactions */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // Footer year
  $("#currentYear").textContent = new Date().getFullYear();

  // Mobile navigation
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");
  const closeMenu = () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  };
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  $$(".nav-link", navLinks).forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("click", event => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });

  // Active navigation section
  const sections = $$("main section[id]");
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$(".nav-link").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => navObserver.observe(section));

  // Reveal elements on scroll
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(element => revealObserver.observe(element));

  // Appointment modal
  const modal = $("#appointmentModal");
  const appointmentForm = $("#appointmentForm");
  const appointmentDate = $("#appointmentDate");
  const doctorSelect = $("#appointmentDoctor");
  const appointmentFeedback = $("#appointmentFeedback");
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  appointmentDate.min = localToday;
  let previousFocus = null;

  const openModal = (doctor = "") => {
    previousFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    appointmentFeedback.textContent = "";
    appointmentFeedback.classList.remove("error");
    if (doctor) doctorSelect.value = doctor;
    setTimeout(() => $("#appointmentName").focus(), 50);
  };
  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (previousFocus) previousFocus.focus();
  };
  $$("[data-open-appointment]").forEach(button => {
    button.addEventListener("click", () => openModal(button.dataset.doctor || ""));
  });
  $("#closeModal").addEventListener("click", closeModal);
  $$("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  // Simple localStorage helpers. No information is sent to a server.
  const saveRecord = (key, record) => {
    try {
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push(record);
      localStorage.setItem(key, JSON.stringify(existing));
      return true;
    } catch (error) {
      console.warn("Local storage is unavailable:", error);
      return false;
    }
  };

  appointmentForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!appointmentForm.reportValidity()) return;
    const data = new FormData(appointmentForm);
    const record = {
      name: data.get("name").trim(),
      email: data.get("email").trim(),
      phone: data.get("phone").trim(),
      date: data.get("date"),
      service: data.get("service"),
      doctor: data.get("doctor") || "No preference",
      session: data.get("session"),
      createdAt: new Date().toISOString()
    };
    const saved = saveRecord("mindcare_demo_appointments", record);
    appointmentFeedback.classList.remove("error");
    appointmentFeedback.textContent = saved
      ? "Your demo request has been saved in this browser. This is not a confirmed appointment."
      : "Request details could not be saved in this browser. Please try again.";
    if (saved) {
      showToast("Demo appointment request saved");
      appointmentForm.reset();
      appointmentDate.min = localToday;
    }
  });

  // Specialist search
  const doctorSearch = $("#doctorSearch");
  const doctorCards = $$(".doctor-card");
  const emptyDoctors = $("#emptyDoctors");
  doctorSearch.addEventListener("input", () => {
    const term = doctorSearch.value.trim().toLowerCase();
    let visibleCount = 0;
    doctorCards.forEach(card => {
      const searchable = `${card.dataset.name} ${card.dataset.specialty} ${card.innerText}`.toLowerCase();
      const match = searchable.includes(term);
      card.hidden = !match;
      if (match) visibleCount++;
    });
    emptyDoctors.hidden = visibleCount !== 0;
  });

  // Testimonials slider
  const testimonials = [
    { quote: "I finally felt heard. The sessions helped me slow down, understand what I was feeling and take things one day at a time.", name: "Maya", role: "MindCare visitor", initial: "M" },
    { quote: "The calm, welcoming approach made it easier to talk openly. I left each session with something practical to try.", name: "Rahul", role: "MindCare visitor", initial: "R" },
    { quote: "I learned that progress does not have to be perfect. Having a supportive space made a real difference to my routine.", name: "Aisha", role: "MindCare visitor", initial: "A" }
  ];
  let testimonialIndex = 0;
  const renderTestimonial = () => {
    const item = testimonials[testimonialIndex];
    $("#testimonialQuote").textContent = item.quote;
    $("#testimonialName").textContent = item.name;
    $("#testimonialRole").textContent = item.role;
    $("#testimonialAvatar").textContent = item.initial;
  };
  const changeTestimonial = direction => {
    testimonialIndex = (testimonialIndex + direction + testimonials.length) % testimonials.length;
    renderTestimonial();
  };
  $("#prevTestimonial").addEventListener("click", () => changeTestimonial(-1));
  $("#nextTestimonial").addEventListener("click", () => changeTestimonial(1));

  // Contact form validation and local demo submission
  const contactForm = $("#contactForm");
  const contactFeedback = $("#contactFeedback");
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const saved = saveRecord("mindcare_demo_messages", {
      name: data.get("name").trim(),
      email: data.get("email").trim(),
      message: data.get("message").trim(),
      createdAt: new Date().toISOString()
    });
    contactFeedback.classList.toggle("error", !saved);
    contactFeedback.textContent = saved
      ? "Thanks! Your demo message has been saved in this browser only."
      : "Your message could not be saved. Please try again.";
    if (saved) {
      contactForm.reset();
      showToast("Demo message saved");
    }
  });

  // Toast message
  let toastTimer;
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  // Back-to-top button
  const backToTop = $("#backToTop");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Close modal on backdrop and keep focus in the dialog
  modal.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const focusable = $$("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href]", modal)
      .filter(element => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
});
