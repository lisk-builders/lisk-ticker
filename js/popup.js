const {storage} = chrome;

const form = document.querySelector(".js-currencies"),
  feed = document.querySelector(".js-feed"),
  buttons = document.querySelector(".buttons");

const updateLabel = name => (name === "BTC" ? "mBTC" : name);

const renderCurrencies = ({data, select, feed}) => {
  const currencySelected = select || "USD";
  const feedSelected = feed || "lsk";
  buttons.innerHTML = "";
  Object.keys(data).map(currency => {
    const label = document.createElement("label");
    const html = `<input type="radio" name="currency" ${currency ===
      currencySelected &&
      "checked"} value="${currency}"><i class="form-icon"></i>${updateLabel(
      currency
    )}`;
    label.classList.add("form-radio");
    label.classList.add("col-6");
    label.innerHTML = html;
    buttons.appendChild(label);
  });

  document.querySelectorAll(".js-feed option").forEach(option => {
    if (option.value === feed) {
      option.selected = true;
    }
  });
};

feed.addEventListener("change", event => {
  storage.sync.set({feed: event.target.value});
});

form.addEventListener("change", event => {
  storage.sync.set({select: event.target.value});
});

storage.onChanged.addListener(() => {
  storage.sync.get(["data", "select", "feed"], renderCurrencies);
});

storage.sync.get(["data", "select", "feed"], renderCurrencies);
