// Replace 'YOUR_API_KEY' with your actual API key
const apiKey = '8c863104fc53446aa859a1b06dccf539';
const baseCurrency = 'USD';
const targetCurrencies = ['EUR', 'PLN'];

const apiUrl = `https://open.er-api.com/v6/latest/${baseCurrency}?apikey=${apiKey}`;

async function getExchangeRates() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            const rates = data.rates;
            return rates;
        } else {
            console.error(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function updateCurrencies(amount, baseCurrency) {
    const ratesPromise = getExchangeRates();
    const usdInput = document.getElementById('usd');
    const eurInput = document.getElementById('eur');
    const plnInput = document.getElementById('pln');

    ratesPromise.then(rates => {
        const usdRate = rates['USD'];
        const eurRate = rates['EUR'];
        const plnRate = rates['PLN'];

        let usdValue, eurValue, plnValue;

        switch (baseCurrency) {
            case 'USD':
                usdValue = amount;
                eurValue = amount * (eurRate / usdRate);
                plnValue = amount * (plnRate / usdRate);
                break;
            case 'EUR':
                usdValue = amount * (usdRate / eurRate);
                eurValue = amount;
                plnValue = amount * (plnRate / eurRate);
                break;
            case 'PLN':
                usdValue = amount * (usdRate / plnRate);
                eurValue = amount * (eurRate / plnRate);
                plnValue = amount;
                break;
            default:
                break;
        }

        if (document.activeElement !== usdInput) {
            usdInput.value = usdValue.toFixed(2);
        }
        if (document.activeElement !== eurInput) {
            eurInput.value = eurValue.toFixed(2);
        }
        if (document.activeElement !== plnInput) {
            plnInput.value = plnValue.toFixed(2);
        }
    });
}

// Event listener for all input fields using input
document.getElementById('usd').addEventListener('input', function (event) {
    const amount = parseFloat(event.target.value);
    if (!isNaN(amount)) {
        updateCurrencies(amount, 'USD');
    }
});

document.getElementById('eur').addEventListener('input', function (event) {
    const amount = parseFloat(event.target.value);
    if (!isNaN(amount)) {
        updateCurrencies(amount, 'EUR');
    }
});

document.getElementById('pln').addEventListener('input', function (event) {
    const amount = parseFloat(event.target.value);
    if (!isNaN(amount)) {
        updateCurrencies(amount, 'PLN');
    }
});



// Initial update when the page loads
updateCurrencies(1); // You can change the initial amount if needed
