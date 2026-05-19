const extractGstMetadata = (text) => {
    const lines = text
        .replace(/\r/g, "")
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    const gstRegex = /\d{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}/;

    const companyTypeMap = {
        proprietorship: "SOLE_PROPRIETORSHIP",
        partnership: "PARTNERSHIP",
        llp: "LLP",
        "privatelimited": "PRIVATE_LIMITED",
        "publiclimited": "PUBLIC_LIMITED"
    };

    const getNextValue = (label) => {
        const index = lines.findIndex(line =>
            line.toLowerCase().includes(label.toLowerCase())
        );

        if (index === -1) return null;

        for (let i = index + 1; i < lines.length; i++) {
            const value = lines[i];

            if (
                value &&
                !/^\d+\.$/.test(value) &&
                !value.toLowerCase().includes("registration") &&
                !value.toLowerCase().includes("certificate")
            ) {
                return value;
            }
        }

        return null;
    };

    let gstNumber = null;

    for (const line of lines) {
        const cleanedLine = line.replace(/\s+/g, "").toUpperCase();
        const match = cleanedLine.match(gstRegex);

        if (match) {
            gstNumber = match[0];
            break;
        }
    }

    let panNumber = null;

    if (gstNumber) {
        panNumber = gstNumber.substring(2, 12);
    }

    const legalName = getNextValue("Legal Name");
    const tradeName = getNextValue("Trade Name");

    const rawBusinessType =
        getNextValue("Constitution of Business");

    let companyType = "OTHER";

    if (rawBusinessType) {
        const normalizedType = rawBusinessType
            .replace(/\s+/g, "")
            .toLowerCase();

        companyType =
            companyTypeMap[normalizedType] || "OTHER";
    }

    const addressIndex = lines.findIndex(line =>
        line.toLowerCase().includes("address of principal place")
    );

    let address = null;

    if (addressIndex !== -1) {
        const addressLines = [];

        for (let i = addressIndex + 2; i < lines.length; i++) {
            const currentLine = lines[i];

            if (/\d{2}\/\d{2}\/\d{4}/.test(currentLine)) {
                break;
            }

            addressLines.push(currentLine);
        }

        address = addressLines.join(", ").trim();
    }

    let city = null;
    let state = null;
    let pincode = null;

    if (address) {
        const cleanedAddress = address
            .replace(/\s+/g, " ")
            .trim();

        const addressParts = cleanedAddress
            .split(",")
            .map(part => part.trim())
            .filter(Boolean);

        const pincodeMatch =
            cleanedAddress.match(/\d{6}/);

        pincode = pincodeMatch?.[0] || null;

        if (addressParts.length >= 2) {
            state =
                addressParts[addressParts.length - 1];

            city =
                addressParts[addressParts.length - 2];
        }
    }

    let expiresAt = null;
    let isLifetimeValid = true;

    const validityIndex = lines.findIndex(line =>
        line.toLowerCase().includes("period of validity")
    );

    if (validityIndex !== -1) {
        const validityLines =
            lines.slice(validityIndex, validityIndex + 8);

        const joinedValidity =
            validityLines.join(" ");

        if (
            !joinedValidity.toLowerCase().includes("na")
        ) {
            const dates =
                joinedValidity.match(/\d{2}\/\d{2}\/\d{4}/g);

            if (dates?.[1]) {
                expiresAt = new Date(dates[1]);
                isLifetimeValid = false;
            }
        }
    }

    return {
        legalName,
        tradeName,
        companyType,
        gstNumber,
        panNumber,
        registeredAddress: {
            line1: address,
            line2: null,
            city,
            state,
            country: "India",
            pincode
        },
        documentValidity: {
            expiresAt,
            isLifetimeValid
        },
        rawText: text
    };
};

module.exports = extractGstMetadata;