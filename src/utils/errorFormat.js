export function errorFormat(error, message) {
    let fieldErrors = {};

    if (error?.response?.data) {
        const data = error.response.data;

        if (data.message) {
            message = data.message;
        } else if (data.error) {
            message = data.error;
        } else if (data.title) {
            message = data.title;
        }

        if (data.data && typeof data.data === "object") {
            Object.entries(data.data).forEach(([field, msgs]) => {
                fieldErrors[field] = Array.isArray(msgs) ? msgs[0] : msgs;
            });
        } else if (data.errors && typeof data.errors === "object") {
            Object.entries(data.errors).forEach(([field, msgs]) => {
                fieldErrors[field] = Array.isArray(msgs) ? msgs[0] : msgs;
            });
        }
    } else if (error?.message) {
        message = error.message;
    }

    return { message, fieldErrors };
}