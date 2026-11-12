// Wspólne ustawienia stron uczniów i panelu (generowane przez budowa/buduj.py).
window.SKRYPT = "https://script.google.com/macros/s/AKfycbwpTbiG3eMLwRjo6zdDP22NU0_N6HysdwufsA0akL4u8nLICo1thSybv5Q0gwtoVTBK/exec";
(function(){
  "use strict";
  var s = document.currentScript;
  window.TEST_ID = (s && s.dataset.test) || "";
  if (!window.TEST_ID) return; // panel i strona główna

  // ---------- podgląd nauczyciela (?podglad=1): nic nie jest wysyłane ani zapisywane na stałe ----------
  if (/[?&]podglad=1/.test(location.search)){
    var K = "spr-" + window.TEST_ID + "-v1", P = "podglad-" + K;
    var get = Storage.prototype.getItem, set = Storage.prototype.setItem, del = Storage.prototype.removeItem;
    // zapis odpowiedzi trafia do pamięci tej karty (sessionStorage), a nie do zapisu ucznia
    Storage.prototype.getItem = function(k){ return this === localStorage && k === K ? get.call(sessionStorage, P) : get.call(this, k); };
    Storage.prototype.setItem = function(k, v){ return this === localStorage && k === K ? set.call(sessionStorage, P, v) : set.call(this, k, v); };
    Storage.prototype.removeItem = function(k){ return this === localStorage && k === K ? del.call(sessionStorage, P) : del.call(this, k); };
    var f0 = window.fetch;
    window.fetch = function(u, o){
      if (String(u).indexOf(window.SKRYPT) === 0 && window.SKRYPT){
        var post = o && o.method === "POST";
        return Promise.resolve({json: function(){ return Promise.resolve(post ? {ok:false, blad:"podglad"} : {ok:true, otwarte:true}); }});
      }
      return f0.apply(this, arguments);
    };
    window.klioBlad = function(){};
    var pokazPodglad = function(){
      var d = document.createElement("div");
      d.style.cssText = "position:relative;z-index:60;padding:8px 12px;background:#23407a;color:#fff;" +
        "font:14px/1.4 system-ui,'Segoe UI',Arial,sans-serif;text-align:center";
      d.innerHTML = "<b>PODGLĄD NAUCZYCIELA</b> – odpowiedzi nie są wysyłane, a wyjścia ze strony nie są nigdzie zapisywane. " +
        "<button type='button' style='margin-left:8px;padding:3px 10px;border-radius:6px;border:1px solid #fff;background:transparent;color:#fff;cursor:pointer'>Zacznij od nowa</button>";
      d.querySelector("button").onclick = function(){ del.call(sessionStorage, P); location.reload(); };
      document.body.insertBefore(d, document.body.firstChild);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", pokazPodglad); else pokazPodglad();
    return;
  }

  // Pasek „przyjmowanie odpowiedzi zamknięte” – nauczyciel otwiera je w panelu.
  var pasek, licznik;
  function pokaz(){
    if (!pasek){
      pasek = document.createElement("div");
      pasek.setAttribute("role", "status");
      pasek.style.cssText = "position:fixed;left:50%;bottom:86px;transform:translateX(-50%);z-index:40;width:min(94vw,560px);" +
        "padding:10px 14px;border-radius:8px;background:#5a1414;color:#fff;font:15px/1.4 system-ui,'Segoe UI',Arial,sans-serif;" +
        "box-shadow:0 8px 24px rgba(0,0,0,.45);text-align:center";
      pasek.innerHTML = "<b>Przyjmowanie odpowiedzi jest zamknięte.</b> Możesz pisać – odpowiedzi zapisują się w telefonie – " +
        "ale wyślesz je dopiero, gdy nauczyciel otworzy przyjmowanie.";
      document.body.appendChild(pasek);
    }
    pasek.hidden = false;
    clearTimeout(licznik); licznik = setTimeout(sprawdz, 20000);
  }
  function ukryj(){
    if (pasek && !pasek.hidden){
      pasek.hidden = true;
      var t = document.createElement("div");
      t.style.cssText = pasek.style.cssText.replace("#5a1414", "#1f5a2e");
      t.textContent = "Przyjmowanie odpowiedzi jest otwarte. Jeśli praca nie została wysłana, kliknij „Wyślij ponownie”.";
      document.body.appendChild(t); setTimeout(function(){ t.remove(); }, 7000);
    }
  }
  function sprawdz(){
    if (!window.SKRYPT) return;
    fetch(window.SKRYPT + "?akcja=status&test=" + encodeURIComponent(window.TEST_ID))
      .then(function(r){ return r.json(); })
      .then(function(j){ if (j.ok && j.otwarte === false) pokaz(); else ukryj(); })
      .catch(function(){});
  }
  window.klioBlad = function(blad){ if (blad === "zamkniete") pokaz(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sprawdz); else sprawdz();
})();
