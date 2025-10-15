export const faqAdapterList = (data) => {
    return data.data?.data?.map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        status: faq.status === 'active' ? 'Activo' : 'Inactivo',
        is_active: faq.status === 'active',
        created_at: faq.created_at
    }))
}

