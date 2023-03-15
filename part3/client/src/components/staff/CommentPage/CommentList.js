import DisplayComment from "../../comment/DisplayComment";
import styles from "./CommentList.module.scss";

const CommentList = ({ comments }) => {
    return (
        <div className={styles.container}>
            {comments.map((comment) => {
                return (
                    <DisplayComment key={comment.author} comment={comment} />
                );
            })}
        </div>
    );
};

export default CommentList;
