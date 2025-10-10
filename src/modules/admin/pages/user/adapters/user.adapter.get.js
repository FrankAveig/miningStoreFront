export const userAdapterGet = (data) => {
  const user = data?.data?.data;
  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    status: user.status === 'active' ? 'active' : 'inactive',
    role: user.role
  };
}; 