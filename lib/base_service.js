/*
 * @Author: lkspc 
 * @Date: 2017-09-27 15:43:35 
 * @Last Modified by: lkspc
 * @Last Modified time: 2017-11-10 10:20:28
 */

'use strict';

const _ = require('lodash');
const errMessage ={
    SequelizeUniqueConstraintError:'字段重复',
    SequelizeForeignKeyConstraintError:'此数据已被关联',
}

module.exports = app => {
  /**
   * BaseService
   * 
   * @class BaseService
   * @extends {app.Service}
   */
  class BaseService extends app.Service {
    /**
     * Creates an instance of BaseService.
     * 
     * ### Example Usage
     * 
     * ```javascript
     * // create instance with full opts
     * const service = new BaseService(ctx, app.model.User, {
     *   order: [['created_at', 'DESC']],
     *   limit: 10,
     *   associations: {
     *     'user_role': app.model.UserRole,
     *     'user_orders': { model: app.model.Order, as: 'user_orders'}, // alias
     *     'user_projects': { model: app.model.Project, where: {} },    // with condition
     *   },
     *   queries: {
     *     'name': true, // field 'name' using fuzzy query
     *     'id': false,  // field 'id' using condition query,
     *     'money': function(attr, val, where) {  // field 'money' using custom query
     *        where[attr] = 'prefix' + val + 'subfix'; 
     *      },
     *     'created_at': BaseService.TimeQuery, // use BaseService time query
     *   }
     * });
     * 
     * // construct a query opts
     * const opts = {
     *   include: ['user_role', 'user_orders'],       // associate with user_role and user_orders
     *   // include: true,                            // associate with all models
     *   order: [['created_at', 'ASC'], ['updated_at', 'DESC']],
     *   limit: 20,                                   // limit rows
     *   page: 2,                                     // page size
     *   count: true,                                 // count results, only BaseService#findAll support
     *   name: 'user_name_1',                         // fuzzy query: where name like '%user_name_1%'
     *   id: '00001',                                 // condition query: where id = '00001'
     *   sex: 'male',                                 // unknown query field, ignored
     *   created_at: '1111111,2222222',               // time query
     *   // ...
     * };
     * 
     * // construct sequelize opts
     * // this argument is optional and passed to Sequelize#Model#findOptions
     * const _opts = {
     *   attributes: ['id', 'name', ...],             // specify attributes
     *   // group: [],
     *   // ...
     * };
     * 
     * // query 
     * const result = await service.findAll(opts, _opts);
     * 
     * // ...
     * ```
     * 
     * @param {Object} ctx 
     * @param {Object} model 
     * @param {Object} [findOpts={}]                                options for findAll, findById, findAndCountAll
     * @param {Array<Array<String>>} [findOpts.order=null]          default querying order by
     * @param {Number} [findOpts.limit=10]                          default limit
     * @param {Object} [findOpts.associations={}]                   associated models
     * @param {Object} [findOpts.queries={}]                        condition, fuzzy and time queries
     * @param {Object} [findOpts.errors={}]                         errors for SequelizeError
     * @memberof BaseService
     */
    constructor(ctx, model, findOpts = {}) {
      super(ctx);

      // model
      this.model = model;
      // primary key
      this.primaryKey = model.primaryKeyAttribute || 'id';

      // findOpts
      Object.assign(this, {
        order: null,
        limit: 10,
        associations: {},
        queries: {},
        errors: {}
      }, findOpts);
    }

    /**
     * find all instances
     * 
     * @param {Object}         opts
     * @param {Number}         opts.limit           - limit the returned rows
     * @param {Number}         opts.page            - page size
     * @param {Array|Boolean}  [opts.include=false] - array of association names
     * @param {Array}          [opts.order=null]    - order by, passed to Sequelize#Model#findAll
     * @param {Boolean}        [opts.count=false]   - count the results
     * @param {Boolean}        [opts.plain=true]    - return plain object
     * @param {Object}         [_opts={}]           - query options, passed to Sequelize#Model#findAll  
     * @memberof BaseService
     */
    async findAll(opts = {}, _opts = {}) {
      // handle options
      this.handleOptions(opts, _opts);

      let result;
      // find and count
      if (!!opts.count) {
        result = await this.model.findAndCountAll(_opts);
        result.rows = BaseService.toJSON(result.rows, opts.plain);
      } else {
        result = await this.model.findAll(_opts);
        result = BaseService.toJSON(result, opts.plain);
      }

      return result;
    }

    /**
     * find one instance
     * 
     * @see {@link BaseService#findAll} 
     * 
     * @param {Object} opts 
     * @param {Object} [_opts={}] 
     * @returns 
     * @memberof BaseService
     */
    async findOne(opts = {}, _opts = {}) {
      this.handleOptions(opts, _opts);
      return BaseService.toJSON(await this.model.findOne(_opts), opts.plain);
    }

    /**
     * find an instance by primay key
     * 
     * @link BaseService.findAll
     * 
     * @param {String|Number} id
     * @param {Object} [opts={}] 
     * @param {Object} [_opts={}] 
     * @returns 
     * @memberof BaseService
     */
    async findById(id, opts = {}, _opts = {}) {
      this.handleOptions(opts, _opts);
      return BaseService.toJSON(await this.model.findById(id, _opts), opts.plain);
    }

    /**
     * create an instance
     * 
     * @param {Object} values 
     * @param {Object} [opts={}]
     * @param {Object} [_opts={}] 
     * @returns 
     * @memberof BaseService
     */
    async create(values, opts = {}, _opts = {}) {
      const instance = await this.model.create(values, _opts).catch(err=>{
          console.log(err.fields);
          let fileds = '';
          for(const key in err.fields)
          {
              fileds += key;
              fileds += ":";
              fileds += err.fields[key];
          }
        return Promise.reject(new Error(errMessage[err.name]+fileds));
      });
      return BaseService.toJSON(instance, opts.plain);
    }

    /**
     * update instances
     * 
     * @param {String|Number}   id
     * @param {Object|Function} values - values or options
     * @param {Object} [opts={}] - options
     * @memberof BaseService
     */
    async update(id, values, opts = {}) {
      // id -> vlaues, values -> options
      if (typeof id === 'object') {
        return this.model.update(id, values);
      }

      const instance = await this.findById(id, { plain: false });
      if (_.isFunction(values)) {
        values = await values(instance);
      }

      return BaseService.toJSON(await instance.update(values), opts.plain);
    }

    /**
     * destroy instances
     * 
     * @param {String|Number|Object|Array} id - id(s) or options
     * @memberof BaseService
     */
    async destroy(id) {
      if (_.isArray(id)) {
        return this.model.destroy({ where: {
            [this.primaryKey]: { '$in': id } } });
      } else if (_.isObject(id)) {
        // id -> options
        const _opts = this.handleQueries(id, {});
        return this.model.destroy(_opts).catch(err=>{
            return Promise.reject(new Error(errMessage[err.name]+'无法删除'));
        });
      } else {
        return this.model.destroy({ where: {
            [this.primaryKey]: id } }).catch(err=>{
            let fileds = '';
            for(const key in err.fields)
            {
                fileds += key;
                fileds += ":";
                fileds += err.fields[key];
            }
            return Promise.reject(new Error(errMessage[err.name]+fileds));
        });
      }
    }

    /**
     * convert instance to plain object
     * 
     * @static
     * @param {Array<Sequelize#Model>|Object} data 
     * @param {*} [plain] 
     * @returns 
     * @memberof BaseService
     */
    static toJSON(data, plain) {
      if (!data || plain === false) {
        return data;
      }
      if (Array.isArray(data)) {
        return data.map(item => item.toJSON());
      }
      return data.toJSON();
    }

    /**
     * handle query options
     * 
     * @param {Object} opts 
     * @param {Object} _opts 
     * @memberof BaseService
     */
    handleOptions(opts, _opts) {
      // handle pagination
      this.handlePagination(opts, _opts);
      // handle associations
      this.handleAssociations(opts, _opts);
      // handle query conditions
      this.handleQueries(opts, _opts);
      // handle order by
      this.handleOrderBy(opts, _opts);

      return _opts;
    }

    /**
     * handle pagination
     * 
     * @param {Object} opts 
     * @param {Number} opts.limit 
     * @param {Number} opts.page 
     * @param {Object} _opts 
     * @memberof BaseService
     */
    handlePagination(opts, _opts) {
      _opts.limit = opts.limit || this.limit;
      _opts.offset = ((opts.page || 1) - 1) * _opts.limit;
      return _opts;
    }

    /**
     * handle associations
     * 
     * @param {Object} opts 
     * @param {Array|Boolean} opts.include 
     * @param {Object} _opts 
     * @memberof BaseService
     */
    handleAssociations(opts, _opts) {
      if (Array.isArray(opts.include)) {
        _opts.include = _.values(_.pick(this.associations, opts.include));
      } else if (opts.include === true) {
        _opts.include = _.values(this.associations);
      }
      return _opts;
    }

    /**
     * handle order
     * 
     * @param {Object} opts 
     * @param {Array} [opts.order] 
     * @param {Object} _opts 
     * @memberof BaseService
     */
    handleOrderBy(opts, _opts) {
      _opts.order = opts.order || this.order;
      return _opts;
    }

    /**
     * handle queries
     * 
     * @param {Object} opts 
     * @param {Object} _opts 
     * @param {Object} [_opts.where={}]
     * @memberof BaseService
     */
    handleQueries(opts, _opts) {
      if (!_.isObject(_opts.where)) {
        _opts.where = {};
      }

      _.forEach(
        _.pick(opts, _.keys(this.queries)),
        (val, attr) => {
          const fuzzy = this.queries[attr];
          if (_.isFunction(fuzzy)) {
            fuzzy(attr, val, _opts.where);
          } else if (_.isBoolean(fuzzy)) {
            BaseService.Query(fuzzy, attr, val, _opts.where)
          }
        });

      return _opts;
    }

    /**
     * query
     * 
     * @static
     * @param {Boolean} fuzzy 
     * @param {String} attr 
     * @param {any} val 
     * @param {Object} where 
     * @memberof BaseService
     */
    static Query(fuzzy, attr, val, where) {
      if (!fuzzy) {
        where[attr] = val;
      } else {
        where[attr] = { '$like': '%' + val + '%' };
      }
    }

    /**
     * time query
     * 
     * @static
     * @param {String} attr 
     * @param {String} val - timestamps, separated with ',', example '121212,11111111'
     * @param {Object} where 
     * @memberof BaseService
     */
    static TimeQuery(attr, val, where) {
      const [start, end] = val.split(',', 2);
	  if(!!start || !!end) {
		where[attr] = {};
	  }
	  if(!!start){
	    where[attr]['$gte'] = new Date(parseInt(start));
	  }
	  if(!!end){
		where[attr]['$lt'] = new Date(parseInt(end));  
	  }
    }

    static pointsQuery(attr, val, where) {
        const points = val.split(',', 2);
        if(points.length>1)
        {
            where[attr] = {};
            if(points[0]!==''||points[0]===0)
            {
                where[attr]['$gte'] = points[0];
            }
            if(points[1]!==''||points[1]===0)
            {
                where[attr]['$lte'] = points[1];
            }
            //where[attr] = { '$gte': ~~points[0], '$lt': ~~points[1] };
        }
        else
        {
            where[attr] = ~~val;
        }
    }
    static statusQuery(attr, val, where) {
        const status = val.toString().split(',');
        if(status.length>1)
        {
           where[attr] = {};
          if(status[0]!==''||status[0]===0)
          {
              where[attr]['$gte'] = status[0];
          }
          if(status[1]!==''||status[1]===0)
          {
              where[attr]['$lte'] = status[1];
          }
           /* if(status[1])
            where[attr] = { '$gte': ~~status[0], '$lte': ~~status[1] };*/
        }
        else
        {
            where[attr] = ~~val;
        }
       // where[attr] = { '$gte': ~~start, '$lte': ~~end };
    }
  }

  return BaseService;
};