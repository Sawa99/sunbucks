//Orders page JS
function toggleQuantity(checkbox) {
    const container = checkbox.closest('.option');
    const qty = container.querySelector('.quantity');

    qty.hidden = !checkbox.checked;
}


//Location Page JS
const DEFAULT_LOCATION = {
    //deafult to cataylst building
    lat: 53.009092,
    lng: -2.175522
};


document.addEventListener('DOMContentLoaded', async () => {
    await customElements.whenDefined('gmpx-store-locator');
    const locator = document.querySelector('gmpx-store-locator');

    const initialiseLocator = (center, zoom) => {
        CONFIGURATION.mapOptions.center = center;
        CONFIGURATION.mapOptions.zoom = zoom;
        locator.configureFromQuickBuilder(CONFIGURATION);
    };

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                initialiseLocator(userLocation, 13);
            },
            () => {
                // Permission denied or error
                initialiseLocator(DEFAULT_LOCATION, 11);
            }
        );
    } else {
        // Geolocation not supported
        initialiseLocator(DEFAULT_LOCATION, 11);
    }
});


//install button
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.error('SW registration failed:', err));
    });
}

let deferredPrompt;
const installButton = document.getElementById('install-button');

installButton.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    installButton.style.display = 'block';

    installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    deferredPrompt = null;

    // 🔥 Hide the install button after interaction
    installButton.style.display = 'none';
});
});
