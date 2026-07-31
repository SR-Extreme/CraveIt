export const PERMISSIONS = {
    FOODS_MANAGE: "foods:manage",
    CATEGORIES_MANAGE: "categories:manage",
    USERS_MANAGE: "users:manage",
    ORDERS_VIEW: "orders:view",
    ORDERS_ASSIGN: "orders:assign",
    ORDERS_STATUS: "orders:status",
    ORDERS_STATS: "orders:stats",
};

const ROLE_PERMISSIONS = {
    superadmin: [
        PERMISSIONS.FOODS_MANAGE,
        PERMISSIONS.CATEGORIES_MANAGE,
        PERMISSIONS.USERS_MANAGE,
        PERMISSIONS.ORDERS_VIEW,
        PERMISSIONS.ORDERS_ASSIGN,
        PERMISSIONS.ORDERS_STATUS,
        PERMISSIONS.ORDERS_STATS,
    ],
    admin: [
        PERMISSIONS.ORDERS_VIEW,
        PERMISSIONS.ORDERS_ASSIGN,
        PERMISSIONS.ORDERS_STATUS,
        PERMISSIONS.ORDERS_STATS,
    ],
};

export const getPermissionsForRole = (role) => {
    return ROLE_PERMISSIONS[role] || [];
};

export const hasPermission = (role, permission) => {
    return getPermissionsForRole(role).includes(permission);
};

export const isStaffRole = (role) => {
    return role === "admin" || role === "superadmin";
};