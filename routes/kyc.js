const router = require("express").Router();
const authentication = require("../middlewares/authentication.js");
const upload = require("../middlewares/upload.js");
const asyncHandler = require("../utils/asyncHandler");
const kycValidator = require("../validators/kycValidator.js");
const validate = require("../middlewares/validate.js");

router.use(authentication);

router.get(
    "/",
    asyncHandler(async function _getKyc(req, res, next) {
        const data = await require("../controllers/kyc/getKycDetails.js")(req.user.businessId);
        return res.success({ data });
    })
);

router.get(
    "/documents",
    asyncHandler(async function _getDocuments(req, res, next) {
        const data = await require("../controllers/kyc/getKycDocuments.js")(req.user);
        return res.success({ data });
    })
);

router.get(
    "/documents/:documentId",
    asyncHandler(async function _getDocumentById(req, res, next) {
        const updatedBody = { documentId: req.params.documentId, user: req.user };
        const data = await require("../controllers/kyc/getDocumentById.js")(updatedBody);
        return res.success({ data });
    })
);

router.post(
    "/documents/upload",
    upload.single("document"),
    validate(kycValidator.uploadValidation),
    asyncHandler(async function _uploadDocument(req, res, next) {
        const updatedBody = { file: req.file, user: req.user, ...req.body };
        const data = await require("../controllers/kyc/uploadDocument.js")(updatedBody);
        return res.success({ data });
    })
);

router.post(
    "/documents",
    validate(kycValidator.createDocumentValidation),
    asyncHandler(async function _createDocument(req, res, next) {
        const updatedBody = { user: req.user, ...req.body };
        const data = await require("../controllers/kyc/createDocument.js")(updatedBody);
        return res.success({ statusCode: 201, data });
    })
);

router.delete(
    "/documents/:documentId",
    asyncHandler(async function _deleteDocuement(req, res, next) {
        const updatedBody = { documentId: req.params.documentId, ...req.body };
        await require("../controllers/kyc/deleteDocument.js")(req.body);
        return res.success({ statusCode: 204 });
    })
);

module.exports = router;
