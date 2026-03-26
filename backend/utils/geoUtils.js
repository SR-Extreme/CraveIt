//distance between two coordinates

const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

const calculateETA = (distance, avgSpeed = 30) => {
    if (distance <= 0) return 0;

    const timeInHours = distance / avgSpeed;
    return Math.round(timeInHours * 60); //Minutes
}

export { calculateDistance, calculateETA };