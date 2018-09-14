/*
 * @Author: lkspc 
 * @Date: 2017-09-27 15:43:35 
 * @Last Modified by: lkspc
 * @Last Modified time: 2017-11-10 10:19:49
 */

'use strict';

module.exports = app => {
  /**
   * BaseController
   * 
   * @class BaseController
   * @extends {app.Controller}
   */
  class BaseController extends app.Controller {

    /**
     * Creates an instance of BaseController.
     * 
     * ### Example
     * 
     * ```javascript
     * // construct a controller
     * const controller = new BaseController(ctx, ctx.service.userService, {
     *   param: 'userId',                           // param for route url: /api/users/:userId
     *   limit: 20,                                 // limit returned rows
     *   map: {}                                    // a controller map, 
     *                                              // default to map controller with json codes
     * });
     * 
     * ```
     * 
     * @param {Object} ctx 
     * @param {Object} service 
     * @param {Object} [opts={}] 
     * @memberof BaseController
     */
    constructor(ctx, service, opts = {}) {
      super(ctx);
      this.Service = service;

      // options
      this.param = opts.param || 'id';
      this.limit = opts.limit || 10;
      this.map = Object.assign({
        'create': 201,
        'destroy': 200
      }, opts.map);
    }

    /**
     * response, default to response json.
     * override it if you want to response a view or others
     * 
     * @param {String} method 
     * @param {any} promise 
     * @memberof BaseController
     */
    async response(method, promise) {
      return this.responseJSON(promise, this.map[method] || 200);
    }

    /**
     * response json data to client
     * 
     * @param {Promise|Function} promise 
     * @param {number} [successCode=200] 
     * @memberof BaseController
     */
    async responseJSON(promise, successCode = 200) {
        try {
            if (typeof promise === 'function') {
                promise = promise();
            }
            const data = await promise;
            this.ctx.status = successCode;
            this.ctx.type = 'json';
            this.ctx.body = { success: true, data };
        } catch (err) {
            this.logger.warn(app.config.env === 'production' ? err.message : err);
            this.ctx.type = 'json';
            this.ctx.status = ~~err.code || 200;
            this.ctx.body = { success: false, message: err.message };
        }
    }

    /**
     * commom render
     * 
     * @param {String} view 
     * @param {Object|Function|Promise} promise 
     * @param {string} [errorView='error'] 
     * @returns 
     * @memberof BaseController
     */
    async render(view, promise, errorView = 'error') {
      try {
        if (typeof promise === 'function') {
          promise = promise();
        }
        const data = await promise;
        return this.ctx.render(view, { data });
      } catch (err) {
        this.logger.warn(err.message);
        return this.ctx.render(errorView, { error: err });
      }
    }

    /**
     * [GET] list all queried instances
     * 
     * @returns 
     * @memberof BaseController
     */
    async list() {
      // handle options
      this.handleOptions();
      // find all
      const promise = this.Service.findAll(this.ctx.query);
      // response
      return this.response('list', promise);
    }

    /**
     * [GET] show instance
     * 
     * @returns 
     * @memberof BaseController
     */
    async show() {
      // handle options
      this.handleOptions();
      // find by id
      const promise = this.Service.findById(this.ctx.params[this.param], this.ctx.query);
      // response
      return this.response('show', promise);
    }

    /**
     * [POST] create an instance
     * 
     * @returns 
     * @memberof BaseController
     */
    async create() {
      // create
      const promise = this.Service.create(this.ctx.request.body);
      // response
      return this.response('create', promise);
    }

    /**
     * [PUT] update instance
     * 
     * @returns 
     * @memberof BaseController
     */
    async update() {
      const id = this.ctx.params[this.param];
      const values = this.ctx.request.body;
      // update
      const promise = this.Service.update(id, values);
      // response
      return this.response('update', promise);
    }

    /**
     * [DELETE] delete instance
     * 
     * @memberof BaseController
     */
    async destroy() {
      const { params, queries } = this.ctx;
      const opts = params[this.param] || queries;
      // destroy
      const promise = this.Service.destroy(opts);
      // response
      return this.response('destroy', promise);
    }

    /**
     * handle query options from url
     * 
     * @memberof BaseController
     */
    handleOptions() {
      const { query } = this.ctx;

      // pagination
      query.limit = ~~query.limit || this.limit;
      query.page = ~~query.page || 1;

      // count
      query.count = query.count === '' || query.count === 'true';
      //order
      query.order = query.order && query.order.split(',').map(order => order.split(' '));
      // include
      if (query.include === '' || query.include === 'true') {
        query.include = true;
      } else if (!!query.include) {
        query.include = query.include.split(',');
      }

      return query;
    }
  }

  return BaseController;
};