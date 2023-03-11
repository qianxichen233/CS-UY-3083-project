const renderInput = ({ key, type, label, value, onChange }) => {
    return (
        <div key={key}>
            <span>{label}</span>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

const Form = (props) => {
    return (
        <div>
            {props.inputs.map((input, index) => {
                return renderInput({
                    key: index,
                    type: input.type,
                    label: input.label,
                    value: input.value,
                    onChange: input.onChange,
                });
            })}
            <button type="button" onClick={props.submit.onSubmit}>
                {props.submit.text}
            </button>
        </div>
    );
};

export default Form;
