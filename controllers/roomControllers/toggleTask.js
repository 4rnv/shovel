async function toggleTask(req, res, models, io) {

    try {
    
        const username = req.session.user?.username;
        const { room, goal, task, date } = req.body;

        if(!username) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        if(!room || !goal || !task || !date) {
            res.status(500).json({ success: false, message: 'Invalid format' });
            return;
        }

        const user = await models.User.findOne({ where: { username: username } });

        const roomItem = await models.Room.findOne({ where: { id: room } });
        if (!roomItem) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const userInRoom = await models.RoomUser.findOne({ where: { userId: user.id, room } });
        if (!userInRoom) {
            return res.status(403).json({ success: false, message: 'User not in room' });
        }

        const goalItem = await models.Goal.findOne({ where: { id: goal, userId: user.id } });
        if (!goalItem) {
            return res.status(404).json({ success: false, message: 'Goal not found or does not belong to user' });
        }

        const taskToUpdate = await models.Task.findOne({ where: { id: task, goalId: goal } });
        if (!taskToUpdate) {
            return res.status(404).json({ success: false, message: 'Task not found or does not belong to goal' });
        }

        if (taskToUpdate.dateCompleted) {
            taskToUpdate.dateCompleted = null;
        } else {
            taskToUpdate.dateCompleted = date;
        }

        await taskToUpdate.save();

        const allTasks = await models.Task.findAll({ where: { goalId: goal } });
        const allTasksCompleted = allTasks.every(task => task.dateCompleted);

        if (allTasksCompleted) {
            goalItem.endDate = date;
        } else {
            goalItem.endDate = null;
        }

        await goalItem.save();

        res.status(200).json({ success: true, message: 'Task and goal updated successfully' });

        const socketRoom = `room_${roomItem.id}`;
        io.to(socketRoom).emit('toggleTask', {
            user: user.id,
            goal,
            task,
            taskCompleted:taskToUpdate.dateCompleted,
            goalCompleted:goalItem.endDate
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating task and goal' });
    }

}
module.exports = toggleTask;