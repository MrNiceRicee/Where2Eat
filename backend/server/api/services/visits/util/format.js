const { DateTime } = require('luxon');

const visit = {
  time: (item) => {
    const visitation = {};
    const translatedDate = DateTime.fromJSDate(item.visited_at);
    const newTime = translatedDate.toFormat('yyyy MMMM dd');
    visitation.human_time = translatedDate.toRelative();
    if (translatedDate.hasSame(DateTime.now(), 'day')) {
      visitation.human_time = 'today';
    }
    visitation.visited_at = newTime;
    visitation.spent = item.spent;
    visitation._id = item._id;
    // delete unnecessary items
    return visitation;
  },
};

module.exports = {
  visit,
};
