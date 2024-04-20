import logger from './lib/logger/logger.js';

const log = logger.getLogger('app.js');

log.error('occur: My log');
log.debug('Some debug data');
log.trace('Some trace data', 'Data', 'User');

