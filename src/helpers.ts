export default {
    capitalize(value: string) {
        return `${value.slice(0, 1).toUpperCase()}${value.slice(1, value.length)}`
    }
}