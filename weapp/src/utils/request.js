import wepy from 'wepy';
export default function request(url, opts = {}, simple = true) {
  opts = {
    url,
    method: 'GET',
    dataType: 'json',
    header: { Cookie: wepy.$instance.globalData.cookies },
    ...opts
  };

  return wepy.request(opts)
    .then(({ statusCode, header, data: { success, data, message } }) => {
      if (!success) {
        return Promise.reject(new Error(message));
      }
      return simple ? data : { header, data, status: statusCode };
    })
    .catch(err => {
      console.error('[ERROR]', `${err.message} [${opts.method} ${opts.url}]`);
      return Promise.reject(err);
    });
}