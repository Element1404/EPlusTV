import moment from 'moment';

import {db} from './database';
import {foxHandler, IFoxEvent} from './fox-handler';
import {useFoxSports} from './networks';

const parseCategories = (event: IFoxEvent) => {
  const categories = ['Sports'];
  for (const classifier of [
    ...(event.categoryTags || []),
    ...(event.genres || []),
  ]) {
    if (classifier !== null) {
      categories.push(classifier);
    }
  }
  return [...new Set(categories)];
};

const parseAirings = async (events: IFoxEvent[]) => {
  for (const event of events) {
    const entryExists: any = await db.entries.findOne({id: event.id});

    if (!entryExists) {
      console.log('Adding event: ', event.name);

      await db.entries.insert({
        categories: parseCategories(event),
        duration: moment(event.endDate).diff(
          moment(event.startDate),
          'seconds',
        ),
        end: new Date(event.endDate).valueOf(),
        from: 'foxsports',
        id: event.id,
        image: event.images.logo?.FHD || event.images.seriesDetail?.FHD,
        name: event.name,
        network: event.callSign,
        start: new Date(event.startDate).valueOf(),
      });
    }
  }
};

export const getFoxEventSchedules = async (): Promise<void> => {
  if (!useFoxSports) {
    return;
  }

  console.log('Looking for FOX Sports events...');

  const entries: IFoxEvent[] = await foxHandler.getEvents();

  try {
    await parseAirings(entries);
  } catch (e) {
    console.error(e);
    console.log('Could not parse FOX Sports events');
  }

  const now = new Date().valueOf();
  await db.entries.remove({end: {$lt: now}}, {multi: true});
};
