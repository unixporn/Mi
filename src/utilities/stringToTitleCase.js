Object.assign(String.prototype, {
    toTitleCase(str) {
        return this.toLowerCase()
            .split(" ")
            .map(
                word =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");
    },
});
