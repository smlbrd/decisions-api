const User = require('../../models/users.model');
const Group = require('../../models/groups.model');
const List = require('../../models/lists.model');
const Option = require('../../models/options.model');
const Decision = require('../../models/decisions.model');
const DecisionsProcesses = require('../../models/decisions_processes.model');

const seed = async (
  usersData,
  groupsData,
  listsData,
  optionsData,
  decisionsProcessesData,
  decisionsData
) => {
  try {
    await User.deleteMany({});
    await User.insertMany(usersData);
    await Group.deleteMany({});
    await Group.insertMany(groupsData);
    await List.deleteMany({});
    await List.insertMany(listsData);
    await Option.deleteMany({});
    await Option.insertMany(optionsData);
    await DecisionsProcesses.deleteMany({});
    await DecisionsProcesses.insertMany(decisionsProcessesData);
    await Decision.deleteMany({});
    await Decision.insertMany(decisionsData);
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = seed;
