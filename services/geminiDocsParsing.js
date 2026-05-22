const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const createHttpError = require("http-errors");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

module.exports = async ({ file, type }) => {
    const base64file = fs.readFileSync(file.path, { encoding: "base64" });
    let prompt = "";

    switch (type) {
        case "GST_CERTIFICATE":
            prompt = `
            You are a highly accurate KYC document verification and OCR extraction system.
                
            Expected document type:
            GST_CERTIFICATE
                
            Tasks:
            1. Identify the uploaded document type
            2. Verify whether the uploaded document is actually a GST Certificate
            3. Extract the required fields ONLY if the uploaded document matches the expected type
            4. Carefully structure the registered address into proper fields
                
            Return ONLY valid JSON in this exact format:
                
            {
                "documentType": "",
                "isExpectedDocument": false,
                "reason": "",
                "expiresAt": null,
                "data": {
                    "legalName": "",
                    "tradeName": "",
                    "companyType": "",
                    "gstNumber": "",
                    "panNumber": "",
                    "registeredAddress": {
                        "line1": "",
                        "city": "",
                        "state": "",
                        "pincode": ""
                    }
                }
            }
                
            Rules:
                
            1. If uploaded document is NOT a GST Certificate:
            - set isExpectedDocument to false
            - provide reason
            - set data to null
                
            2. If uploaded document IS a GST Certificate:
            - set isExpectedDocument to true
            - extract all fields accurately
                
            3. GST Number Rules:
            - GST Number is always 15 characters
            - PAN Number is embedded inside GST Number
            - PAN Number should be extracted from GST Number starting from the 3rd character and ending at the 12th character
            - Example:
              GST Number: 27ABCDE1234F1Z5
              PAN Number: ABCDE1234F
                
            4. Address Extraction Rules:
            - Carefully identify and separate:
              - line1
              - city
              - state
              - pincode
            - Pincode must always be extracted separately if present anywhere in the address
            - City and state should not be merged together
            - Do not place pincode inside line1
                
            5. companyType must ONLY be one of:
            PRIVATE_LIMITED,
            PUBLIC_LIMITED,
            LLP,
            PARTNERSHIP,
            SOLE_PROPRIETORSHIP,
            OTHER
                
            6. Return null for fields that are not clearly visible or confidently extractable
                
            7. Do NOT hallucinate values
                
            8. Return ONLY valid JSON
            `;

            break;

        case "PAN_CARD":
            prompt = `
            You are a KYC document verification system.

            Expected document type:
            PAN_CARD

            Tasks:
            1. Identify the uploaded document type
            2. Verify whether it is actually a PAN card
            3. Extract the required details only if document type matches

            Return ONLY valid JSON in this format:

            {
            "documentType": "",
            "isExpectedDocument": false,
            "reason": "",
            "confidence": 0,
            "data": {
                "legalName": "",
                "panNumber": ""
            },
            "expiresAt": ""
            }

            Rules:
            - If uploaded document is not a PAN card:
            - set isExpectedDocument to false
            - provide reason
            - set data to null

            - If uploaded document is a PAN card:
            - set isExpectedDocument to true
            - extract all fields properly

            - confidence should be between 0 and 1

            - Return null for missing fields

            - panNumber must follow valid PAN format

            - Return ONLY JSON
            `;

            break;

        case "INCORPORATION_CERTIFICATE":
            prompt = `
            You are a KYC document verification system.

            Expected document type:
            INCORPORATION_CERTIFICATE

            Tasks:
            1. Identify the uploaded document type
            2. Verify whether it is actually an Incorporation Certificate
            3. Extract the required details only if document type matches

            Return ONLY valid JSON in this format:

            {
            "documentType": "",
            "isExpectedDocument": false,
            "reason": "",
            "confidence": 0,
            "data": {
                "legalName": "",
                "cinNumber": "",
                "dateOfIncorporation": ""
            },
            "expiresAt": ""
            }

            Rules:
            - If uploaded document is not an Incorporation Certificate:
            - set isExpectedDocument to false
            - provide reason
            - set data to null

            - If uploaded document is an Incorporation Certificate:
            - set isExpectedDocument to true
            - extract all fields properly

            - confidence should be between 0 and 1

            - Return null for missing fields

            - cinNumber must contain valid CIN format if available

            - Return ONLY JSON
            `;

            break;

        case "BANK_PROOF":
            prompt = `
            You are a KYC document verification system.

            Expected document type:
            BANK_PROOF

            Accepted document types:
            - Cancelled Cheque
            - Bank Statement (not older than 2 months)
            - Passbook First Page

            Tasks:
            1. Identify the uploaded document type
            2. Verify whether it is a valid bank proof document
            3. Validate whether the document is acceptable
            4. Extract the required details only if document type matches

            Return ONLY valid JSON in this format:

            {
            "documentType": "",
            "isExpectedDocument": false,
            "reason": "",
            "confidence": 0,
            "data": {
                "accountHolderName": "",
                "accountNumber": "",
                "ifscCode": "",
                "accountType": ""
            },
            "expiresAt": ""
            }

            Rules:
            - If uploaded document is not a valid bank proof:
            - set isExpectedDocument to false
            - provide reason
            - set data to null

            - If uploaded document is a bank statement:
            - verify that statement is not older than 2 months
            - reject if older than 2 months

            - If uploaded document is valid:
            - set isExpectedDocument to true
            - extract all fields properly

            - confidence should be between 0 and 1

            - Return null for missing fields

            - ifscCode should follow valid IFSC format if available

            - Return ONLY JSON
            `;

            break;
        default:
            throw new createHttpError(400, "Unsupported document type uploaded.");
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: [
            {
                inlineData: {
                    mimeType: file.mimetype,
                    data: base64file
                }
            },
            {
                text: prompt
            }
        ]
    });

    const rawResponse = response.text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(rawResponse);
};
