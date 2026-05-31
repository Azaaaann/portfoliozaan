const selectedPlan = document.querySelector("#selected-plan");
const selectedPrice = document.querySelector("#selected-price");
const paymentForm = document.querySelector("#payment-form");
const payUpiButton = document.querySelector("#pay-upi");
const paymentDone = document.querySelector("#payment-done");
const whatsappConfirm = document.querySelector("#whatsapp-confirm");
const params = new URLSearchParams(window.location.search);
const plan = params.get("plan") || "Starter Plan";
const price = params.get("price") || "Rs. 99";
const upiId = "azaann@fam";
const payeeName = "Azaan";
const whatsappNumber = "919235233086";

const getAmount = (priceText) => {
  const amount = priceText.replace(/\D/g, "");
  return amount || "99";
};

const getFormDetails = () => {
  const formData = new FormData(paymentForm);

  return {
    name: String(formData.get("client-name") || "").trim(),
    email: String(formData.get("client-email") || "").trim(),
    link: String(formData.get("project-link") || "").trim(),
    brief: String(formData.get("project-brief") || "").trim(),
  };
};

const buildUpiUrl = () => {
  const amount = getAmount(price);
  const upiParams = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: amount,
    cu: "INR",
    tn: `${plan} thumbnail order`,
  });

  return `upi://pay?${upiParams.toString()}`;
};

const buildWhatsappUrl = () => {
  const details = getFormDetails();
  const message = [
    "Hi Azaan, I have completed my payment.",
    "",
    `Plan: ${plan}`,
    `Price: ${price}`,
    `UPI ID paid to: ${upiId}`,
    "",
    `Name: ${details.name || "Not provided"}`,
    `Email: ${details.email || "Not provided"}`,
    `Project link: ${details.link || "Not provided"}`,
    "",
    "Project brief:",
    details.brief || "Not provided",
    "",
    "I will attach/send the payment screenshot here.",
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

selectedPlan.textContent = plan;
selectedPrice.textContent = price;
payUpiButton.setAttribute("href", buildUpiUrl());

const savedTheme = localStorage.getItem("denzi-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
document.body.dataset.theme = savedTheme || preferredTheme;

const step1 = document.querySelector("#step-1-indicator");
const step2 = document.querySelector("#step-2-indicator");
const step3 = document.querySelector("#step-3-indicator");

whatsappConfirm?.addEventListener("click", () => {
  // Mark Step 3 as completed when clicking WhatsApp continue
  step3?.classList.add("completed");
  step3?.classList.remove("active");
  window.open(buildWhatsappUrl(), "_blank", "noopener,noreferrer");
});

paymentForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  
  // Mark step 1 completed, make step 2 active
  step1?.classList.add("completed");
  step1?.classList.remove("active");
  step2?.classList.add("active");
  
  // Enable next step paid button
  if (paymentDone) {
    paymentDone.removeAttribute("disabled");
  }
  
  // Flash Save success message inside button temporarily
  const submitBtn = paymentForm.querySelector("button[type='submit']");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Details Saved ✓";
  submitBtn.style.background = "#25d366";
  submitBtn.style.boxShadow = "0 8px 24px rgba(37, 211, 102, 0.25)";
  
  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.style.background = "";
    submitBtn.style.boxShadow = "";
  }, 2000);
  
  payUpiButton.focus();
});

paymentDone?.addEventListener("click", () => {
  whatsappConfirm.classList.remove("is-hidden");
  paymentDone.textContent = "Payment marked as done";
  paymentDone.setAttribute("disabled", "true");
  
  // Mark step 2 completed, make step 3 active
  step2?.classList.add("completed");
  step2?.classList.remove("active");
  step3?.classList.add("active");
  
  whatsappConfirm.focus();
});
