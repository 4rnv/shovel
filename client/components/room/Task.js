import styles from '../../styles/room/todo.module.scss';
import { FaTrashAlt } from "react-icons/fa";
import {useState, useContext} from 'react';
import UserContext from "../../pages/UserContext";
import RoomContext from "../../pages/RoomContext";
import getToday from '../../utilities/getToday';

function Task({goal, activeTab, taskItem}) {

    /*
    {
        id: task.id,
        title: task.title,
        description: task.description,
        dateCreated: task.dateCreated,
        dateCompleted: task.dateCompleted,
        tags: [] 
    }
    */

    let { userInfo } = useContext(UserContext);
    let { roomData } = useContext(RoomContext);
    let [showDelete, setShowDelete] = useState(false);

    const deleteTask = async () => { 

        const response = await fetch('/api/deleteTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                room: roomData.id,
                goal,
                task: taskItem.id
            }),
        });
        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
        }
    }

    const toggleTask = async () => {

        if(activeTab !== userInfo.id) return;
        const response = await fetch('/api/toggleTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                room: roomData.id,
                goal,
                task: taskItem.id,
                date: getToday()
            }),
        });
        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
        }

    }

    const toggleDelete = (show) => {
        if(activeTab === userInfo.id) {
            setShowDelete(show);
        }
    }

    let {
        title,
        description,
        dateCreated,
        dateCompleted,
        tags
    } = taskItem;

    return(
        <div 
            className={`${styles.taskItem} ${dateCompleted ? styles.taskItemCompleted : ''}`}>
            <div
                onClick={() => toggleTask()} 
                className={`${styles.taskCheck} ${activeTab === userInfo.id ? styles.taskCheckEditable : ''}`}>
            </div>
            <div
                onMouseEnter={() => toggleDelete(true)}
                onMouseLeave={() => toggleDelete(false)} 
                className={styles.taskName}>
                <div
                    onClick={() => deleteTask()} 
                    className={`${styles.deleteTask} ${showDelete ? styles.showDeleteTask : ''}`}>
                    <FaTrashAlt />
                </div>
                <div>
                {title}
                </div>
                {
                    tags.map(tag =>
                        <span className={styles.taskTag}>{tag}</span>
                    )
                }
            </div>
        </div>
    )
}
export default Task;