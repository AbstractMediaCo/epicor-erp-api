const rp = require('request-promise-native');
const R = require('ramda');

class Connection {
  /**
   * Connection definition.
   * serverUrl: API base URL
   * username:
   * password:
   * company: optional company.  If this is specified then we'll pass that in call settings.
   */
  constructor({ serverUrl, username, password, company: _comp, strictSSL }) {
    this.company = _comp;

    this.makeRequest = function req(
      service,
      path,
      parameters = {},
      company = '',
      props
    ) {
      const headers = {};
      if (company) headers.CallSettings = '{"Company":"' + company + '"}';
      else if (this.company) {headers.CallSettings = '{"Company":"' + this.company + '"}';}
      // TODO some nicer error handling?
      const reqURL = `${serverUrl}/api/v1/${service}/${path}`;
      const request = rp({
        uri: reqURL,
        body: parameters,
        headers,
        method: 'POST',
        json: true,
        auth: { user: username, pass: password },
        strictSSL: strictSSL,
        ...props,
      });
      // console.log(request);
      return request;
    };

    // Perform a GET request to an OData service method
    this.odata = function odat(service, path, parameters = {}) {
      const qs = R.pickBy(val => !!val, parameters);
      const headers = {};
      if (this.company) {headers.CallSettings = '{"Company":"' + this.company + '"}';}
      return rp(`${serverUrl}/api/v1/${service}/${path}`, {
        qs,
        qsStringifyOptions: {
          arrayFormat: 'repeat'
        },
        headers,
        method: 'GET',
        json: true,
        auth: {
          user: username,
          pass: password
        },
        strictSSL: strictSSL
      }).then(({ value }) => value);
    };
  }
}

module.exports = Connection;
