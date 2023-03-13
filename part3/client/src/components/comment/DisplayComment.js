import styles from "./DisplayComment.module.scss";
import Stars from "./Stars";

const DisplayComment = ({ comment }) => {
    if (!comment?.rating) return;

    return (
        <div className={styles.container}>
            <Stars maxStars={5} filled={comment.rating} />
            <div className={styles.comment}>
                <span>{comment.comment}</span>
            </div>
        </div>
    );
};

export default DisplayComment;
