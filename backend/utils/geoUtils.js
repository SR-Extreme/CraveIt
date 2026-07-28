const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const calculateETA = (distanceKm, avgSpeedKmh = 25) => {
    if (!Number.isFinite(distanceKm) || distanceKm <= 0) return 0;
    return Math.max(1, Math.round((distanceKm / avgSpeedKmh) * 60));
};

const isValidCoords = (lat, lng) => {
    return (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        !(lat === 0 && lng === 0) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
    );
};

const formatAddress = (address = {}) => {
    const parts = [
        address.street,
        address.city,
        address.state,
        address.zipcode,
        address.country,
    ].filter(Boolean);

    return parts.join(", ");
};

// Geocode street address → { lat, lng } via OpenStreetMap Nominatim
const geocodeAddress = async (address) => {
    const query = formatAddress(address);
    if (!query) return null;

    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": "CraveIt-FoodDelivery/1.0 (tracking)",
                Accept: "application/json",
            },
        });

        if (!response.ok) return null;

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) return null;

        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        return isValidCoords(lat, lng) ? { lat, lng } : null;
    } catch (error) {
        console.log("[Geo] Geocode failed:", error.message);
        return null;
    }
};

export {
    calculateDistance,
    calculateETA,
    isValidCoords,
    formatAddress,
    geocodeAddress,
};
