import request from './request';

const WarehouseService = {
  get: (params) => request.get('dashboard/admin/warehouse', { params }),

  getById: (id) => request.get(`warehouses/${id}`),
};

export default WarehouseService;
