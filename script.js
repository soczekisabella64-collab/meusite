/* =========================================================
   LINKS DE CHECKOUT — troque apenas os valores abaixo
   COMPLETO = Plano Completo R$24,00 (botão do card)
   SIMPLES  = Plano Simples R$14,00 (botão "continuar" do modal)
   UPGRADE  = Plano Completo Promocional R$19,90 (botão do modal)
   ========================================================= */
var CHECKOUT = {
  SIMPLES:  "CHECKOUT_SIMPLES",
  COMPLETO: "CHECKOUT_COMPLETO",
  UPGRADE:  "CHECKOUT_UPGRADE"
};

(function () {
  "use strict";

  // Repassa UTMs e parâmetros da página para o checkout (rastreamento de anúncios)
  function withParams(url) {
    var qs = window.location.search.replace(/^\?/, "");
    if (!qs) return url;
    return url + (url.indexOf("?") === -1 ? "?" : "&") + qs;
  }
  function isLink(url) { return /^https?:\/\//i.test(url); }

  var toast = document.getElementById("toast"), toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 3500);
  }

  // Links de checkout
  var buttons = document.querySelectorAll("[data-checkout]");
  for (var i = 0; i < buttons.length; i++) {
    var key = buttons[i].getAttribute("data-checkout");
    var url = CHECKOUT[key] || "";
    if (isLink(url)) buttons[i].href = withParams(url);
  }

  // Modal de upgrade
  var modal = document.getElementById("upsell");
  var box = modal.querySelector(".modal-box");
  var lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("lock");
    box.focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("lock");
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("click", function (ev) {
    var el = ev.target.closest ? ev.target.closest("[data-upsell], [data-close], [data-checkout]") : null;
    if (!el) return;

    if (el.hasAttribute("data-upsell")) {      // botão do Plano Simples abre o modal
      ev.preventDefault();
      openModal();
      return;
    }
    if (el.hasAttribute("data-close")) {       // fechar modal
      ev.preventDefault();
      closeModal();
      return;
    }
    if (el.hasAttribute("data-checkout") && !isLink(CHECKOUT[el.getAttribute("data-checkout")] || "")) {
      ev.preventDefault();                     // link ainda não configurado
      showToast("Link de checkout ainda não configurado (" + el.getAttribute("data-checkout") + "). Edite o script.js.");
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (!modal.hidden && (ev.key === "Escape" || ev.key === "Esc")) closeModal();
  });
})();
