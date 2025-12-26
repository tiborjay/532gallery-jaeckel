const input = document.getElementById("search");

if (input) {
  input.addEventListener("input", () => {
    const term = input.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      card.classList.toggle("hidden", term.length && !text.includes(term));
    });
  });
}
