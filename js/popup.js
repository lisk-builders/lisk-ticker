const { storage } = chrome;

const form = document.querySelector('.form-group');

const updateLabel = name => name === 'BTC' ? 'mBTC' : name;

const renderCurrencies = ({data, select}) => {
  const selected = select || 'USD';
  Object.keys(data).map(currency => {
    const label = document.createElement('label');
    const html = `<input type="radio" name="currency" ${currency === selected && 'checked'} value="${currency}"><i class="form-icon"></i>${updateLabel(currency)}`;
    label.classList.add('form-radio');
    label.classList.add('col-6');
    label.innerHTML = html;
    form.appendChild(label)
  });
};

form.addEventListener('change', (event) => {
  storage.sync.set({select: event.target.value });
});



storage.sync.get(['data', 'select'], renderCurrencies);
