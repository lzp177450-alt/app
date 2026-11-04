/* 拾礼 · 多语言 */
(function () {
  'use strict';

  var DICT = {
    /* 导航 */
    '首页': 'Home', '分类': 'Categories', '选品': 'Select', '权益': 'Benefits',
    '我的': 'Me', '工作台': 'Workspace', '报价': 'Quote', '报价单': 'Quotation',
    '品牌': 'Brands', '搜索品牌名称': 'Search brands',
    '现价': 'Current', '参考价': 'Reference',
    '购买数量': 'Quantity', '联系人': 'Contact', '手机号': 'Phone',
    '请输入姓名': 'Enter name', '请输入手机号': 'Enter phone', '确定': 'Confirm',
    '合计': 'Total', '请填写联系人': 'Enter a contact name',
    '请填写 11 位手机号': 'Enter an 11-digit phone number',
    '超出可用额度': 'Over available credit',
    '已提交，客服 24 小时内联系': 'Submitted · we will call within 24h',
    '没有找到匹配的品牌': 'No matching brands', '试试品牌名或拼音': 'Try a brand name or pinyin',
    '全部礼品': 'All Gifts', '全部礼品 ›': 'All Gifts ›', '商品详情': 'Product', '兑换确认': 'Confirm',
    '订单': 'Orders', '项目': 'Projects', '项目详情': 'Project', '礼册总目': 'Catalogue',
    '预览态': 'Preview', '屏 幕 目 录': 'SCREENS',
    '点身份标识可切换身份': 'Tap the identity chip to switch',
    '连点三次打开调试面板': 'Triple-tap to inspect',

    /* 首页 */
    '本期礼册 · 二〇二六 · 秋': 'CATALOGUE · AUTUMN 2026',
    '把心意': 'Send warmth',
    '送到': 'to the place',
    '该到': 'it should',
    '的地方': 'reach',
    '按预算': 'By budget', '您的预算': 'Your budget', '礼册总目 ›': 'Catalogue ›', '不限': 'Any',
    '100 元内': 'Under ¥100', '100 – 300': '¥100 – 300', '300 – 600': '¥300 – 600',
    '600 以上': '¥600+', '本周常选': 'Picked this week', '按销量 ›': 'By sales ›',
    '编辑精选': 'Editor picks', '本期专题': 'This issue',
    '中秋 · 企业礼赠': 'Mid-Autumn · Corporate gifting', '中秋礼盒': 'Mid-Autumn Box',
    '二十四款 · 可定制封签': '24 options · custom seal',
    '员工福利 · 商务往来': 'Benefits · Business', '企业定制': 'Corporate custom',
    '印 logo · 起订 100 份': 'Logo print · MOQ 100', '查看 ›': 'View ›', '编辑推荐': 'Featured', '共 24 件 ›': '24 items ›', '限量': 'Limited',
    '六件装 · 含手提袋 · 可定制封签': '6 pieces · tote bag · custom seal',
    '所有价格已含税。开票资料可在下单页填写，或由对接人统一开具。':
      'All prices include tax. Invoices can be requested at checkout.',

    /* 权益卡 */
    '可用额度': 'Credit', '12 月 31 日到期': 'Expires Dec 31', '礼品券': 'Vouchers',
    '最迟 11 月 30 日': 'By Nov 30', '积分': 'Points', '可兑 12 件': '12 redeemable',
    '元': ' CNY', '张': ' cards', '分': ' pts', '个': ' open',
    '在途项目': 'In flight', '待开票': 'To invoice', '本月采购': 'Spend this month',
    '本月新增 1 个': '1 added this month', '合计 ¥128,400': 'Total ¥128,400',
    '预算执行 62%': 'Budget used 62%', '当前身份': 'Current role', '个人': 'Personal',
    '按零售价购买': 'Retail price', '累计购买': 'Lifetime spend', '共 7 笔订单': '7 orders',

    /* 分类页 */
    '商品名称 · 品牌 · 编号': 'Product · brand · code',
    '搜索商品 · 品牌 · 编号': 'Search product · brand · code',
    '最低': 'Min', '最高': 'Max', '至': 'to', '搜索': 'Search',
    '按 场 景': 'BY OCCASION', '节日礼赠': 'Seasonal gifting', '员工福利': 'Employee benefits',
    '商务往来': 'Business relations', '客户回馈': 'Client rewards',
    '按 品 类': 'BY CATEGORY', '杯壶 · 茶器': 'Drinkware · tea', '家居 · 香氛': 'Home · fragrance',
    '礼盒 · 食礼': 'Gift box · food', '文具 · 办公': 'Stationery · office',
    '餐厨 · 器皿': 'Tableware', '食礼 · 干货': 'Food · dry goods',
    '家居家装': 'Home', '家居家纺': 'Home · textile', '数码办公': 'Digital · office',
    '文创 · 香氛': 'Stationery · fragrance', '按 预 算': 'BY BUDGET',
    '100 元以内': 'Under ¥100', '100 – 300 元': '¥100 – 300', '300 – 600 元': '¥300 – 600',
    '600 元以上': '¥600+',

    /* 排序 */
    '最新': 'Newest', '销量': 'Sales', '价格 ↑': 'Price ↑', '价格 ↓': 'Price ↓', '筛选': 'Filter',
    '价格为当前身份对应价。切换身份后，同一件商品会显示不同价格形态。':
      'Prices reflect your current role. Switching role changes how each item is priced.',

    /* 商品 */
    '复制': 'Copy', '编号': 'Code', '额度兑换': 'Credit', '积分兑换': 'Points',
    '零售价': 'Retail', '协议价': 'Contract', '建议零售': 'Retail', '单件毛利': 'Margin',
    '含税': 'Tax', '额度 ¥': 'Credit ¥', '协议 ¥': 'Contract ¥',
    '/ 件': '/ item', '额度 / 件': 'credit / item', '已含增值税': 'VAT included', '加入清单': 'Add to list',
    '立即兑换': 'Redeem now', '加入购物袋': 'Add to bag', '立即购买': 'Buy now',
    '加入方案': 'Add to plan', '立即下单': 'Order now',
    '现货 240': 'In stock 240', '现货 120': 'In stock 120', '现货 150': 'In stock 150',
    '现货 300': 'In stock 300', '现货 64': 'In stock 64', '现货 72': 'In stock 72',
    '现货 86': 'In stock 86',
    '48 小时发货': 'Ships in 48h', '24 小时发货': 'Ships in 24h', '36 小时发货': 'Ships in 36h',
    '72 小时发货': 'Ships in 72h', '7 天发货': 'Ships in 7 days',
    '苏州': 'Suzhou', '厦门': 'Xiamen', '上海': 'Shanghai', '宁波': 'Ningbo',
    '安溪': 'Anxi', '广州': 'Guangzhou', '杭州': 'Hangzhou', '景德镇': 'Jingdezhen',
    '可刻字': 'Engravable', '可换封签': 'Seal swap', '可定制底款': 'Custom mark',
    '可定制标签': 'Custom label', '可定制礼盒': 'Custom box', '可定制罐贴': 'Custom sticker',
    '可烫金': 'Foil stamping', '需预订': 'Pre-order',
    '材质': 'Material', '容量': 'Capacity', '包装': 'Packaging', '装箱': 'Carton',
    '定制': 'Custom', '档期': 'Lead time', '内容': 'Contents', '净含量': 'Net weight',
    '产地': 'Origin', '香型': 'Scent', '保温': 'Retention', '规格': 'Spec',
    '尺寸': 'Size', '装订': 'Binding',
    '高硼硅玻璃 · 双层': 'Borosilicate · double wall',
    '单只礼盒 · 含绒布袋': 'Gift box · pouch',
    '杯身激光刻字，起订 50 只': 'Laser engraving, MOQ 50',
    '激光刻字，起订 30 只': 'Laser engraving, MOQ 30',
    '封面烫金 / 压印，起订 100 本': 'Foil or emboss, MOQ 100',
    '月饼 4 枚 · 茶罐 1 只 · 瓷碟 1 只': '4 mooncakes · tea tin · porcelain dish',
    '硬盒 + 手提袋 + 封签': 'Rigid box · tote · seal',
    '封签可印企业标识，起订 100 盒': 'Custom seal, MOQ 100',
    '中秋前 30 天截单': 'Cut-off 30 days before',
    '福建安溪 · 海拔 1200m': 'Anxi, Fujian · 1,200m',
    '桂花 · 木质调': 'Osmanthus · woody', '雪松 · 皮革': 'Cedar · leather',
    '纯钛内胆 · 304 外壳': 'Titanium liner · 304 shell',
    '高白瓷 · 釉下彩': 'High-white porcelain · underglaze',
    '锁线胶装 · 可平摊': 'Sewn binding · lays flat',
    '马口铁罐 · 外纸盒': 'Tin can · carton', '磨砂瓶 · 纸盒': 'Frosted bottle · box',
    '锦盒 + 珍珠棉': 'Brocade box · foam', '玻璃杯 · 纸盒': 'Glass · carton',
    '划线价为厂商建议零售价，非本平台历史成交价。价格以提交订单时为准。':
      'Struck-through prices are manufacturer RRP, not our historical price. Final price at checkout.',

    /* 商品名 */
    '秋水 · 双层玻璃杯': 'Qiushui · Double-wall Glass',
    '承月 · 中秋礼盒': 'Chengyue · Mid-Autumn Box',
    '云岫 · 高山乌龙': 'Yunxiu · High-mountain Oolong',
    '木樨 · 无火香氛': 'Muxi · Reed Diffuser',
    '长白 · 钛保温杯': 'Changbai · Titanium Flask',
    '素笺 · 手工笔记本': 'Sujian · Handbound Notebook',
    '白瓷 · 六寸平盘': 'Baici · Porcelain Plates',
    '夜航 · 香薰蜡烛': 'Yehang · Scented Candle',
    '耐热玻璃 · 320ml': 'Heat-resistant glass · 320ml',
    '六件装 · 含手提袋': '6 pieces · tote bag',
    '150g · 双罐装': '150g · two tins', '100ml · 桂花': '100ml · osmanthus',
    '420ml · 纯钛内胆': '420ml · titanium liner', 'A5 · 128 页': 'A5 · 128 pages',
    '一对装 · 釉下彩': 'Pair · underglaze', '180g · 雪松': '180g · cedar',
    '75g × 2 罐': '75g × 2 tins', 'A5 · 128 页 · 100g 道林纸': 'A5 · 128pp · 100g paper',
    '100ml · 约 8 周': '100ml · approx. 8 weeks', '180g · 约 40 小时': '180g · approx. 40h',
    '6 小时 ≥ 65℃': '6h ≥ 65°C', '直径 15.5cm × 2': '15.5cm dia. × 2',

    /* 兑换 */
    '收货方式': 'Delivery', '快递到家 · 免运费': 'Courier · free shipping',
    '收件人': 'Recipient', '修改 ›': 'Edit ›', '默认': 'Default',
    '杭州市西湖区文三路 90 号': '90 Wensan Rd, Hangzhou',
    '明德大厦 12F': 'Mingde Tower, 12F', '商品': 'Item', '抵扣': 'Deduction',
    '福利额度': 'Credit', '运费': 'Shipping', '应付': 'Due',
    '兑换后额度不可退回。如需开具发票，请在下单前联系对接人。':
      'Credit is non-refundable once redeemed. Contact your account manager for invoices.',
    '确认兑换': 'Confirm redemption',

    /* 订单 */
    '运输中': 'In transit', '已完成': 'Completed', '预计 10 月 28 日送达': 'Arriving Oct 28',
    '10 月 14 日签收': 'Signed Oct 14', '320ml · ×1 · 额度兑换': '320ml · ×1 · credit',
    '420ml · 纯钛内胆 · ×1': '420ml · titanium · ×1',

    /* 工作台 */
    '十月 · 在途': 'October ·', '三个项目': 'three in flight',
    '明德银行 · 采购端　协议价已生效': 'Mingde Bank · procurement · contract prices active',
    '2026 中秋员工礼': 'Mid-Autumn 2026 staff gift',
    '预算 ¥600,000 · 交付 10 月 30 日': 'Budget ¥600,000 · due Oct 30',
    '已使用 ¥372,000': 'Used ¥372,000', '待办': 'To do',
    '中秋礼盒报价待确认': 'Mid-Autumn quote awaiting approval',
    '供应商已提交 · 剩余 2 天': 'Submitted · 2 days left',
    '¥128,400 待开票': '¥128,400 to invoice',
    '9 月批次 · 需补开票资料': 'Sept batch · details required',
    '10 月 30 日到货提醒': 'Oct 30 delivery reminder',
    '2026 中秋员工礼 · 320 份': 'Mid-Autumn 2026 · 320 units',
    '全部项目': 'All projects', '共 6 个 ›': '6 total ›',
    '2026 春节年货礼': 'Spring Festival 2026', '筹备中': 'Preparing',
    'Q3 客户答谢礼': 'Q3 client appreciation', '信用卡开卡礼 · 常备': 'Card welcome gift · evergreen',
    '长期': 'Ongoing',

    /* 选品 / 报价 */
    '选品 · 组方案': 'Select · build plan', '中秋员工礼': 'Mid-Autumn staff gift',
    '已选': 'Selected', '去报价': 'Quote',
    '加入方案的商品会带着协议价进入报价单，可单独改价、加备注。':
      'Items carry contract prices into the quotation; you can reprice and annotate each line.',
    '商品': 'Item', '协议价': 'Contract', '数量': 'Qty', '小计': 'Subtotal',
    '合 计': 'TOTAL', '建 议 零 售': 'RRP', '预 估 毛 利': 'EST. MARGIN',
    '改价': 'Reprice', '提交审批': 'Submit', 'Q-20261026-01': 'Q-20261026-01',
    '明德银行 · 320 份 · 交付 10 月 30 日': 'Mingde Bank · 320 units · due Oct 30',
    '客户打开分享链接，只看到「建议零售价」，看不到协议价与毛利。':
      'Clients opening the share link see RRP only — never contract price or margin.',

    /* 项目 */
    '320 份 · 预算 ¥600,000': '320 units · budget ¥600,000',
    '预算已用': 'Budget used', '份数': 'Units', '交付日': 'Due', '节点': 'Milestones',
    '已完成 4 / 6': '4 of 6 done', '需求确认': 'Brief confirmed',
    '320 份 · 人均 200 元档': '320 units · ¥200 tier', '方案报价': 'Proposal',
    '三选一，客户选定 A 方案': 'Three options, A chosen', '审批通过': 'Approved',
    '合同编号 MD-2026-0915': 'Contract MD-2026-0915', '生产完成': 'Production done',
    '封签定制 · 已全部入库': 'Custom seals · all stocked', '配送交付': 'Delivery',
    '分 4 个地址发出 · 顺丰': '4 addresses · SF Express', '开票结算': 'Invoicing',
    '增值税专用发票 · 6%': 'VAT invoice · 6%',

    /* 我的 */
    '明德银行 · 员工': 'Mingde Bank · Employee', '明德银行 · 采购': 'Mingde Bank · Procurement',
    '明德银行 · 员工 · 已绑定': 'Mingde Bank · Employee · linked',
    '明德银行 · 员工（预览）': 'Mingde Bank · Employee (preview)',
    '以员工视角查看 · 操作已禁用': 'Employee view · actions disabled',
    '切换身份': 'Switch role', '我的订单': 'My orders', '收货地址': 'Addresses',
    '发票抬头': 'Invoice title', '权益明细': 'Benefits detail', '联系对接人': 'Account manager',
    '关于拾礼': 'About Shili', '企业信息': 'Company', '开票资料': 'Invoice details',
    '合同与协议': 'Contracts', '对接人': 'Contact', '对账中心': 'Reconciliation',
    '优惠券': 'Coupons', '联系客服': 'Support',
    '本原型仅用于方案演示，数据均为示意。': 'Prototype only. All data is illustrative.',

    /* 身份面板 */
    '切 换 身 份': 'SWITCH ROLE', '以客户视角预览': 'Preview as client',
    '开启': 'On', '关闭': 'Off', '退出': 'Exit',
    '额度 ¥900 · 2 张券 · 8,600 积分': 'Credit ¥900 · 2 vouchers · 8,600 pts',
    '协议价 · 3 个在途项目 · 2 笔待开票': 'Contract price · 3 in flight · 2 to invoice',
    '暂无权益 · 按零售价购买': 'No benefits · retail price',

    /* 权益页 */
    '可 用 福 利 额 度': 'AVAILABLE CREDIT',
    '本月已用 ¥300 · 2026 年 12 月 31 日到期': 'Used ¥300 · expires Dec 31, 2026',
    '2 张可用': '2 available', '中秋礼盒兑换券': 'Mid-Autumn box voucher',
    '限「承月」系列 · 12.31 到期': 'Chengyue series · expires 12.31',
    '生日礼券': 'Birthday voucher', '全场通用 · 11.30 到期': 'All items · expires 11.30',
    '去使用 ›': 'Use ›', '明细 ›': 'Detail ›', '可用积分': 'Available points',
    '本月获得': 'Earned this month', '可兑换商品': 'Redeemable items',
    '额度仅限本人使用，不可转让、不可提现。离职后余额于次月清零。':
      'Credit is personal, non-transferable and non-withdrawable. Balance resets the month after you leave.',
    '企 业 权 益': 'COMPANY BENEFITS', '未绑定': 'Not linked',
    '绑定企业后，可使用福利额度、礼品券与积分':
      'Link your company to use credit, vouchers and points',
    '输入企业邀请码': 'Enter company invite code', '联系企业管理员': 'Contact admin',
    '已经是员工？向企业 HR 或行政索取邀请码，绑定后额度自动到账。':
      'Already an employee? Ask HR for the invite code; credit arrives automatically.',

    /* 登录 */
    '账号与安全': 'Account',
    '企 业 身 份': 'COMPANY ACCESS',
    '用于识别你所属的企业与福利额度，仅用于发放、开票与售后。':
      'Used to identify your company and benefits. Only for delivery, invoicing and support.',
    '已接入 · 员工福利': 'Connected · Employee benefits',
    '微信一键授权': 'Verify with WeChat',
    '使用企业邀请码': 'Use a company code',
    '不同意也可继续浏览，按零售价购买。': 'You can still browse and buy at retail price.',
    '输入企业提供的邀请码，绑定后额度自动到账。':
      'Enter the code from your company. Credit is added automatically.',
    '绑定': 'Link',
    '返回手机号授权': 'Back to phone verification',
    '正在识别所属企业…': 'Identifying your company…',
    '已 识 别': 'IDENTIFIED',
    '可用额度 ¥900 · 礼品券 2 张 · 积分 8,600': 'Credit ¥900 · 2 vouchers · 8,600 pts',
    '开始使用': 'Get started',
    '采 购 权 限': 'PROCUREMENT ACCESS',
    '采购身份可查看协议价、创建报价单。提交后由企业管理员审批，通常 1 个工作日内完成。':
      'Procurement accounts see contract prices and build quotes. Requests are approved by your admin, usually within one working day.',
    '提交申请': 'Submit request',
    '审批期间仍以员工身份使用。': 'You keep employee access while pending.',
    '申请采购权限': 'Request procurement access',
    '已绑定明德银行': 'Linked to Mingde Bank',
    '申请已提交，等待企业管理员审批': 'Request submitted · awaiting approval',
    '授权手机号，自动识别': 'Verify phone to auto-detect',
    '使用邀请码': 'Use invite code',
    '已经是员工？授权手机号即可自动识别，无需找 HR 要码。':
      'Already an employee? Verify your phone and we will find you — no code needed.',

    '没有找到匹配的商品': 'No matching items',
    '试试品牌名或商品编号': 'Try a brand or product code',

    /* 预览 */
    '预览中 · 以「明德银行 · 员工」视角查看': 'Preview · viewing as Mingde Bank Employee',
    '预览态已禁用此操作': 'Disabled in preview',
    '已进入客户视角预览': 'Preview mode on', '已退出预览': 'Preview off',
    '编号已复制': 'Code copied', '已加入方案': 'Added to plan',
    '兑换成功，预计 48 小时发货': 'Redeemed · ships within 48h',

    /* 其他 */
    '明德银行': 'Mingde Bank', '拾礼': 'Shili', '拾礼 · 小程序原型': 'Shili · Mini Program',
    '林知远': 'Lin Zhiyuan', '林知远（预览）': 'Lin Zhiyuan (preview)',
    '林知远　138****6021': 'Lin Zhiyuan · 138****6021',
    '顺丰 SF1234567890': 'SF Express · SF1234567890',
    '¥128 额度': '¥128 credit', '¥128,400 待开票': '¥128,400 to invoice'
  };

  var PATTERNS = [
    [/^价格 ¥([0-9,]+) – ([0-9,]+)$/, 'Price ¥$1 – $2'],
    [/^价格 ¥([0-9,]+) 以上$/, 'From ¥$1'],
    [/^价格 ¥([0-9,]+) 以内$/, 'Up to ¥$1'],
    [/^([0-9,]+) 分$/, '$1 pts'],
    [/^(\d+) 件 ›$/, '$1 ›'],
    [/^共 (\d+) 件 ›$/, '$1 items ›'],
    [/^(\d+) 件$/, '$1 items'],
    [/^(\d+) 张$/, '$1'],
    [/^(\d+) 套 \/ 箱$/, '$1 / carton'],
    [/^(\d+) 只 \/ 箱$/, '$1 / carton'],
    [/^(\d+) 本 \/ 箱$/, '$1 / carton'],
    [/^(\d+) 盒 \/ 箱$/, '$1 / carton'],
  ];

  var lang = 'zh';
  try { lang = localStorage.getItem('shili.lang') || 'zh'; } catch (e) {}

  function translate(key) {
    if (DICT[key] !== undefined) return DICT[key];
    var wan = key.match(/^¥([\d.]+)万$/);
    if (wan) return '¥' + (parseFloat(wan[1]) * 10) + 'k';
    var cnt = key.match(/^(\d+) 项$/);
    if (cnt) return cnt[1] + ' items';
    for (var i = 0; i < PATTERNS.length; i++) {
      if (PATTERNS[i][0].test(key)) return key.replace(PATTERNS[i][0], PATTERNS[i][1]);
    }
    return null;
  }

  function sync() {
    var body = document.body;
    if (!body) return;

    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (el.__zhHtml === undefined) el.__zhHtml = el.innerHTML;
      el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : el.__zhHtml;
    });

    var walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(function (node) {
      var p = node.parentNode;
      if (!p || p.nodeName === 'SCRIPT' || p.nodeName === 'STYLE') return;
      if (node.__zh === undefined) node.__zh = node.nodeValue;
      var raw = node.__zh;
      var key = raw.trim();
      if (!key) return;
      if (lang === 'zh') { if (node.nodeValue !== raw) node.nodeValue = raw; return; }
      var val = translate(key);
      if (val !== null) node.nodeValue = raw.replace(key, val);
    });

    document.querySelectorAll('[data-msg]').forEach(function (el) {
      if (el.__zhMsg === undefined) el.__zhMsg = el.getAttribute('data-msg');
      var key = (el.__zhMsg || '').trim();
      var val = translate(key);
      el.setAttribute('data-msg', lang === 'en' && val ? val : el.__zhMsg);
    });

    document.querySelectorAll('input[placeholder]').forEach(function (el) {
      if (el.__zhPh === undefined) el.__zhPh = el.getAttribute('placeholder');
      var pk = (el.__zhPh || '').trim();
      var pv = translate(pk);
      el.setAttribute('placeholder', lang === 'en' && pv ? pv : el.__zhPh);
    });

    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('#langBtn span').forEach(function (s) {
      s.classList.toggle('is-on', s.getAttribute('data-lang') === lang);
    });
    try { localStorage.setItem('shili.lang', lang); } catch (e) {}
  }

  function set(next) {
    lang = next === 'en' ? 'en' : 'zh';
    sync();
  }

  function toggle() { set(lang === 'en' ? 'zh' : 'en'); }

  window.I18N = {
    sync: sync,
    set: set,
    toggle: toggle,
    lang: function () { return lang; },
    t: function (key) { if (lang === 'zh') return key; var v = translate(key); return v === null ? key : v; }
  };
})();
