const User = require('../../models/users.model');
const Group = require('../../models/groups.model');
const List = require('../../models/lists.model');
const Option = require('../../models/options.model');

const seed = async (usersData, groupsData, listsData, optionsData) => {
  try {
    await User.deleteMany({});
    await User.insertMany(usersData);
    await Group.deleteMany({});
    await Group.insertMany(groupsData);
    await List.deleteMany({});
    await List.insertMany(listsData);
    await Option.deleteMany({});
    await Option.insertMany(optionsData);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seed;
