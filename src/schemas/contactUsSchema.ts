import * as yup from 'yup';

export const createContactUsSchema = (t: (key: string) => string) => {
    return yup.object().shape({
        name: yup.string().required(t('nameRequired')),
        email: yup.string().email(t('emailInvalid')).required(t('emailRequired')),
        message: yup.string().required(t('messageRequired')),
    });
};
