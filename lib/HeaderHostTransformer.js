const { Transform } = require('stream');
const debug = require('debug')('localtunnel:client:headertransformer');

class HeaderHostTransformer extends Transform {
  constructor(opts = {}) {
    debug(opts);
    super(opts);
    this.host = opts.host || 'localhost';
    this.replaced = false;
  }

  _transform(data, encoding, callback) {
    debug('_transform data', data);
    debug('_transform encoding', encoding);
    callback(
      null,
      this.replaced // after replacing the first instance of the Host header we just become a regular passthrough
      ?
      data :
      data.toString().replace(/(\r\n[Hh]ost: )\S+/, (match, $1) => {
        this.replaced = true;
        return $1 + this.host;
      })
    );
  }
}

module.exports = HeaderHostTransformer;