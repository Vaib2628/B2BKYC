const extractBusinessPanMetadata = (text) => {
    const lines = text
        .replace(/\r/g, "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;

    const ignorePatterns = [
        "INCOME TAX",
        "GOVT",
        "Permanent Account Number",
        "Signature",
        "DEPARTMENT",
        "INDIA",
        "ACCOUNT NUMBER CARD"
    ];

    const isNoise = (line = "") => {
        return ignorePatterns.some((pattern) => line.toLowerCase().includes(pattern.toLowerCase()));
    };

    const panCandidates = text.match(/[A-Z0-9]{10}/g) || [];

    let panNumber = null;

    for (let candidate of panCandidates) {
        candidate = candidate.toUpperCase();

        const correctedCandidate = candidate.replace(/O/g, "0").replace(/I/g, "1");

        if (panRegex.test(correctedCandidate)) {
            panNumber = correctedCandidate;

            break;
        }
    }

    const filteredLines = lines.filter((line) => {
        return !isNoise(line) && !panRegex.test(line) && line.length > 3;
    });

    let legalName = null;

    /*
        Business PAN cards usually:
        line before PAN number
        OR first meaningful line
    */

    const panIndex = lines.findIndex((line) => {
        return line.includes(panNumber);
    });

    if (panIndex > 0) {
        const possibleLegalName = lines[panIndex - 1];

        if (possibleLegalName && !isNoise(possibleLegalName)) {
            legalName = possibleLegalName;
        }
    }

    if (!legalName && filteredLines[0]) {
        legalName = filteredLines[0];
    }

    return {
        panNumber,

        legalName,

        rawText: text
    };
};

module.exports = extractBusinessPanMetadata;
