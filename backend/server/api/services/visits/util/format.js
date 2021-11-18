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
    return visitation;
  },
  humanTime: (time) => {
    const human_time = DateTime.fromJSDate(time);
    if (human_time.hasSame(DateTime.now(), 'day')) {
      return 'today';
    }
    return human_time.toRelative();
  },
};

module.exports = {
  visit,
};
