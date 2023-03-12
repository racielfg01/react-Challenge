import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const alarms = [...Array(5)].map((_, index) => ({
  id: faker.datatype.uuid(),
  name: sample([
    'Alarma 1',
    'Alarma 2',
    'Alarma 3',
  ]),
  source: faker.internet.domainName(),
  metric: sample(['CPU', 'MEM','File System']),
  trigger: sample([faker.random.numeric(), faker.random.numeric()]),
  paused: sample([faker.datatype.boolean(), faker.datatype.boolean()]),
  upper: sample([true, false]),

}));

export default alarms;
