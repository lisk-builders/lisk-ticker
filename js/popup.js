const {storage} = chrome;

const form = document.querySelector(".js-currencies"),
  feed = document.querySelector(".js-feed"),
  wallet = document.querySelector('.js-wallet'),
  buttons = document.querySelector(".buttons");

const updateLabel = name => (name === "BTC" ? "mBTC" : name);

const renderWallet = (wallet, balance) => {
  document.querySelector(".js-wallet").value = wallet || "";
  if(balance) {
    document.querySelector('.js-balance').style.display = "block";
    document.querySelector('.js-balance h4').innerText = Number(Number(balance)/100000000).toFixed(3);
  }
};

const renderCurrencies = (data, select, feed) => {
  const currencySelected = select || "USD";
  const feedSelected = feed || "lsk";
  buttons.innerHTML = "";
  data &&  Object.keys(data).map(currency => {
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

wallet.addEventListener("keyup", event => {
  storage.sync.set({wallet: event.target.value});
});

const fetchAndTriggerUIUpdate = () => {
  storage.sync.get(["data", "select", "feed", "wallet", "balance"], ({data, select, feed, wallet, balance}) => {
    renderCurrencies(data, select, feed);
    renderWallet(wallet, balance);
  });
};

storage.onChanged.addListener(() => {
  fetchAndTriggerUIUpdate();
});

fetchAndTriggerUIUpdate();
