export const userAdapterList = (data) => {
    return data.data?.data?.map((user) => ({
        id: user.id,
        name: user.full_name,
        email: user.email,
        status: user.status === 'active' ? 'Activo' : 'Inactivo',
        is_active: user.status === 'active'
    }))
}
