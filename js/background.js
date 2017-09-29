const red = "#e85600";
const green = "#32b643";
const blue = "#5764c6";
const API = 'https://explorer.lisk.io/api';
const MINUTE = 60000;
let timer;

const { browserAction: badge, storage } = chrome;

const prepareValue = value => {
  let v = parseFloat(value);
  if (v >= 100) {
    v = v.toFixed(0);
  } else if (v >= 10){
    v = v.toFixed(1);
  } else {
    v = v.toFixed(2);
  }
  return v.toString();
}

const getColor = (oldV, newV) =>
  newV > oldV ?
    green :
    newV === oldV ?
      blue :
      red;

const updateData = value => storage.sync.set({data: value.tickers.LSK});

const receiveData = ({oldValue, newValue}) => {
  storage.sync.get(['select'], ({select}) => {
    let selected = (select && !!newValue[select]) ? select : 'USD';
    if (!oldValue) {
      updateTicker(newValue, newValue, selected);
    } else {
      updateTicker(newValue, oldValue, selected);
    }
  })
}

const receiveSelect = selected => {
  storage.sync.get(['data'], ({data}) => {
    updateTicker(data, data, selected)
  });
}

storage.onChanged.addListener(({data, select}) => {
  if (data) {
    return receiveData(data);
  }
  if (select) {
    return receiveSelect(select.newValue)
  }
});

const updateTicker = (newData, oldData, selected) => {
  let originalValue;
  let preparedValue;
  if (selected === 'BTC') {
    originalValue = (newData[selected] * 1000).toFixed(6).toString();
    preparedValue = prepareValue(newData[selected] * 1000);
  } else {
    originalValue = newData[selected].toFixed(6).toString();
    preparedValue = prepareValue(newData[selected]);
  }
  badge.setBadgeText({text: preparedValue});
  badge.setTitle({title: originalValue })
  badge.setBadgeBackgroundColor({ color: getColor(oldData[selected], newData[selected])});
}

const getData = () =>
  fetch(`${API}/getPriceTicker`)
    .then(res => res.status === 200 && res.json())
    .then(updateData);

const loop = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    getData();
    loop();
  }, MINUTE);
};

getData();
loop();
