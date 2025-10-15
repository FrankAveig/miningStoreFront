export const faqAdapterGet = (data) => {
  const faq = data?.data?.data;
  return {
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    status: faq.status
  };
};

