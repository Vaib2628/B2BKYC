const createHttpError=require("http-errors");
const Role=require("../../models/Role");
const Permission=require("../../models/Permission");
const RolePermission=require("../../models/RolePermission");
const {STATUS_CODES,ERROR_MESSAGES}=require("../../constants/errorConstants");

module.exports=async({user,roleId,permissionIds})=>{
    const role=await Role.findById(roleId);
    if(!role) throw new createHttpError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.ROLE_NOT_FOUND);

    if(role.scope!==user.scope)
        throw new createHttpError(STATUS_CODES.FORBIDDEN,ERROR_MESSAGES.ROLE_OUT_OF_SCOPE);

    if(role.scope==="BUSINESS"&&(!role.businessId||!role.businessId.equals(user.businessId)))
        throw new createHttpError(STATUS_CODES.FORBIDDEN,ERROR_MESSAGES.ROLE_OUT_OF_SCOPE);

    const permissions=await Permission.find({_id:{$in:permissionIds}});
    if(permissions.length!==permissionIds.length)
        throw new createHttpError(STATUS_CODES.NOT_FOUND,ERROR_MESSAGES.SOME_PERMISSION_NOTFOUDN);

    for(const permission of permissions){
        if(role.scope==="BUSINESS"&&permission.scope==="SYSTEM")
            throw new createHttpError(STATUS_CODES.FORBIDDEN,ERROR_MESSAGES.PERMISSION_SCOPE_MISMATCH);
    }

    const existingRolePermissions=await RolePermission.find({
        roleId:role._id,
        permissionId:{$in:permissionIds}
    }).lean();

    const existingPermissionIds=new Set(
        existingRolePermissions.map(item=>item.permissionId.toString())
    );

    const rolePermissions=permissions
        .filter(permission=>!existingPermissionIds.has(permission._id.toString()))
        .map(permission=>({
            roleId:role._id,
            permissionId:permission._id
        }));

    if(rolePermissions.length)
        await RolePermission.insertMany(rolePermissions);

    return{
        assignedPermissions:rolePermissions.length
    };
};