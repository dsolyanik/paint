const parseFile = require('./utils/parseFile');
const solveProblem = require('./solver');

const inputFile = process.argv[2];

if (!inputFile) {
    console.error('Missing input file argument');
    process.exit(1);
}

try {
    const data = parseFile(inputFile);
    const result = solveProblem(data);
    console.log(result);
} catch (err) {
    console.error(err);
    process.exit(1);
}