import { useState } from 'react';

const useForm = (initialValues: Record<string, any>, validate: (values: Record<string, any>) => Record<string, string>) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>, callback: () => void) => {
        event.preventDefault();
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length === 0) {
            callback();
        } else {
            setErrors(validationErrors);
        }
    };

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
    };
};

export default useForm;