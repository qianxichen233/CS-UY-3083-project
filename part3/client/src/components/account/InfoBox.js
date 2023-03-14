import styles from "./InfoBox.module.scss";

const InfoBox = ({ title, info }) => {
    return (
        <div className={styles.container}>
            <header>
                <span>{title}</span>
            </header>
            <main>
                <div>
                    {info.map((item, index) => {
                        return (
                            <section key={index}>
                                <div>{item.name}</div>
                                <div>
                                    <span>{item.value}</span>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default InfoBox;
