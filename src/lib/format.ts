// Hermes (Android) n'a pas toujours Intl : formatage manuel, identique partout.
export const formatNumber = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export const formatMoney = (n: number) => `${formatNumber(n)} FCFA`;
