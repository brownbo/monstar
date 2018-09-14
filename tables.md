



## applycation

Comment: 




| field       | type                      | key     | extra          | null | default | collation       | comment |
|-------------|---------------------------|---------|----------------|------|---------|-----------------|---------|
| id          | int(11) unsigned zerofill | PRIMARY | auto_increment |      |         |                 |         |
| content     | varchar(255)              |         |                | YES  |         | utf8_general_ci |         |
| enabled     | tinyint(1)                |         |                | YES  |         |                 |         |
| operator_id | int(11)                   |         |                | YES  |         |                 |         |






## area

Comment: 




| field          | type                      | key                   | extra                       | null | default | collation       | comment |
|----------------|---------------------------|-----------------------|-----------------------------|------|---------|-----------------|---------|
| id             | int(11) unsigned zerofill | PRIMARY               | auto_increment              |      |         |                 |         |
| name           | varchar(50)               |                       |                             | YES  |         | utf8_general_ci | 区域名称    |
| parent_area_id | int(11)                   | FK_Reference_13->area |                             | YES  |         |                 | 上级区域    |
| operator_id    | int(11)                   |                       |                             | YES  |         |                 |         |
| operator_time  | datetime                  |                       | on update CURRENT_TIMESTAMP | YES  |         |                 |         |






## banner

Comment: 




| field       | type        | key     | extra                       | null | default | collation       | comment |
|-------------|-------------|---------|-----------------------------|------|---------|-----------------|---------|
| id          | int(11)     | PRIMARY |                             |      |         |                 |         |
| name        | varchar(50) |         |                             | YES  |         | utf8_general_ci | 名称      |
| img         | varchar(50) |         |                             | YES  |         | utf8_general_ci | 图片      |
| status      | tinyint(1)  |         |                             | YES  |         |                 |         |
| act_time    | varchar(50) |         |                             | YES  |         | utf8_general_ci | 轮播时间    |
| url         | varchar(50) |         |                             | YES  |         | utf8_general_ci | 链接      |
| operator_id | int(11)     |         |                             | YES  |         |                 |         |
| operateTime | datetime    |         | on update CURRENT_TIMESTAMP | YES  |         |                 |         |






## business_recommend

Comment: 




| field        | type                      | key     | extra                       | null | default | collation       | comment |
|--------------|---------------------------|---------|-----------------------------|------|---------|-----------------|---------|
| id           | int(11) unsigned zerofill | PRIMARY | auto_increment              |      |         |                 |         |
| name         | varchar(50)               |         |                             | YES  |         | utf8_general_ci |         |
| description  | varchar(255)              |         |                             | YES  |         | utf8_general_ci |         |
| operator_id  | int(11)                   |         |                             | YES  |         |                 |         |
| operate_time | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 |         |






## customer

Comment: 




| field            | type                      | key     | extra          | null | default | collation       | comment |
|------------------|---------------------------|---------|----------------|------|---------|-----------------|---------|
| id               | int(11) unsigned zerofill | PRIMARY | auto_increment |      |         |                 |         |
| name             | varchar(50)               |         |                | YES  |         | utf8_general_ci |         |
| username         | varchar(50)               |         |                | YES  |         | utf8_general_ci |         |
| certificate_type | tinyint(1)                |         |                | YES  |         |                 |         |
| certifi_code     | varchar(50)               |         |                | YES  |         | utf8_general_ci |         |
| password         | varchar(50)               |         |                | YES  |         | utf8_general_ci |         |
| shop_code        | varchar(50)               |         |                | YES  |         | utf8_general_ci |         |
| role             | tinyint(1)                |         |                | YES  |         |                 |         |






## evaluate_gift

Comment: 




| field         | type                      | key     | extra                       | null | default | collation       | comment         |
|---------------|---------------------------|---------|-----------------------------|------|---------|-----------------|-----------------|
| id            | int(11) unsigned zerofill | PRIMARY | auto_increment              |      |         |                 |                 |
| gift_id       | int(11)                   |         |                             | YES  |         |                 | 礼品外键（需要引入名称，品牌） |
| eval_customer | int(11)                   |         |                             | YES  |         |                 | 评价人             |
| eval_time     | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 | 评价时间            |
| eval_content  | varchar(255)              |         |                             | YES  |         | utf8_general_ci | 评价内容            |
| reply_user    | int(11)                   |         |                             | YES  |         |                 | 回复人             |
| reply_time    | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 | 回复时间            |
| reply_content | varchar(255)              |         |                             | YES  |         | utf8_general_ci | 回复内容            |






## evaluate_goods

Comment: 




| field         | type                      | key     | extra                       | null | default | collation       | comment         |
|---------------|---------------------------|---------|-----------------------------|------|---------|-----------------|-----------------|
| id            | int(11) unsigned zerofill | PRIMARY | auto_increment              |      |         |                 |                 |
| goods_id      | int(11)                   |         |                             | YES  |         |                 | 商品外键（需要引入名称，品牌） |
| eval_customer | int(11)                   |         |                             | YES  |         |                 | 评价人             |
| eval_time     | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 | 评价时间            |
| eval_content  | varchar(255)              |         |                             | YES  |         | utf8_general_ci | 评价内容            |
| reply_user    | int(11)                   |         |                             | YES  |         |                 | 回复人             |
| reply_time    | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 | 回复时间            |
| reply_content | varchar(255)              |         |                             | YES  |         | utf8_general_ci | 回复内容            |






## examine

Comment: 




| field        | type                      | key     | extra                       | null | default | collation       | comment |
|--------------|---------------------------|---------|-----------------------------|------|---------|-----------------|---------|
| id           | int(11) unsigned zerofill | PRIMARY | auto_increment              |      |         |                 |         |
| gift_id      | int(11)                   |         |                             | YES  |         |                 | 礼品id    |
| count        | int(11)                   |         |                             | YES  |         |                 | 申请数量    |
| net_spot_id  | int(11)                   |         |                             | YES  |         |                 | 申请网点    |
| time         | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 | 申请时间    |
| status       | tinyint(1)                |         |                             | YES  |         |                 | 申请状态    |
| commit       | varchar(255)              |         |                             | YES  |         | utf8_general_ci | 审核意见    |
| operator     | int(11)                   |         |                             | YES  |         |                 | 审核人     |
| operate_time | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 | 审核时间    |
| sign_user    | int(11)                   |         |                             | YES  |         |                 | 签收人     |
| sign_time    | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 | 签收时间    |






## gift

Comment: 




| field              | type                      | key     | extra                       | null | default | collation       | comment              |
|--------------------|---------------------------|---------|-----------------------------|------|---------|-----------------|----------------------|
| id                 | int(11) unsigned zerofill | PRIMARY | auto_increment              |      |         |                 |                      |
| gift_type_id       | int(3)                    |         |                             | YES  |         |                 | 类别ID                 |
| brand              | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 品牌                  |
|                    |                           |         |                             |      |         |                 |                      |
| imgs               | varchar(255)              |         |                             | YES  |         | utf8_general_ci | 多张图片                 |
| description        | varchar(255)              |         |                             | YES  |         | utf8_general_ci | 描述                   |
| status             | tinyint(1)                |         |                             | YES  |         |                 | 状态（0停用，1使用）          |
| is_hot             | tinyint(1)                |         |                             | YES  | 0       |                 | 热门（1热门，0普通）          |
| pay_type           | tinyint(1)                |         |                             | YES  |         |                 | 支付方式（0积分，1支付，2积分加支付） |
| exch_points        | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 兑换所用积分               |
| pay_amount         | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 兑换所用金额               |
| activity           | tinyint(1)                |         |                             | YES  |         |                 | 活动（0非活动，1活动）         |
| activity_time      | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 |                      |
| paid_users         | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 已经兑换人数               |
| business_recommend | int(11)                   |         |                             | YES  |         |                 | 推荐业务码                |
| git_count          | int(11)                   |         |                             | YES  |         |                 | 库存中获取                |
| operator_id        | int(11)                   |         |                             | YES  |         |                 |                      |
| operate_time       | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 |                      |






## gift_type

Comment: 




| field        | type                     | key     | extra                       | null | default | collation       | comment |
|--------------|--------------------------|---------|-----------------------------|------|---------|-----------------|---------|
| id           | int(3) unsigned zerofill | PRIMARY | auto_increment              |      |         |                 |         |
| name         | varchar(50)              |         |                             | YES  |         | utf8_general_ci |         |
| status       | tinyint(1)               |         |                             | YES  |         |                 |         |
| img          | varchar(50)              |         |                             | YES  |         | utf8_general_ci |         |
| operator     | int(11)                  |         |                             | YES  |         |                 |         |
| operate_time | datetime                 |         | on update CURRENT_TIMESTAMP | YES  |         |                 |         |






## goods

Comment: 




| field             | type                      | key     | extra                       | null | default | collation       | comment |
|-------------------|---------------------------|---------|-----------------------------|------|---------|-----------------|---------|
| id                | int(11) unsigned zerofill | PRIMARY | auto_increment              |      |         |                 |         |
| name              | varchar(50)               |         |                             | YES  |         | utf8_general_ci |         |
| desc              | varchar(255)              |         |                             | YES  |         | utf8_general_ci | 描述      |
| price             | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 价格      |
| count             | int(11)                   |         |                             | YES  |         |                 | 数量      |
| apply_price       | int(11)                   |         |                             | YES  |         |                 |         |
| last_price        | int(11)                   |         |                             | YES  |         |                 |         |
| pay_type          | tinyint(1)                |         |                             | YES  |         |                 | 支付方式    |
| exch_points       | int(11)                   |         |                             | YES  |         |                 | 支付积分    |
| account           | int(11)                   |         |                             | YES  |         |                 | 支付价格    |
| is_active         | tinyint(1)                |         |                             | YES  |         |                 | 是否是活动   |
| active_round      | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 活动周期    |
| active_time       | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 | 活动时间    |
| customer_level    | tinyint(1)                |         |                             | YES  |         |                 | 客户等级    |
| commit_person_id  | int(11)                   |         |                             | YES  |         |                 | 提交人     |
| phone             | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 联系电话    |
| commit_time       | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 | 提交时间    |
| post_status       | tinyint(1)                |         |                             | YES  |         |                 | 发起状态    |
| status            | tinyint(1)                |         |                             | YES  |         |                 | 状态      |
| examine_status    | tinyint(1)                |         |                             | YES  |         |                 |         |
| examine_person_id | int(11)                   |         |                             | YES  |         |                 |         |
| examine_time      | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 |         |
| shop_code_id      | int(11)                   |         |                             | YES  |         |                 |         |






## netspot

Comment: 




| field        | type                      | key                   | extra                       | null | default | collation       | comment      |
|--------------|---------------------------|-----------------------|-----------------------------|------|---------|-----------------|--------------|
| id           | int(11) unsigned zerofill | PRIMARY               | auto_increment              |      |         |                 |              |
| name         | varchar(50)               |                       |                             | YES  |         | utf8_general_ci | 网点名称         |
| area_id      | int(11)                   | FK_Reference_16->area |                             | YES  |         |                 | 所属区域         |
| address      | varchar(255)              |                       |                             | YES  |         | utf8_general_ci | 地址           |
| phone        | varchar(50)               |                       |                             | YES  |         | utf8_general_ci | 电话           |
| point        | varchar(50)               |                       |                             | YES  |         | utf8_general_ci | 坐标           |
| status       | tinyint(1)                |                       |                             | YES  |         |                 | 状态，0为停业，1为营业 |
| operator     | int(11)                   |                       |                             | YES  |         |                 |              |
| operate_time | datetime                  |                       | on update CURRENT_TIMESTAMP | YES  |         |                 |              |






## orders

Comment: 




| field         | type                      | key     | extra                       | null | default | collation | comment |
|---------------|---------------------------|---------|-----------------------------|------|---------|-----------|---------|
| id            | int(11) unsigned zerofill | PRIMARY | auto_increment              |      |         |           |         |
| type          | tinyint(1)                |         |                             | YES  |         |           |         |
| net_shop_code | int(11)                   |         |                             | YES  |         |           |         |
| goods_code    | int(11)                   |         |                             | YES  |         |           |         |
| verify_type   | tinyint(1)                |         |                             | YES  |         |           |         |
| count         | int(11)                   |         |                             | YES  |         |           |         |
| create_time   | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |           |         |
| pay_type      | tinyint(1)                |         |                             | YES  |         |           |         |
| exch_point    | int(11)                   |         |                             | YES  |         |           |         |
| amount        | int(11)                   |         |                             | YES  |         |           |         |
| status        | tinyint(1)                |         |                             | YES  |         |           |         |
| sum_price     | int(11)                   |         |                             | YES  |         |           |         |
| sum_code      | int(11)                   |         |                             | YES  |         |           |         |
| sum_status    | tinyint(1)                |         |                             | YES  |         |           |         |
| sum_time      | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |           |         |
| customer_no   | int(11)                   |         |                             | YES  |         |           |         |
| pay_time      | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |           |         |
| verify_time   | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |           |         |
| verifer       | int(11)                   |         |                             | YES  |         |           |         |
| netspot_id    | int(11)                   |         |                             | YES  |         |           |         |
| shop_id       | int(11)                   |         |                             | YES  |         |           |         |






## role

Comment: 




| field     | type                      | key     | extra          | null | default | collation       | comment |
|-----------|---------------------------|---------|----------------|------|---------|-----------------|---------|
| id        | int(11) unsigned zerofill | PRIMARY | auto_increment |      |         |                 |         |
| role_name | varchar(50)               |         |                | YES  |         | utf8_general_ci |         |
| power     | varchar(50)               |         |                | YES  |         | utf8_general_ci |         |






## sales

Comment: 




| field          | type        | key     | extra | null | default | collation       | comment |
|----------------|-------------|---------|-------|------|---------|-----------------|---------|
| id             | int(11)     | PRIMARY |       |      |         |                 |         |
| goods_id       | int(11)     |         |       | YES  |         |                 |         |
| customer_level | tinyint(1)  |         |       | YES  |         |                 |         |
| price          | varchar(50) |         |       | YES  |         | utf8_general_ci |         |






## shop

Comment: 




| field          | type                      | key     | extra                       | null | default | collation       | comment |
|----------------|---------------------------|---------|-----------------------------|------|---------|-----------------|---------|
| id             | int(11) unsigned zerofill | PRIMARY | auto_increment              |      |         |                 |         |
| shop_name      | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 商户名     |
| open_id        | varchar(50)               |         |                             | YES  |         | utf8_general_ci |         |
| sign_status    | tinyint(1)                |         |                             | YES  |         |                 | 注册状态    |
| sign_time      | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 | 注册时间    |
| shop_type_id   | int(11)                   |         |                             | YES  |         |                 | 商品种类    |
| shop_img       | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 图片      |
| shop_desc      | varchar(255)              |         |                             | YES  |         | utf8_general_ci | 描述      |
| connect_person | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 联系人     |
| connect_phone  | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 联系电话    |
| address        | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 地址      |
| geo_point      | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 地理位置    |
| recommend_id   | int(11)                   |         |                             | YES  |         |                 | 广告id    |
| username       | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 账户名     |
| account_name   | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 户名      |
| status         | tinyint(1)                |         |                             | YES  |         |                 | 状态      |
| is_recommend   | tinyint(1)                |         |                             | YES  |         |                 | 是否推荐    |
| operator_id    | int(11)                   |         |                             | YES  |         |                 |         |
| operate_time   | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 |         |






## shop_type

Comment: 




| field        | type                      | key     | extra                       | null | default | collation       | comment |
|--------------|---------------------------|---------|-----------------------------|------|---------|-----------------|---------|
| id           | int(11) unsigned zerofill | PRIMARY | auto_increment              |      |         |                 |         |
| name         | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 分类名称    |
| status       | tinyint(1)                |         |                             | YES  |         |                 | 状态      |
| img          | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 分类图片    |
| operator     | int(11)                   |         |                             | YES  |         |                 |         |
| operate_time | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 |         |






## stock

Comment: 




| field        | type                      | key     | extra                       | null | default | collation       | comment |
|--------------|---------------------------|---------|-----------------------------|------|---------|-----------------|---------|
| id           | int(11) unsigned zerofill | PRIMARY | auto_increment              |      |         |                 |         |
| gift_id      | int(11)                   |         |                             | YES  |         |                 | 礼品      |
| stock        | int(11)                   |         |                             | YES  |         |                 | 数量      |
| gift_type_id | int(11)                   |         |                             | YES  |         |                 | 礼品种类    |
| net_spot     | int(11)                   |         |                             | YES  |         |                 | 网点      |
| price        | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 价格      |
| operator     | int(11)                   |         |                             | YES  |         |                 |         |
| opetate_time | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 |         |






## stock_rec

Comment: 




| field             | type                      | key     | extra                       | null | default | collation | comment |
|-------------------|---------------------------|---------|-----------------------------|------|---------|-----------|---------|
| id                | int(11) unsigned zerofill | PRIMARY | auto_increment              |      |         |           |         |
| examine_id        | int(11)                   |         |                             | YES  |         |           | 申请编号    |
| gift_id           | int(11)                   |         |                             | YES  |         |           | 礼品编号    |
| active_type       | tinyint(1)                |         |                             | YES  |         |           | 调拨方式    |
| allocation_in_id  | int(11)                   |         |                             | YES  |         |           | 调入网点    |
| allocation_out_id | int(11)                   |         |                             | YES  |         |           | 调出网点    |
| allocation_count  | int(11)                   |         |                             | YES  |         |           | 调入数量    |
| operator          | int(11)                   |         |                             | YES  |         |           | 调拨人     |
| operator_time     | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |           | 调拨时间    |






## user

Comment: 




| field    | type                      | key         | extra          | null | default | collation       | comment |
|----------|---------------------------|-------------|----------------|------|---------|-----------------|---------|
| id       | int(11) unsigned zerofill | PRIMARY     | auto_increment |      |         |                 |         |
| username | varchar(50)               | AK_username |                | YES  |         | utf8_general_ci |         |
| password | varchar(50)               |             |                | YES  |         | utf8_general_ci |         |
| role_id  | int(11)                   |             |                | YES  |         |                 |         |






## voucher

Comment: 




| field        | type                      | key     | extra                       | null | default | collation       | comment |
|--------------|---------------------------|---------|-----------------------------|------|---------|-----------------|---------|
| id           | int(11) unsigned zerofill | PRIMARY | auto_increment              |      |         |                 |         |
| shop_id      | int(11)                   |         |                             | YES  |         |                 |         |
| name         | varchar(50)               |         |                             | YES  |         | utf8_general_ci |         |
| img          | varchar(50)               |         |                             | YES  |         | utf8_general_ci |         |
| value        | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 面额      |
| desc         | varchar(255)              |         |                             | YES  |         | utf8_general_ci | 描述      |
| count        | int(11)                   |         |                             | YES  |         |                 | 数量      |
| pay_type     | tinyint(1)                |         |                             | YES  |         |                 | 支付方式    |
| exch_point   | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 兑换积分    |
| account      | varchar(50)               |         |                             |      |         | utf8_general_ci | 支付金额    |
| is_active    | tinyint(1)                |         |                             | YES  |         |                 | 是否是活动   |
| active_time  | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 | 活动时间    |
| sum_price    | varchar(50)               |         |                             | YES  |         | utf8_general_ci | 结算金额    |
| operator     | int(11)                   |         |                             | YES  |         |                 |         |
| operate_time | datetime                  |         | on update CURRENT_TIMESTAMP | YES  |         |                 |         |









