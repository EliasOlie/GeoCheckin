function toRadians(graus: number) {
    return graus * Math.PI / 180;
}

function calcularDistancia(lat1:  number, lon1: number, lat2: number, lon2: number) {
    const raioDaTerra = 6371; // Raio médio da Terra em quilômetros

    // Converte as coordenadas de graus para radianos
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);

    // Diferença nas coordenadas
    const deltaLat = lat2Rad - lat1Rad;
    const deltaLon = lon2Rad - lon1Rad;

    // Fórmula de Haversine para calcular a distância
    const a = Math.sin(deltaLat / 2) ** 2 +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distância em quilômetros
    const distancia = raioDaTerra * c;

    return distancia;
}

export function isInRange(latOrigem: number, lonOrigem: number, latPonto: number, lonPonto: number, raioMaximo: number) {
    const distancia = calcularDistancia(latOrigem, lonOrigem, latPonto, lonPonto);

    return distancia <= raioMaximo;
}
