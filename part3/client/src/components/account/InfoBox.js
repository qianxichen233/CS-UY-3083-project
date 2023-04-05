import styles from "./InfoBox.module.scss";

const renderItem = ({ key, name, value }) => {
    if (Array.isArray(value)) {
        return (
            <section key={key}>
                <div>{name}</div>
                <section className={styles.list}>
                    {value.map((item, index) => {
                        return (
                            <div
                                className={`${!value && styles.empty}`}
                                key={index}
                            >
                                <span>{item}</span>
                            </div>
                        );
                    })}
                </section>
            </section>
        );
    }

    return (
        <section key={key}>
            <div>{name}</div>
            <div className={`${!value && styles.empty}`}>
                <span>{value}</span>
            </div>
        </section>
    );
};

const InfoBox = ({ title, info }) => {
    return (
        <div className={styles.container}>
            <header>
                <span>{title}</span>
            </header>
            <main>
                <div>
                    {info.map((item, index) => {
                        return renderItem({
                            key: index,
                            name: item.name,
                            value: item.value,
                        });
                    })}
                </div>
            </main>
        </div>
    );
};

export default InfoBox;
