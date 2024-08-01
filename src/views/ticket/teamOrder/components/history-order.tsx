export const columns = [
  {
    type: 'index',
    label: '序号',
    span: 8,
    width: 55,
    align: 'center',
    fixed: 'left',
    // 添加 index 属性用于渲染序号
    index: true,
  },
  {
    name: 'tickNo',
    label: '票号',
    align: 'center',
    width: 260,
    span: 8,
  },
  {
    name: 'passportNo',
    label: '护照号',
    valueType: 'input',
    align: 'center',
    width: 180,
    span: 8,
  },
  {
    name: 'trName',
    label: '姓名',
    align: 'center',
    span: 8,
    width: 180,
  },
  {
    name: 'travelType',
    label: '出入境',
    align: 'center',
    span: 8,
    width: 120,
  },
  {
    name: 'tickType',
    label: '船票类型',
    align: 'center',
    span: 8,
    width: 100,
  },
  {
    name: 'startSeat',
    label: '出发座位',
    align: 'center',
    span: 8,
    width: 120,
  },
  {
    name: 'startSeatNo',
    label: '出发座位号',
    align: 'center',
    span: 8,
    width: 100,
  },
  {
    name: 'state',
    color: 'blue',
    label: '出发状态',
    align: 'center',
    span: 8,
    width: 100,
  },
  {
    name: 'returnSeat',
    label: '返程座位',
    align: 'center',
    span: 8,
    width: 120,
  },
  {
    name: 'returnSeatNo',
    label: '返程座位号',
    align: 'center',
    span: 8,
    width: 100,
  },
  {
    name: 'returnState',
    color: 'blue',
    label: '返程状态',
    align: 'center',
    span: 8,
    width: 100,
  },
  {
    name: 'tickCost',
    color: 'red',
    label: '订票金额',
    align: 'center',
    fixed: 'right',
    span: 8,
    width: 120,
  },
]