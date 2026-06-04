const router = require("express").Router();
const authentication = require("../middlewares/authentication.js");
const requirePermission = require("../middlewares/requirePermission.js");
const upload = require("../middlewares/upload.js");
const asyncHandler = require("../utils/asyncHandler");
const kycValidator = require("../validators/kycValidator.js");
const validate = require("../middlewares/validate.js");

router.use(authentication);

router.get(
    "/",
    requirePermission({ permission: "kyc.read", scope: "BUSINESS" }),
    asyncHandler(async function _getKyc(req, res, next) {
        const data = await require("../controllers/kyc/getKycDetails.js")(req.user.businessId);
        return res.success({ data });
    })
);

router.get(
    "/documents",
    requirePermission({ permission: "kyc.read", scope: "BUSINESS" }),
    asyncHandler(async function _getDocuments(req, res, next) {
        const data = await require("../controllers/kyc/getKycDocuments.js")(req.user);
        return res.success({ data });
    })
);

router.get(
    "/documents/:documentId",
    validate(kycValidator.getDocumentByIdValidation),
    requirePermission({ permission: "kyc.read", scope: "BUSINESS" }),
    asyncHandler(async function _getDocumentById(req, res, next) {
        const updatedBody = { documentId: req.params.documentId, user: req.user };
        const data = await require("../controllers/kyc/getDocumentById.js")(updatedBody);
        return res.success({ data });
    })
);

router.post(
    "/review-queue",
    requirePermission({ permission: "kyc.reviewQueue", scope: "SYSTEM" }),
    asyncHandler(async function _getReviewQueue(req, res, next) {
        const data = await require("../controllers/kyc/getReviewQueue.js")(req.body);
        return res.success({ data });
    })
);

router.get(
    "/review-queue/:documentId",
    validate(kycValidator.getReviewDocumentByIdValidation),
    requirePermission({ permission: "kyc.reviewQueue", scope: "SYSTEM" }),
    asyncHandler(async function _getReviewDocumentById(req, res, next) {
        const data = await require("../controllers/kyc/getReviewDocumentById.js")(req.params.documentId);
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
    requirePermission({ permission: "kyc.create", scope: "BUSINESS" }),
    asyncHandler(async function _createDocument(req, res, next) {
        const updatedBody = { user: req.user, ...req.body };
        const data = await require("../controllers/kyc/createDocument.js")(updatedBody);
        return res.success({ statusCode: 201, data, message: "Document created successfully" });
    })
);

router.delete(
    "/documents/:documentId",
    requirePermission({ permission: "kyc.delete", scope: "BUSINESS" }),
    asyncHandler(async function _deleteDocuement(req, res, next) {
        const updatedBody = { documentId: req.params.documentId, user: req.user, ...req.body };
        await require("../controllers/kyc/deleteDocument.js")(updatedBody);
        return res.success({ statusCode: 204, message: "Document deleted successfully" });
    })
);

router.patch(
    "/documents/:documentId/verify",
    requirePermission({ permission: "kyc.verify", scope: "SYSTEM" }),
    asyncHandler(async function _verifyDocument(req, res, next) {
        const updatedBody = { documentId: req.params.documentId, user: req.user, ...req.body };
        const data = await require("../controllers/kyc/verifyDocument.js")(updatedBody);
        return res.success({ data, message: "Document verified successfully" });
    })
);

router.patch(
    "/documents/:documentId/reject",
    requirePermission({ permission: "kyc.reject", scope: "SYSTEM" }),
    validate(kycValidator.rejectDocumentValidation),
    asyncHandler(async function _rejectDocument(req, res, next) {
        const updatedBody = { documentId: req.params.documentId, user: req.user, data: req.body };
        const data = await require("../controllers/kyc/rejectDocument.js")(updatedBody);
        return res.success({ data, message: "Document rejected successfully" });
    })
);

module.exports = router;
