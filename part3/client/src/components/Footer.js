import styles from "./Footer.module.scss";
import { Github } from "./UI/Icons";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <section className={styles.creator}>
                <h1>Creators</h1>
                <div>
                    <div>
                        <img src="/QianxiChen.jpg" width={50} />
                    </div>
                    <div>
                        <span className={styles.name}>Qianxi Chen</span>
                        <div className={styles.item}>
                            <Github size={20} />
                            <a href="https://github.com/qianxichen233">
                                Github
                            </a>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <img src="/XiaoyiYan.jpeg" width={50} />
                    </div>
                    <div>
                        <span className={styles.name}>Xiaoyi Yan</span>
                        <div className={styles.item}>
                            <Github size={20} />
                            <a href="https://github.com/YSNMYXY">Github</a>
                        </div>
                    </div>
                </div>
            </section>
            <section className={styles.course}>
                <img src="/NYU-Logo.png" />
                <h1>CS-UY 3083 Intro to Database</h1>
                <span>Professor: Ratan Dey</span>
                <span>Section A</span>
            </section>
        </footer>
    );
};

export default Footer;
