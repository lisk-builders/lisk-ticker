const {storage} = chrome;

const currencyMap = {
  "GBP": "£",
  "USD": "$",
  "EUR": "€",
  "RUB": "₽",
  "BTC": "Ƀ"
};

const form = document.querySelector(".js-currencies"),
  feed = document.querySelector(".js-feed"),
  wallet = document.querySelector('.js-wallet'),
  buttons = document.querySelector(".buttons");

const updateLabel = name => (name === "BTC" ? "mBTC" : name);

const renderWallet = (wallet, balance, data, select, errors) => {
  const safeSelect = select || "USD";
  document.querySelector(".js-wallet input").value = wallet || "";
  if(balance) {
    // Remove any errors now we have a balance
    const errorSpan = document.querySelector('.js-wallet span');
    errorSpan.innerText = "";
    errorSpan.style.display = "none";

    let currencyDecimalPoints = 2;
    if(select === "BTC") {
      currencyDecimalPoints = 8;
    }

    const numFormat = (num, format) => new Intl.NumberFormat( navigator.language, { maximumFractionDigits: format }, ).format(num);

    const calculatedBalance = Number(Number(balance)/100000000),
          calculatedCurrencyBalance = numFormat(calculatedBalance * Number(data[safeSelect]), currencyDecimalPoints);
    document.querySelector('.js-balance').style.display = "block";
    document.querySelector('.js-balance h4').innerText = `${calculatedBalance.toFixed(3)} LSK`;
    document.querySelector('.js-balance p').innerText = `${currencyMap[safeSelect]}${calculatedCurrencyBalance}`;
  }
  if(errors) {
    if(errors.hasOwnProperty("wallet")) {
      const errorSpan = document.querySelector('.js-wallet span');
      errorSpan.innerText = errors.wallet;
      errorSpan.style.display = "block";
    }
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
  storage.sync.get(["data", "select", "feed", "wallet", "balance", "errors"], ({data, select, feed, wallet, balance, errors}) => {
    renderCurrencies(data, select, feed);
    renderWallet(wallet, balance, data, select, errors);
  });
};

storage.onChanged.addListener(() => {
  fetchAndTriggerUIUpdate();
});

fetchAndTriggerUIUpdate();
