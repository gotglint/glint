const bson = require('bson');
const Primus = require('./primus-glint');
const uuid = require('node-uuid');

const _host = Symbol('host');
const _port = Symbol('port');

const _id = Symbol('id');

const _bson = Symbol('bson');
const _data = Symbol('_data');
const _operations = Symbol('operations');

const _client = Symbol('client');

const _connected = Symbol('connected');

/** The way to invoke and interact with Glint */
class GlintClient {
  /**
   * Constructor
   */
  constructor(host, port) {
    this[_id] = uuid.v4();

    this[_bson] = new bson.BSONPure.BSON();
    this[_data] = null;
    this[_operations] = [];

    this[_host] = host;
    this[_port] = port;

    this[_connected] = false;
  }

  init() {
    this[_client] = new Primus(`http://${this[_host]}:${this[_port]}`);

    return new Promise((resolve, reject) => {
      this[_client].on('open', () => {
        this[_connected] = true;
        resolve();
      });

      this[_client].on('timeout', (err) => {
        this[_connected] = false;
        console.error('Client timeout while trying to connect: ', err);
        reject(err);
      });

      this[_client].on('error', (err) => {
        this[_connected] = false;
        console.error('Client error while trying to connect: ', err);
        reject(err);
      });

      this[_client].on('data', (data) => {
        console.info('Client received data: ', data);
      });

      this[_client].on('end', () => {
        this[_connected] = false;
        console.info('Client disconnected.');
      });
    });
  }

  /**
   * Parallelize data - i.e. distribute it for work across a cluster.
   *
   * @param {Object} data - The data to spread across a cluster.  Will replace this with something more meaningful so that we don't have to spear a huge amount of data to the server.
   */
  parallelize(data) {
    this[_data] = data;

    return this;
  }

  /**
   * Extract or otherwise convert a specific subset of information from the source data.
   *
   * @param {function} fn - The function to execute to perform the extraction.  Must accept one parameter and return a value.
   */
  map(fn) {
    this[_operations].push({task: 'map', data: fn});

    return this;
  }

  /**
   * Perform a summary operation on the data.
   *
   * @param {function} fn - The function to perform the sum.  Must accept two parameters (the sum and the data element) and return a value.
   * @param {Object} start - The start value for the reduction.
   */
  reduce(fn, start) {
    this[_operations].push({task: 'reduce', data: fn, start: start});

    return this;
  }

  /**
   * Perform a comparison on a piece of information - if this function returns true, the information is passed through to the next stage of the pipeline.  If not, it is discarded.
   *
   * @param {function} fn - The function to execute to perform the filter.  Must accept one parameter and return a boolean value.
   */
  filter(fn) {
    this[_operations].push({task: 'filter', data: fn});

    return this;
  }

  /**
   * Kick things off!
   *
   */
  run() {
    if (this[_operations] === null || this[_operations].length === 0) {
      throw new Error('No operations specified; nothing to run.');
    }

    if (this[_data] === null) {
      throw new Error('To run any task requires data - please parallelize something first.');
    }

    // submit the info to the server, return a promise?  an ID?
    if (this[_connected] === true) {
      this[_client].write('blah');
    } else {
      throw new Error('Glint is not connected to the server; try to fire off `init` first?');
    }
  }

  /**
   * Not to be used by anything other than testing.
   *
   * // TODO make a test client that simply extends this class and adds getOperations there
   *
   * @returns {Object}
   */
  getData() {
    return {id: this[_id], operations: this[_operations], data: this[_data]};
  }
}

module.exports = GlintClient;
