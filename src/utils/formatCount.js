export function formatCount(count) {
    if (count >= 100000) {
        return `${Math.floor(count / 1000)}k`; 
    } else if (count >= 10000) {
        return `${(count / 1000).toFixed(1)}k`;
    } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
    } else {
        return count;
    }
}