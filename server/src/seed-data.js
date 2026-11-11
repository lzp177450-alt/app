/* 演示种子数据。正式环境由管理端导入，seed 只在空库时写入一次。 */

export const categories = [
  { id: 'drink', name: '杯壶 · 茶器', sort: 1 },
  { id: 'home', name: '家居 · 香氛', sort: 2 },
  { id: 'gift', name: '礼盒 · 食礼', sort: 3 },
  { id: 'work', name: '文具 · 办公', sort: 4 },
  { id: 'table', name: '餐厨 · 器皿', sort: 5 }
];

export const brands = [
  ['aokesi', '奥克斯', 'A'],
  ['beiding', '北鼎', 'B'],
  ['beiqingsong', '倍轻松', 'B'],
  ['chengyue', '承月', 'C'],
  ['chayanyuese', '茶颜悦色', 'C'],
  ['delong', '德龙', 'D'],
  ['dishini', '迪士尼', 'D'],
  ['feilipu', '飞利浦', 'F'],
  ['fuguang', '富光', 'F'],
  ['guanxia', '观夏', 'G'],
  ['guangzhoujiujia', '广州酒家', 'G'],
  ['huaguang', '华光', 'H'],
  ['jiaoxia', '蕉下', 'J'],
  ['jiuyang', '九阳', 'J'],
  ['lekoulekou', '乐扣乐扣', 'L'],
  ['meixin', '美心', 'M'],
  ['mofei', '摩飞', 'M'],
  ['shanmoshi', '膳魔师', 'S'],
  ['shili', '拾礼', 'S'],
  ['shuangliren', '双立人', 'S'],
  ['supoer', '苏泊尔', 'S'],
  ['wenxian', '闻献', 'W'],
  ['wufangzhai', '五芳斋', 'W'],
  ['xiangyin', '象印', 'X'],
  ['xiaoxiong', '小熊', 'X'],
  ['yunxiu', '云岫', 'Y'],
  ['zhangxiaoquan', '张小泉', 'Z']
].map(([pinyin, name, initial], i) => ({
  id: pinyin,
  name,
  initial,
  pinyin,
  sort: i
}));

export const products = [
  {
    id: 'cup', name: '秋水 · 双层玻璃杯', sub: '耐热玻璃 · 320ml',
    retail: 168, code: 'G-10293', brand: '承月', category: 'drink',
    icon: 'p-cup', tint: 1, badge: '编辑推荐',
    dims: ['8.4cm', '11.2cm'],
    facts: ['现货 240', '48 小时发货', '苏州', '可刻字'],
    specs: [
      ['材质', '高硼硅玻璃 · 双层'],
      ['容量', '320ml'],
      ['包装', '单只礼盒 · 含绒布袋'],
      ['装箱', '24 只 / 箱'],
      ['定制', '杯身激光刻字，起订 50 只']
    ]
  },
  {
    id: 'box', name: '承月 · 中秋礼盒', sub: '六件装 · 含手提袋',
    retail: 398, code: 'G-10512', brand: '五芳斋', category: 'gift',
    icon: 'p-box', tint: 2, badge: '限量',
    dims: ['32cm', '24cm'],
    facts: ['需预订', '7 天发货', '厦门', '可换封签'],
    specs: [
      ['内容', '月饼 4 枚 · 茶罐 1 只 · 瓷碟 1 只'],
      ['包装', '硬盒 + 手提袋 + 封签'],
      ['装箱', '6 盒 / 箱'],
      ['定制', '封签可印企业标识，起订 100 盒'],
      ['档期', '中秋前 30 天截单']
    ]
  },
  {
    id: 'tea', name: '云岫 · 高山乌龙', sub: '150g · 双罐装',
    retail: 268, code: 'G-10331', brand: '云岫', category: 'drink',
    icon: 'p-tea', tint: 3, badge: '',
    dims: ['9cm', '12cm'],
    facts: ['现货 86', '24 小时发货', '安溪', '可定制罐贴'],
    specs: [
      ['产地', '福建安溪 · 海拔 1200m'],
      ['净含量', '75g × 2 罐'],
      ['包装', '马口铁罐 · 外纸盒'],
      ['装箱', '12 套 / 箱']
    ]
  },
  {
    id: 'diffuser', name: '木樨 · 无火香氛', sub: '100ml · 桂花',
    retail: 198, code: 'G-10402', brand: '观夏', category: 'home',
    icon: 'p-diffuser', tint: 4, badge: '',
    dims: ['7.5cm', '18cm'],
    facts: ['现货 120', '48 小时发货', '上海', '可定制礼盒'],
    specs: [
      ['香型', '桂花 · 木质调'],
      ['容量', '100ml · 约 8 周'],
      ['包装', '磨砂瓶 · 纸盒'],
      ['装箱', '20 套 / 箱']
    ]
  },
  {
    id: 'thermos', name: '长白 · 钛保温杯', sub: '420ml · 纯钛内胆',
    retail: 458, code: 'G-10608', brand: '象印', category: 'drink',
    icon: 'p-thermos', tint: 5, badge: '高毛利',
    dims: ['6.8cm', '22cm'],
    facts: ['现货 64', '72 小时发货', '宁波', '可刻字'],
    specs: [
      ['材质', '纯钛内胆 · 304 外壳'],
      ['容量', '420ml'],
      ['保温', '6 小时 ≥ 65℃'],
      ['装箱', '12 只 / 箱'],
      ['定制', '激光刻字，起订 30 只']
    ]
  },
  {
    id: 'notebook', name: '素笺 · 手工笔记本', sub: 'A5 · 128 页',
    retail: 128, code: 'G-10118', brand: '拾礼', category: 'work',
    icon: 'p-notebook', tint: 6, badge: '',
    dims: ['14.8cm', '21cm'],
    facts: ['现货 300', '24 小时发货', '杭州', '可烫金'],
    specs: [
      ['规格', 'A5 · 128 页 · 100g 道林纸'],
      ['装订', '锁线胶装 · 可平摊'],
      ['装箱', '40 本 / 箱'],
      ['定制', '封面烫金 / 压印，起订 100 本']
    ]
  },
  {
    id: 'plate', name: '白瓷 · 六寸平盘', sub: '一对装 · 釉下彩',
    retail: 228, code: 'G-10244', brand: '双立人', category: 'table',
    icon: 'p-plate', tint: 2, badge: '',
    dims: ['15.5cm', '2.4cm'],
    facts: ['现货 72', '48 小时发货', '景德镇', '可定制底款'],
    specs: [
      ['材质', '高白瓷 · 釉下彩'],
      ['尺寸', '直径 15.5cm × 2'],
      ['包装', '锦盒 + 珍珠棉'],
      ['装箱', '10 套 / 箱']
    ]
  },
  {
    id: 'candle', name: '夜航 · 香薰蜡烛', sub: '180g · 雪松',
    retail: 158, code: 'G-10705', brand: '闻献', category: 'home',
    icon: 'p-candle', tint: 3, badge: '',
    dims: ['8cm', '9.5cm'],
    facts: ['现货 150', '36 小时发货', '广州', '可定制标签'],
    specs: [
      ['香型', '雪松 · 皮革'],
      ['净含量', '180g · 约 40 小时'],
      ['包装', '玻璃杯 · 纸盒'],
      ['装箱', '24 只 / 箱']
    ]
  }
];

export const contact = {
  name: '陈曦',
  role: '客户经理 · 明德银行项目组',
  phone: '138 0000 1234',
  wechat: 'chenxi_shili',
  hours: '工作日 9:00 – 18:00'
};

export const demo = {
  enterprise: { id: 'ent_mingde', name: '明德银行' },
  user: {
    id: 'u_demo',
    openid: 'dev:demo',
    name: '林知远',
    phone: '138****6021'
  },
  memberships: [
    { id: 'm_emp', role: 'employee', label: '明德银行 · 员工', desc: '额度 ¥900 · 2 张券' },
    { id: 'm_buy', role: 'buyer', label: '明德银行 · 采购', desc: '3 个在途项目 · 2 笔待开票' },
    { id: 'm_per', role: 'personal', label: '个人', desc: '按参考价选购' }
  ],
  addresses: [
    { id: 'a1', name: '林知远', phone: '138****6021', region: '杭州市西湖区文三路 90 号', detail: '明德大厦 12F', is_default: 1 },
    { id: 'a2', name: '林知远', phone: '139****8899', region: '杭州市滨江区江南大道 588 号', detail: '星光大厦 8F', is_default: 0 }
  ],
  invoice: {
    type: 'company',
    title: '明德银行股份有限公司',
    taxNo: '91330100MA2XXXXXXX',
    bank: '招商银行杭州分行',
    account: '5719 0000 0000 888',
    addr: '杭州市西湖区文三路 90 号',
    phone: '0571-8888 8888'
  }
};
