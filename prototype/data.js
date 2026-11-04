/* 拾礼 · 演示数据 */
window.DATA = {
  brand: { name: '拾礼', en: 'SHILI' },
  bank: '明德银行',
  user: { name: '林知远', initial: '林', phone: '138****6021' },

  identities: [
    { id: 'employee', label: '明德银行 · 员工', desc: '额度 ¥900 · 2 张券 · 8,600 积分' },
    { id: 'buyer',    label: '明德银行 · 采购', desc: '协议价 · 3 个在途项目 · 2 笔待开票' },
    { id: 'personal', label: '个人',            desc: '暂无权益 · 按零售价购买' }
  ],

  tints: { 1: '#EDE7DD', 2: '#E9E2D6', 3: '#E6E8E1', 4: '#EFE5E0', 5: '#E5E6E2', 6: '#ECE3D8' },

  products: [
    {
      id: 'cup', name: '秋水 · 双层玻璃杯', sub: '耐热玻璃 · 320ml',
      retail: 168, quota: 128, points: 4200, agree: 98,
      code: 'G-10293', icon: 'p-cup', tint: 1, badge: '编辑推荐', dims: ['8.4cm', '11.2cm'], brand: '承月',
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
      retail: 398, quota: 398, points: 9800, agree: 236,
      code: 'G-10512', icon: 'p-box', tint: 2, badge: '限量', dims: ['32cm', '24cm'], brand: '五芳斋',
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
      retail: 268, quota: 228, points: 6600, agree: 152,
      code: 'G-10331', icon: 'p-tea', tint: 3, badge: '', dims: ['9cm', '12cm'], brand: '云岫',
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
      retail: 198, quota: 168, points: 4800, agree: 112,
      code: 'G-10402', icon: 'p-diffuser', tint: 4, badge: '', dims: ['7.5cm', '18cm'], brand: '观夏',
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
      retail: 458, quota: 420, points: 11200, agree: 268,
      code: 'G-10608', icon: 'p-thermos', tint: 5, badge: '高毛利', dims: ['6.8cm', '22cm'], brand: '象印',
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
      retail: 128, quota: 98, points: 3200, agree: 72,
      code: 'G-10118', icon: 'p-notebook', tint: 6, badge: '', dims: ['14.8cm', '21cm'], brand: '拾礼',
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
      retail: 228, quota: 198, points: 5600, agree: 128,
      code: 'G-10244', icon: 'p-plate', tint: 2, badge: '', dims: ['15.5cm', '2.4cm'], brand: '双立人',
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
      retail: 158, quota: 128, points: 3900, agree: 88,
      code: 'G-10705', icon: 'p-candle', tint: 3, badge: '', dims: ['8cm', '9.5cm'], brand: '闻献',
      facts: ['现货 150', '36 小时发货', '广州', '可定制标签'],
      specs: [
        ['香型', '雪松 · 皮革'],
        ['净含量', '180g · 约 40 小时'],
        ['包装', '玻璃杯 · 纸盒'],
        ['装箱', '24 只 / 箱']
      ]
    }
  ],

  brands: [
    { name: '奥克斯', initial: 'A', pinyin: 'aokesi' },
    { name: '北鼎', initial: 'B', pinyin: 'beiding' },
    { name: '倍轻松', initial: 'B', pinyin: 'beiqingsong' },
    { name: '承月', initial: 'C', pinyin: 'chengyue' },
    { name: '茶颜悦色', initial: 'C', pinyin: 'chayanyuese' },
    { name: '德龙', initial: 'D', pinyin: 'delong' },
    { name: '迪士尼', initial: 'D', pinyin: 'dishini' },
    { name: '飞利浦', initial: 'F', pinyin: 'feilipu' },
    { name: '富光', initial: 'F', pinyin: 'fuguang' },
    { name: '观夏', initial: 'G', pinyin: 'guanxia' },
    { name: '广州酒家', initial: 'G', pinyin: 'guangzhoujiujia' },
    { name: '华光', initial: 'H', pinyin: 'huaguang' },
    { name: '蕉下', initial: 'J', pinyin: 'jiaoxia' },
    { name: '九阳', initial: 'J', pinyin: 'jiuyang' },
    { name: '乐扣乐扣', initial: 'L', pinyin: 'lekoulekou' },
    { name: '美心', initial: 'M', pinyin: 'meixin' },
    { name: '摩飞', initial: 'M', pinyin: 'mofei' },
    { name: '膳魔师', initial: 'S', pinyin: 'shanmoshi' },
    { name: '拾礼', initial: 'S', pinyin: 'shili' },
    { name: '双立人', initial: 'S', pinyin: 'shuangliren' },
    { name: '苏泊尔', initial: 'S', pinyin: 'supoer' },
    { name: '闻献', initial: 'W', pinyin: 'wenxian' },
    { name: '五芳斋', initial: 'W', pinyin: 'wufangzhai' },
    { name: '象印', initial: 'X', pinyin: 'xiangyin' },
    { name: '小熊', initial: 'X', pinyin: 'xiaoxiong' },
    { name: '云岫', initial: 'Y', pinyin: 'yunxiu' },
    { name: '张小泉', initial: 'Z', pinyin: 'zhangxiaoquan' }
  ],

  addresses: [
    { id: 'a1', name: '林知远', phone: '138****6021', region: '杭州市西湖区文三路 90 号', detail: '明德大厦 12F', isDefault: true },
    { id: 'a2', name: '林知远', phone: '139****8899', region: '杭州市滨江区江南大道 588 号', detail: '星光大厦 8F', isDefault: false }
  ],

  invoice: {
    type: 'company',
    title: '明德银行股份有限公司',
    taxNo: '91330100MA2XXXXXXX',
    bank: '招商银行杭州分行',
    account: '5719 0000 0000 888',
    addr: '杭州市西湖区文三路 90 号',
    phone: '0571-8888 8888'
  },

  contact: {
    name: '陈曦',
    role: '客户经理 · 明德银行项目组',
    phone: '138 0000 1234',
    wechat: 'chenxi_shili',
    hours: '工作日 9:00 – 18:00'
  },

  account: { phone: '138****6021', wechat: true }
};
