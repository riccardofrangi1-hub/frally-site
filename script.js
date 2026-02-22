const quotes = [
  '"Il tuo problema non è il tempo. È aprire 17 tab per scegliere una playlist."',
  '"Fai un respiro: la mail può aspettare almeno 4 minuti."',
  '"La perfezione è solo procrastinazione con un buon marketing."',
  '"Hai già superato il 100% dei lunedì della tua vita."',
];

const quoteEl = document.getElementById("quote");
const quoteBtn = document.getElementById("newQuote");
const panicBtn = document.getElementById("panicBtn");

quoteBtn?.addEventListener("click", () => {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quoteEl.textContent = random;
});

panicBtn?.addEventListener("click", () => {
  alert("Mini-crisi ricevuta. Protocollo: 1) acqua 2) respiro 3) meme di un gatto.");
});
