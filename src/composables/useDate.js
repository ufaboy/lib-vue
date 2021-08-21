export default function useDate() {
    const getDate = (timestamp) => {
        if (!timestamp) return null
        const date = new Date(timestamp * 1000);
        return date ? date.toLocaleString('ru-RU', {year: '2-digit', month: '2-digit', day: 'numeric'}) : null
    };

    return {getDate}
}
