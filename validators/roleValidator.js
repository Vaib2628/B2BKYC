const { body } = require("express-validator");
const { param } = require("express-validator");

module.exports = {
    createRole: [
        body("name")
            .notEmpty()
            .withMessage("Role name is required")
            .isString()
            .withMessage("Role name must be a string")
            .trim(),

        body("description").optional().isString().withMessage("Description must be a string").trim(),

        body("scope")
            .notEmpty()
            .withMessage("Scope is required")
            .isIn(["SYSTEM", "BUSINESS"])
            .withMessage("Invalid scope"),

        body("hasFullAccess").optional().isBoolean().withMessage("hasFullAccess must be a boolean")
    ],

    updateRole: [
        param("roleId").isMongoId().withMessage("Invalid role id"),
        
        body("name")
            .optional()
            .isString()
            .withMessage("Role name must be a string")
            .trim(),

        body("description")
            .optional()
            .isString()
            .withMessage("Description must be a string")
            .trim(),

        body("hasFullAccess")
            .optional()
            .isBoolean()
            .withMessage("hasFullAccess must be a boolean")
    ],

    assingPermission: [
        param("roleId").isMongoId().withMessage("Invalid role id"),
        body("permissionIds").isArray({ min: 1 }).withMessage("permissionIds must be a non-empty array"),
        body("permissionIds.*").isMongoId().withMessage("Invalid permission id")
    ],

    removePermissionFromRole: [
        param("roleId").isMongoId().withMessage("Invalid role id"),
        param("permissionId").isMongoId().withMessage("Invalid permission id")
    ],

    getRolePermission: [
        param("roleId").isMongoId().withMessage("Invalid role id")
    ]
};
