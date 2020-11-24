const { readFileSync } = require('fs');

const parseFile = (path) => {
    const content = readFileSync(path, 'utf8');
    const lines = content.split(/[\r\n]+/);

    const colorsCount = parseInt(lines.shift(), 10);
    const customerPreferences = lines
        .map(line => line.split(/\s+/))
        .map(l => l.reduce((acc, curr) => {
            const color = parseInt(curr, 10);
            if (isNaN(color)) {
                acc[acc.length - 1].type = curr;
            } else {
                acc.push({ color });
            }

            return acc;
        }, []));
    const customers = customerPreferences
        .map(preferences => ({
            colorPreferences: preferences,
            isSatisfied: false,
            proposedColorPreferences: [],
            onlyOne: preferences.length === 1,
        }))
        .sort((a, b) => b.onlyOne - a.onlyOne)

    return { colorsCount, customers, customerCount: customerPreferences.length };
}

module.exports = parseFile;