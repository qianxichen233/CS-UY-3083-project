import { useState } from "react";
import Form from "../UI/Form";
import styles from "./TicketForm.module.scss";

const TicketForm = (props) => {
    const [cards, setCards] = useState({
        card_type: "",
        card_number: "",
        card_name: "",
        card_expiration: "",
    });

    const onCardsChange = (property, value) => {
        setCards((prev) => {
            const newState = { ...prev };
            newState[property] = value;
            return newState;
        });
    };

    const onPurchaseHandler = () => {
        props.onPurchase(cards);
    };

    return (
        <div className={styles.form}>
            <Form
                column="2"
                inputs={[
                    {
                        type: "text",
                        label: "Card Type",
                        value: cards.card_type,
                        onChange: onCardsChange.bind(null, "card_type"),
                        required: "Card Type is Required",
                    },
                    {
                        type: "text",
                        label: "Card Number",
                        value: cards.card_number,
                        onChange: onCardsChange.bind(null, "card_number"),
                        required: "Card Number is Required",
                    },
                    {
                        type: "text",
                        label: "Name on Card",
                        value: cards.card_name,
                        onChange: onCardsChange.bind(null, "card_name"),
                        required: "Name is Required",
                    },
                    {
                        type: "date",
                        label: "Card Expiration Date",
                        value: cards.card_expiration,
                        onChange: onCardsChange.bind(null, "card_expiration"),
                        required: "Expiration Date is Required",
                    },
                ]}
                submit={{
                    text: "Purchase",
                    onClick: onPurchaseHandler,
                    disabled: props.disabled,
                }}
            />
        </div>
    );
};

export default TicketForm;
