const Group = require('../models/groups.model')

const groupController = {
    getGroupById: async (ctx) => {
        const groupId = ctx.params.groupId;
        try {
            const group = await Group.findById({ _id: groupId });

            if (!group) {
                ctx.status = 404;
                ctx.body = { error: 'No results!' };
            } else {
                ctx.status = 200;
                ctx.body = group;
            }
        } catch (err) {
            console.log(err);
            ctx.status = 500;
            ctx.body = err;
        }
    }
}

module.exports = groupController;