module.exports = {
    capitalize(value) {
        return `${value.slice(0, 1).toUpperCase()}${value.slice(1, value.length)}`
    }
}