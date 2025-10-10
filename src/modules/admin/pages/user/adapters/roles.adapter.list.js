export const rolesAdapterList = (data) => {
  const roles = data?.data?.data?.map((role) => ({
    id: role.id,
    name: role.name,
    detail: role.detail,
    status: role.status
  }));
  return roles;
}; 