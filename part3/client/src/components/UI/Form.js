import { useState } from "react";
import Button from "./Button";
import styles from "./Form.module.scss";

const renderInput = ({
    key,
    type,
    label,
    value,
    onChange,
    placeholder,
    error,
}) => {
    return (
        <div key={key} className={styles.input}>
            <span>{label}</span>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            <span className={styles.inputError}>{error}</span>
        </div>
    );
};

const checkInput = (inputs) => {
    for (const [index, input] of inputs.entries()) {
        if (input.required && !input.value)
            return {
                index: index,
                error: input.required,
            };
    }
};

const Form = (props) => {
    const [error, setError] = useState();

    const onSubmitHandler = () => {
        const msg = checkInput(props.inputs);
        if (!msg) props.submit.onClick();
        setError(msg);
    };

    const onChangeHandler = (index, value) => {
        if (error && index === error.index) setError(null);
        props.inputs[index].onChange(value);
    };

    return (
        <div className={styles.form}>
            <div
                className={styles.inputs}
                style={{
                    gridTemplateColumns: `repeat(${
                        props.column ? props.column : 1
                    }, 1fr)`,
                }}
            >
                {props.inputs.map((input, index) => {
                    return renderInput({
                        key: index,
                        type: input.type,
                        label: input.label,
                        value: input.value,
                        onChange: onChangeHandler.bind(null, index),
                        placeholder: input.placeholder,
                        error: error?.index === index ? error.error : "",
                    });
                })}
            </div>
            <Button {...props.submit} onClick={onSubmitHandler} />
        </div>
    );
};

export default Form;
