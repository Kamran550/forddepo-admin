import request from './request';

const addressService = {
  getByUser: (params) =>
    request.get('dashboard/admin/user-addresses/get-by-user', { params }),
  getAll: (params) => request.get('dashboard/admin/user-addresses', { params }),
  create: (data) => request.post('dashboard/admin/user-addresses', data),
};

export default addressService;
