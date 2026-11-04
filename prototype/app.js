/* 拾礼 · 原型交互 */
(function () {
  'use strict';

  var D = window.DATA;
  var state = { identity: 'employee', preview: false, product: 'cup', plan: 3, query: '', min: null, max: null, brand: null, list: [] };

  var ALIAS = {
    cup: 'qiushui glass cup 玻璃杯 水杯',
    box: 'chengyue mooncake box 礼盒 中秋',
    tea: 'yunxiu oolong tea 乌龙茶 茶叶',
    diffuser: 'muxi diffuser fragrance 香氛 无火',
    thermos: 'changbai titanium flask 保温杯 钛',
    notebook: 'sujian notebook 笔记本 手帐',
    plate: 'baici porcelain plate 瓷盘 餐具',
    candle: 'yehang candle 香薰 蜡烛'
  };
  var stack = ['home'];

  var TABS = {
    employee: [
      { id: 'home', label: '首页', icon: 'i-home' },
      { id: 'category', label: '分类', icon: 'i-grid' },
      { id: 'catalog', label: '选品', icon: 'i-gift', fab: true },
      { id: 'me', label: '我的', icon: 'i-user' }
    ],
    personal: [
      { id: 'home', label: '首页', icon: 'i-home' },
      { id: 'category', label: '分类', icon: 'i-grid' },
      { id: 'catalog', label: '选品', icon: 'i-gift', fab: true },
      { id: 'me', label: '我的', icon: 'i-user' }
    ],
    buyer: [
      { id: 'workbench', label: '工作台', icon: 'i-case' },
      { id: 'category', label: '分类', icon: 'i-grid' },
      { id: 'catalog', label: '选品', icon: 'i-gift', fab: true },
      { id: 'quote', label: '报价', icon: 'i-doc' },
      { id: 'me', label: '我的', icon: 'i-user' }
    ]
  };

  var RAIL = [
    ['home', '首页'], ['category', '礼册总目'], ['brands', '品牌'], ['catalog', '全部礼品'], ['wallet', '权益'],
    ['product', '商品详情'], ['redeem', '兑换确认'],
    ['me', '我的'], ['workbench', '工作台'], ['sourcing', '选品'],
    ['quote', '报价单'], ['project', '项目'], ['preview', '预览态']
  ];

  var RAIL_ROLE = {
    workbench: 'buyer', sourcing: 'buyer', quote: 'buyer', project: 'buyer',
    wallet: 'employee', orders: 'employee'
  };

  function $(id) { return document.getElementById(id); }
  function byId(id) { return D.products.filter(function (p) { return p.id === id; })[0]; }
  function money(n) { return n.toLocaleString('en-US'); }
  function eff() { return state.preview ? 'employee' : state.identity; }

  /* ---------------- 底部 Tab ---------------- */
  function renderTabs() {
    var list = TABS[eff()] || TABS.employee;
    var cur = stack[stack.length - 1];
    $('tabbar').innerHTML = list.map(function (t) {
      if (t.fab) {
        return '<button class="tab tab--fab' + (t.id === cur ? ' is-on' : '') + '" data-tab="' + t.id + '">' +
          '<span class="ico"><span class="disc"><svg><use href="#' + t.icon + '"></use></svg></span></span>' +
          '<span class="lbl">' + t.label + '</span></button>';
      }
      var on = t.id === cur;
      return '<button class="tab' + (on ? ' is-on' : '') + '" data-tab="' + t.id + '">' +
        '<span class="ico"><svg><use href="#' + t.icon + '"></use></svg></span>' +
        '<span class="lbl">' + t.label + '</span></button>';
    }).join('');
  }

  /* ---------------- 身份 ---------------- */
  function renderIdentity() {
    var id = eff();
    var item = D.identities.filter(function (x) { return x.id === id; })[0];
    $('identityLabel').textContent = state.preview ? '明德银行 · 员工（预览）' : item.label;
    $('meName').textContent = state.preview ? '林知远（预览）' : D.user.name;
    $('meSub').textContent = state.preview
      ? '以员工视角查看 · 操作已禁用'
      : item.label + ' · 已绑定';
  }

  /* ---------------- 首页权益卡 ---------------- */
  function card(label, value, unit, note, accent) {
    return '<div class="card' + (accent ? ' card--accent' : '') + '">' +
      '<p class="card-label">' + label + '</p>' +
      '<p class="card-value">' + value + '<small>' + unit + '</small></p>' +
      '<p class="card-note">' + note + '</p></div>';
  }

  function renderWalletCards() {
    var box = $('walletCards');
    var id = eff();
    if (id === 'buyer') {
      box.innerHTML =
        card('在途项目', '3', '个', '本月新增 1 个', true) +
        card('待开票', '2', '笔', '合计 ¥128,400', false) +
        card('本月采购', '37.2', '万', '预算执行 62%', false);
      return;
    }
    if (id === 'employee') {
      box.innerHTML =
        card('可用额度', '900', '元', '12 月 31 日到期', true) +
        card('礼品券', '2', '张', '最迟 11 月 30 日', false) +
        card('积分', '8,600', '分', '可兑 12 件', false);
      return;
    }
    box.innerHTML =
      '<div class="card"><p class="card-label">当前身份</p><p class="card-value">个人</p><p class="card-note">按零售价购买</p></div>' +
      card('累计购买', '1,286', '元', '共 7 笔订单', false);
  }

  /* ---------------- 商品卡 ---------------- */
  function productCard(p, attr) {
    var badge = p.badge ? '<span class="badge">' + p.badge + '</span>' : '';
    var price = '<span class="price">参考 ¥ <b>' + p.retail + '</b></span>';

    return '<button class="pcard" ' + attr + '="' + p.id + '">' +
      '<div class="thumb" data-t="' + p.tint + '"><svg><use href="#' + p.icon + '"></use></svg>' + badge + '</div>' +
      '<p class="pname">' + p.name + '</p>' +
      '<p class="psub">' + p.sub + '</p>' +
      '<div class="prow">' + price + '</div>' +
      '</button>';
  }

  function priceOf(p) {
    return p.retail;
  }

  function priceLabel() {
    if (state.min !== null && state.max !== null) return '价格 ¥' + state.min + ' – ' + state.max;
    if (state.min !== null) return '价格 ¥' + state.min + ' 以上';
    return '价格 ¥' + state.max + ' 以内';
  }

  function syncChips() {
    ['#budgetChips', '#homeBudget'].forEach(function (sel) {
      var matched = false;
      Array.prototype.forEach.call(document.querySelectorAll(sel + ' .chip'), function (c) {
        var a = c.getAttribute('data-min');
        var b = c.getAttribute('data-max');
        var mi = a === '' || a === null ? null : Number(a);
        var ma = b === '' || b === null ? null : Number(b);
        var hit = !matched && mi === state.min && ma === state.max;
        if (hit) matched = true;
        c.classList.toggle('is-on', hit);
      });
    });
  }

  function applyPrice() {
    var a = (($('priceMin') && $('priceMin').value) || '').replace(/[^0-9]/g, '');
    var b = (($('priceMax') && $('priceMax').value) || '').replace(/[^0-9]/g, '');
    var lo = a === '' ? null : parseInt(a, 10);
    var hi = b === '' ? null : parseInt(b, 10);
    if (lo !== null && hi !== null && lo > hi) { var t = lo; lo = hi; hi = t; }
    state.min = lo;
    state.max = hi;
    if ($('priceMin')) $('priceMin').value = lo === null ? '' : lo;
    if ($('priceMax')) $('priceMax').value = hi === null ? '' : hi;
    syncChips();
    renderCatalog(state.query);
    if (current !== 'catalog') go('catalog');
  }

  function clearPrice() {
    state.min = null;
    state.max = null;
    if ($('priceMin')) $('priceMin').value = '';
    if ($('priceMax')) $('priceMax').value = '';
    syncChips();
    renderCatalog(state.query);
  }

  function renderCatalog(q) {
    var term = (q || '').trim().toLowerCase();
    var list = D.products.filter(function (p) {
      if (state.brand && p.brand !== state.brand) return false;
      var price = priceOf(p);
      if (state.min !== null && price < state.min) return false;
      if (state.max !== null && price > state.max) return false;
      if (!term) return true;
      var hay = (p.name + ' ' + p.sub + ' ' + p.code + ' ' + (p.brand || '') + ' ' + (ALIAS[p.id] || '')).toLowerCase();
      return hay.indexOf(term) > -1;
    });
    var grid = $('catalogGrid');
    if (!grid) return;
    grid.innerHTML = list.map(function (p) { return productCard(p, 'data-product'); }).join('');
    var empty = $('catalogEmpty');
    if (empty) empty.hidden = list.length > 0;
    var count = $('catalogCount');
    if (count) count.innerHTML = list.length + ' 件';
    var note = document.querySelector('[data-screen="catalog"] .note');
    if (note) note.hidden = list.length === 0;

    var btag = $('brandTag');
    if (btag) {
      btag.hidden = !state.brand;
      if (state.brand) {
        var bt = $('brandTagText');
        if (bt) bt.innerHTML = '<span class="tag-k">品牌</span> ' + state.brand;
      }
    }
  }

  function renderGrids() {
    var home = [D.products[0], D.products[2], D.products[4], D.products[5]];
    $('homeGrid').innerHTML = home.map(function (p) { return productCard(p, 'data-product'); }).join('');
    $('sourcingGrid').innerHTML = D.products.map(function (p) { return productCard(p, 'data-add'); }).join('');
    renderCatalog(state.query);
    $('planCount').textContent = state.plan;
  }

  /* ---------------- 分类 ---------------- */
  var CATS = [
    { id: 'drink', name: '杯壶 · 茶器', ids: ['cup', 'tea', 'thermos'] },
    { id: 'home', name: '家居 · 香氛', ids: ['diffuser', 'candle'] },
    { id: 'gift', name: '礼盒 · 食礼', ids: ['box'] },
    { id: 'work', name: '文具 · 办公', ids: ['notebook'] },
    { id: 'table', name: '餐厨 · 器皿', ids: ['plate'] }
  ];
  var catIndex = 0;

  function renderCat() {
    var rail = $('catRail');
    var pane = $('catPane');
    if (!rail || !pane) return;

    rail.innerHTML = CATS.map(function (c, i) {
      return '<button class="cattab' + (i === catIndex ? ' is-on' : '') + '" data-cat="' + i + '">' + c.name + '</button>';
    }).join('');

    var cat = CATS[catIndex];
    var list = cat.ids.map(byId).filter(Boolean);
    pane.innerHTML =
      '<div class="catpane-head"><span class="catpane-title">' + cat.name + '</span><span class="catpane-count">' + list.length + ' 件</span></div>' +
      '<div class="catpane-grid">' + list.map(function (p) { return productCard(p, 'data-product'); }).join('') + '</div>';
  }

  /* ---------------- 清单 / 地址 / 发票 / 信息 ---------------- */
  var INV = { type: 'company' };

  function listCount() {
    return state.list.reduce(function (s, it) { return s + it.qty; }, 0);
  }
  function listTotal() {
    return state.list.reduce(function (s, it) {
      var p = byId(it.id);
      return s + (p ? unitPrice(p) * it.qty : 0);
    }, 0);
  }
  function addToList(p, n) {
    var step = n || 1;
    var hit = state.list.filter(function (x) { return x.id === p.id; })[0];
    if (hit) hit.qty += step; else state.list.push({ id: p.id, qty: step });
    renderActionbar();
    renderList();
    renderMe();
    toast('已加入清单', '查看', function () { go('list'); });
  }
  function renderList() {
    var box = $('listItems');
    if (!box) return;
    if (!state.list.length) {
      box.innerHTML = '<div class="empty"><p class="empty-title">清单是空的</p><p class="empty-note">去商品页挑几件</p></div>';
    } else {
      box.innerHTML = state.list.map(function (it) {
        var p = byId(it.id);
        if (!p) return '';
        return '<div class="litem">' +
          '<div class="thumb" data-t="' + p.tint + '"><svg><use href="#' + p.icon + '"></use></svg></div>' +
          '<div class="li-body"><p class="li-name">' + p.name + '</p>' +
          '<p class="li-price">¥' + unitPrice(p) + '</p></div>' +
          '<div class="li-right"><button class="li-x" data-list-remove="' + p.id + '">×</button>' +
          '<div class="stepper"><button class="step" data-list-step="-1" data-id="' + p.id + '">−</button>' +
          '<span class="li-qty">' + it.qty + '</span>' +
          '<button class="step" data-list-step="1" data-id="' + p.id + '">+</button></div></div></div>';
      }).join('');
    }
    $('listSum').textContent = '¥' + listTotal().toLocaleString('en-US');
    if (window.I18N) window.I18N.sync();
  }
  function stepList(id, d) {
    var it = state.list.filter(function (x) { return x.id === id; })[0];
    if (!it) return;
    it.qty += d;
    if (it.qty <= 0) state.list = state.list.filter(function (x) { return x.id !== id; });
    renderList();
    renderActionbar();
    renderMe();
  }
  function checkoutList() {
    if (!state.list.length) { toast('选品单是空的'); return; }
    toast('选品单已提交，对接人 1 个工作日内联系');
  }

  function renderAddress() {
    var box = $('addressList');
    if (!box) return;
    box.innerHTML = D.addresses.map(function (a) {
      return '<div class="addr-card">' +
        '<div class="addr-top"><span><span class="addr-name">' + a.name + '</span>' +
        '<span class="addr-phone">' + a.phone + '</span></span>' +
        (a.isDefault ? '<span class="addr-tag">默认</span>' : '') + '</div>' +
        '<p class="addr-text">' + a.region + '<br>' + a.detail + '</p></div>';
    }).join('');
    if (window.I18N) window.I18N.sync();
  }

  function renderInvoice() {
    var f = $('invForm');
    if (!f) return;
    var v = D.invoice;
    var fields = INV.type === 'company'
      ? [['抬头', 'title'], ['税号', 'taxNo'], ['开户行', 'bank'], ['账号', 'account'], ['地址', 'addr'], ['电话', 'phone']]
      : [['抬头', 'title']];
    f.innerHTML = fields.map(function (x) {
      return '<label class="fld"><span class="k">' + x[0] + '</span>' +
        '<input data-inv="' + x[1] + '" value="' + (v[x[1]] || '') + '" /></label>';
    }).join('') +
      '<div style="padding:18px 0"><button class="btn btn--solid" id="invSave" style="width:100%">保存</button></div>';
    Array.prototype.forEach.call(document.querySelectorAll('#invType .seg-btn'), function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-inv-type') === INV.type);
    });
    if (window.I18N) window.I18N.sync();
  }

  function openInfo(kind) {
    var t = $('infoTitle');
    var b = $('infoBody');
    if (!t || !b) return;
    if (kind === 'contact') {
      var c = D.contact;
      t.textContent = '对接人';
      b.innerHTML = '<div class="contact-card"><div class="avatar">' + c.name.charAt(0) + '</div>' +
        '<div><p class="me-name">' + c.name + '</p><p class="me-sub">' + c.role + '</p></div></div>' +
        '<div class="rows"><div class="row"><span class="k">电话</span><span class="v">' + c.phone + '</span></div>' +
        '<div class="row"><span class="k">微信</span><span class="v">' + c.wechat + '</span></div>' +
        '<div class="row"><span class="k">在线</span><span class="v">' + c.hours + '</span></div></div>' +
        '<div class="contact-acts"><button class="btn btn--ghost" data-scene="toast" data-msg="正在拨号（演示）">拨打电话</button>' +
        '<button class="btn btn--solid" data-scene="toast" data-msg="微信号已复制">复制微信</button></div>';
    } else {
      t.textContent = '关于拾礼';
      b.innerHTML = '<p class="about-brand">拾礼 · 企业礼赠服务</p><p class="about-ver">版本 1.0.0（原型）</p>' +
        '<div class="rows" style="margin-top:14px">' +
        '<div class="row" data-scene="toast" data-msg="服务条款（演示）"><span class="k">服务条款</span><span class="v">›</span></div>' +
        '<div class="row" data-scene="toast" data-msg="隐私政策（演示）"><span class="k">隐私政策</span><span class="v">›</span></div></div>';
    }
    $('infoMask').classList.add('is-open');
    $('infoSheet').classList.add('is-open');
    if (window.I18N) window.I18N.sync();
  }
  function closeInfo() {
    $('infoMask').classList.remove('is-open');
    $('infoSheet').classList.remove('is-open');
  }

  /* ---------------- 品牌 ---------------- */
  function brandGroups(list) {
    var map = {};
    list.forEach(function (b) {
      if (!map[b.initial]) map[b.initial] = [];
      map[b.initial].push(b);
    });
    return Object.keys(map).sort().map(function (k) {
      return {
        letter: k,
        items: map[k].sort(function (a, b) { return a.pinyin < b.pinyin ? -1 : 1; })
      };
    });
  }

  function renderBrands(q) {
    var list = $('brandList');
    var rail = $('brandIndex');
    if (!list || !rail) return;

    var term = (q || '').trim().toLowerCase();
    var filtered = D.brands.filter(function (b) {
      if (!term) return true;
      return (b.name + ' ' + b.pinyin + ' ' + b.initial).toLowerCase().indexOf(term) > -1;
    });

    var groups = brandGroups(filtered);
    if (!groups.length) {
      list.innerHTML = '<div class="empty"><p class="empty-title">没有找到匹配的品牌</p><p class="empty-note">试试品牌名或拼音</p></div>';
    } else {
      list.innerHTML = groups.map(function (g) {
        return '<div class="brand-sec" data-letter="' + g.letter + '">' +
          '<p class="brand-letter">' + g.letter + '</p>' +
          '<div class="brand-grid">' + g.items.map(function (b) {
            return '<button class="brand-card" data-brand="' + b.name + '">' +
              '<span class="brand-mono">' + b.name.charAt(0) + '</span>' +
              '<span class="brand-name">' + b.name + '</span></button>';
          }).join('') + '</div></div>';
      }).join('');
    }

    var have = {};
    groups.forEach(function (g) { have[g.letter] = true; });
    rail.innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function (L) {
      return '<button class="bi' + (have[L] ? ' has' : '') + '" data-letter="' + L + '">' + L + '</button>';
    }).join('');

    spyBrands();
  }

  function spyBrands() {
    var screen = screenEl('brands');
    var rail = $('brandIndex');
    if (!screen || !rail) return;
    var y = screen.scrollTop + 80;
    var cur = null;
    Array.prototype.forEach.call(screen.querySelectorAll('.brand-sec'), function (s) {
      if (s.offsetTop <= y) cur = s.getAttribute('data-letter');
    });
    Array.prototype.forEach.call(rail.children, function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-letter') === cur);
    });
  }

  function jumpBrand(L) {
    var screen = screenEl('brands');
    if (!screen) return;
    var sec = screen.querySelector('.brand-sec[data-letter="' + L + '"]');
    if (!sec) return;
    screen.scrollTo({ top: sec.offsetTop - 56, behavior: 'smooth' });
  }

  function setBrand(name) {
    state.brand = name;
    state.query = '';
    state.min = null;
    state.max = null;
    if ($('catalogSearch')) $('catalogSearch').value = '';
    if ($('priceMin')) $('priceMin').value = '';
    if ($('priceMax')) $('priceMax').value = '';
    syncChips();
    renderCatalog('');
    if (current !== 'catalog') go('catalog');
  }

  /* ---------------- 商品图册 ---------------- */
  var G = { count: 4, index: 0, dragging: false, startX: 0, startY: 0, dx: 0, locked: false, width: 0 };

  function updateDots() {
    var box = $('galleryDots');
    if (!box) return;
    if (box.children.length !== G.count) {
      var html = '';
      for (var i = 0; i < G.count; i++) {
        html += '<button class="dot" data-slide="' + i + '" aria-label="' + (i + 1) + '"></button>';
      }
      box.innerHTML = html;
    }
    Array.prototype.forEach.call(box.children, function (d, i) {
      d.classList.toggle('is-on', i === G.index);
    });
  }

  function setSlide(i, animate) {
    var track = $('galleryTrack');
    if (!track) return;
    var w = track.parentNode.clientWidth || 1;
    G.index = Math.max(0, Math.min(G.count - 1, i));
    track.style.transition = animate === false ? 'none' : 'transform .24s cubic-bezier(.22, .61, .36, 1)';
    track.style.transform = 'translate3d(' + (-G.index * w) + 'px, 0, 0)';
    updateDots();
  }

  function initGallery() {
    var track = $('galleryTrack');
    if (!track || track.__wired) return;
    track.__wired = true;

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      G.dragging = true; G.locked = false;
      G.startX = e.clientX; G.startY = e.clientY; G.dx = 0;
      G.width = track.parentNode.clientWidth || 1;
      track.style.transition = 'none';
      try { track.setPointerCapture(e.pointerId); } catch (err) {}
    }, { passive: true });

    track.addEventListener('pointermove', function (e) {
      if (!G.dragging) return;
      var dx = e.clientX - G.startX;
      var dy = e.clientY - G.startY;
      if (!G.locked) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) { G.dragging = false; setSlide(G.index, true); return; }
        G.locked = true;
      }
      if (e.cancelable) e.preventDefault();
      if ((G.index === 0 && dx > 0) || (G.index === G.count - 1 && dx < 0)) dx *= 0.35;
      G.dx = dx;
      track.style.transform = 'translate3d(' + (-G.index * G.width + dx) + 'px, 0, 0)';
    }, { passive: false });

    function end() {
      if (!G.dragging) return;
      G.dragging = false;
      var w = G.width || 1;
      if (G.dx <= -w * 0.25) setSlide(G.index + 1, true);
      else if (G.dx >= w * 0.25) setSlide(G.index - 1, true);
      else setSlide(G.index, true);
    }

    track.addEventListener('pointerup', end);
    track.addEventListener('pointercancel', end);

    var dots = $('galleryDots');
    if (dots) {
      dots.addEventListener('click', function (e) {
        var d = e.target.closest('[data-slide]');
        if (d) setSlide(+d.getAttribute('data-slide'), true);
      });
    }

    window.addEventListener('resize', function () { setSlide(G.index, false); });
  }

  /* ---------------- 商品详情 ---------------- */
  function pb(k, v, main) {
    return '<div class="pb-row' + (main ? ' pb-row--main' : '') + '">' +
      '<span class="k">' + k + '</span><span class="v">' + v + '</span></div>';
  }

  function renderProduct(id) {
    var p = byId(id) || D.products[0];
    state.product = p.id;
    $('pName').textContent = p.name;
    $('pSub').textContent = p.sub;
    $('pCode').textContent = p.code;
    document.querySelectorAll('#galleryTrack use').forEach(function (u) { u.setAttribute('href', '#' + p.icon); });
    document.querySelector('.gallery').style.background = D.tints[p.tint] || 'var(--paper-3)';
    var dw = $('dimW'), dh = $('dimH');
    if (dw) dw.textContent = (p.dims && p.dims[0]) || '—';
    if (dh) dh.textContent = (p.dims && p.dims[1]) || '—';
    setSlide(0, false);

    var block = $('priceBlock');
    var idn = eff();
    var html = pb('参考价', '<b>¥' + p.retail + '</b><span class="unit">/ 件</span>', true);
    if (idn === 'personal') html += pb('含税', '已含增值税', false);
    block.innerHTML = html;

    $('pFacts').innerHTML = p.facts.map(function (f) {
      return '<span class="fact">' + f + '</span>';
    }).join('');

    $('pSpecs').innerHTML = p.specs.map(function (s) {
      return '<div class="spec"><span class="k">' + s[0] + '</span><span class="v">' + s[1] + '</span></div>';
    }).join('');

    renderActionbar();
  }

  function renderActionbar() {
    var bar = $('actionbar');
    var cur = stack[stack.length - 1];
    if (cur === 'redeem') {
      bar.innerHTML = '<button class="btn btn--solid" data-scene="' + (state.preview ? 'blocked' : 'toast') + '" data-msg="兑换成功，预计 48 小时发货">确认兑换</button>';
      bar.classList.add('is-on');
      return;
    }
    if (cur !== 'product') { bar.classList.remove('is-on'); return; }
    var labels = {
      employee: ['加入清单', '立即购买'],
      personal: ['加入购物袋', '立即购买'],
      buyer: ['加入方案', '立即下单']
    }[eff()];
    var blocked = state.preview;
    var idn2 = eff();
    var label = idn2 === 'buyer' ? '加入方案' : '加入选品单';
    bar.innerHTML = blocked
      ? '<button class="btn btn--solid" disabled data-scene="blocked">' + label + '</button>'
      : '<button class="btn btn--solid" data-buy="1">' + label + '</button>';
    bar.classList.add('is-on');
  }

  /* ---------------- 我的 ---------------- */
  function renderMe() {
    var idn = eff();
    var rows = {
      employee: ['我的清单', '收货地址', '发票抬头', '账号与安全', '权益明细', '联系对接人', '关于拾礼'],
      personal: ['我的清单', '收货地址', '发票抬头', '账号与安全', '优惠券', '联系客服', '关于拾礼'],
      buyer: ['我的清单', '企业信息', '开票资料', '账号与安全', '合同与协议', '对接人', '对账中心', '关于拾礼']
    }[idn];

    var ROUTE = {
      '我的清单': 'data-go="list"',
      '收货地址': 'data-go="address"',
      '发票抬头': 'data-go="invoice"',
      '开票资料': 'data-go="invoice"',
      '账号与安全': 'data-auth="phone"',
      '权益明细': 'data-go="wallet"',
      '联系对接人': 'data-info="contact"',
      '对接人': 'data-info="contact"',
      '关于拾礼': 'data-info="about"'
    };
    $('meRows').innerHTML = rows.map(function (r) {
      var attr = ROUTE[r] || ('data-scene="toast" data-msg="' + r + '"');
      var rv = (r === '我的清单' && listCount()) ? (listCount() + ' 件') : '';
      return '<div class="row" ' + attr + '><span class="k">' + r + '</span>' +
        '<span class="v" style="color:var(--ink-3)">' + rv + '<span class="chev">›</span></span></div>';
    }).join('');
    $('meAvatar').textContent = idn === 'buyer' ? '明' : '林';
  }

  /* ---------------- 屏幕切换 ---------------- */
  var ANIM_MS = 380;
  var current = 'home';
  var pending = null;
  var animTimer = null;

  function screenEl(n) { return document.querySelector('[data-screen="' + n + '"]'); }

  function tabIndex(n) {
    var list = TABS[eff()] || TABS.employee;
    for (var i = 0; i < list.length; i++) { if (list[i].id === n) return i; }
    return -1;
  }

  function settle() {
    clearTimeout(animTimer);
    animTimer = null;
    document.getElementById('phone').classList.remove('is-animating');
    if (!pending) return;
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.remove('anim-in-right', 'anim-in-left', 'anim-out-left', 'anim-out-right');
      s.classList.toggle('is-active', s === pending);
    });
    current = pending.getAttribute('data-screen');
    pending = null;
  }

  function show(name, dir) {
    var to = screenEl(name);
    if (!to) return;
    settle();

    var from = screenEl(current);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var forward = dir !== 'back';

    if (from && from !== to && !reduce) {
      to.classList.add('is-active');
      to.scrollTop = 0;
      void to.offsetWidth;
      to.classList.add(forward ? 'anim-in-right' : 'anim-in-left');
      from.classList.add(forward ? 'anim-out-left' : 'anim-out-right');
      pending = to;
      current = name;
      document.getElementById('phone').classList.add('is-animating');
      animTimer = setTimeout(settle, ANIM_MS);
    } else {
      document.querySelectorAll('.screen').forEach(function (s) {
        s.classList.remove('anim-in-right', 'anim-in-left', 'anim-out-left', 'anim-out-right');
        s.classList.toggle('is-active', s === to);
      });
      to.scrollTop = 0;
      current = name;
    }

    if (name === 'category') renderCat();
    if (name === 'brands') renderBrands($('brandSearch') ? $('brandSearch').value : '');
    if (name === 'list') renderList();
    if (name === 'address') renderAddress();
    if (name === 'invoice') renderInvoice();
    if (name === 'product') setSlide(G.index, false);

    var dock = $('tabbar');
    if (dock) dock.classList.toggle('is-hidden', name === 'product' || name === 'redeem');

    var wallet = document.querySelector('[data-screen="wallet"]');
    if (wallet) wallet.classList.toggle('is-personal', eff() === 'personal');

    renderTabs();
    renderActionbar();
    syncRail(name);
    if (window.I18N) window.I18N.sync();
  }

  function go(name) { stack.push(name); show(name); }
  function back() { if (stack.length > 1) stack.pop(); show(stack[stack.length - 1], 'back'); }

  function syncRail(name) {
    var target = (name === 'home' && state.preview) ? 'preview' : name;
    $('railList').querySelectorAll('button').forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-rail') === target);
    });
  }

  /* ---------------- 身份切换 ---------------- */
  function openSheet() { renderSheet(); $('mask').classList.add('is-open'); $('sheet').classList.add('is-open'); }
  function closeSheet() { $('mask').classList.remove('is-open'); $('sheet').classList.remove('is-open'); }

  function renderSheet() {
    $('sheetList').innerHTML = D.identities.map(function (it) {
      var on = it.id === state.identity && !state.preview;
      return '<button class="idcard' + (on ? ' is-on' : '') + '" data-identity="' + it.id + '">' +
        '<span><span class="in">' + it.label + '</span><span class="idesc" style="display:block">' + it.desc + '</span></span>' +
        '<span class="mark">' + (on ? '✓' : '') + '</span></button>';
    }).join('');
    $('previewBtn').textContent = state.preview ? '关闭' : '开启';
    if (state.identity === 'employee' && !state.preview) {
      $('sheetList').insertAdjacentHTML('beforeend', '<button class="auth-request" data-auth="apply"><span>申请采购权限</span><span>›</span></button>');
    }
  }

  function applyIdentity(id) {
    state.identity = id;
    state.preview = false;
    document.getElementById('phone').classList.remove('is-previewing');
    renderIdentity();
    renderWalletCards();
    renderGrids();
    renderMe();
    renderProduct(state.product);
  }

  function setIdentity(id) {
    applyIdentity(id);
    stack = [TABS[id][0].id];
    show(stack[0]);
    closeSheet();
  }

  function setPreview(on) {
    state.preview = on;
    document.getElementById('phone').classList.toggle('is-previewing', on);
    renderIdentity();
    renderWalletCards();
    renderGrids();
    renderMe();
    renderProduct(state.product);
    if (on) { stack = ['home']; show('home'); }
    else { stack = ['workbench']; show('workbench'); }
    closeSheet();
    toast(on ? '已进入客户视角预览' : '已退出预览');
  }

  /* ---------------- 提示 ---------------- */
  var toastTimer = null;
  function toast(msg, act, fn) {
    if (!msg) return;
    var t = $('toast');
    t.innerHTML = act ? '<span>' + msg + '</span><span class="toast-act">' + act + ' ›</span>' : msg;
    t.classList.toggle('has-act', !!act);
    t.__fn = fn || null;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, act ? 3200 : 1800);
  }

  function priceSource() {
    return { employee: '额度价', buyer: '协议价', personal: '零售价' }[eff()];
  }

  /* ---------------- 侧栏 ---------------- */
  function renderRail() {
    $('railList').innerHTML = RAIL.map(function (r) {
      return '<li><button data-rail="' + r[0] + '">' + r[1] + '</button></li>';
    }).join('');
  }

  /* ---------------- 微信登录 ---------------- */
  function setAuthView(v) {
    document.querySelectorAll('#authSheet .auth-view').forEach(function (el) {
      el.hidden = el.getAttribute('data-view') !== v;
    });
  }

  function openAuth(v) {
    closeSheet();
    setAuthView(v || 'phone');
    $('authMask').classList.add('is-open');
    $('authSheet').classList.add('is-open');
  }

  function closeAuth() {
    $('authMask').classList.remove('is-open');
    $('authSheet').classList.remove('is-open');
  }

  /* ---------------- 专题翻面 ---------------- */
  var flipTimer = null;
  var flipHold = 0;

  function setFlip(back) {
    var el = $('homeFlip');
    if (!el) return;
    var inner = document.querySelector('#homeFlip .flip-inner');
    if (inner) {
      inner.style.transition = 'transform .55s cubic-bezier(.2, .7, .2, 1)';
      inner.style.transform = 'rotateY(' + (back ? 180 : 0) + 'deg)';
      inner.style.willChange = '';
    }
    el.classList.toggle('is-back', back);
    Array.prototype.forEach.call(el.querySelectorAll('.fdot'), function (d, i) {
      d.classList.toggle('is-on', (i === 1) === back);
    });
  }


  var FD = { on: false, x0: 0, y0: 0, dx: 0, lock: false, t0: 0 };

  function flipEl() { return document.querySelector('#homeFlip .flip-inner'); }
  function flipBase(card) { return card.classList.contains('is-back') ? 180 : 0; }

  function flipPress(e) {
    var card = e.currentTarget;
    if (e.target.closest('[data-go], .fdot')) return;
    var inner = flipEl();
    if (!inner) return;
    FD.on = true; FD.lock = false; FD.dx = 0;
    FD.x0 = e.clientX; FD.y0 = e.clientY; FD.t0 = Date.now();
    inner.style.transition = 'none';
    inner.style.transform = 'rotateY(' + flipBase(card) + 'deg)';
    try { card.setPointerCapture(e.pointerId); } catch (err) {}
  }

  function flipMove(e) {
    if (!FD.on) return;
    var dx = e.clientX - FD.x0;
    var dy = e.clientY - FD.y0;
    if (!FD.lock) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) { FD.on = false; setFlip(e.currentTarget.classList.contains('is-back')); return; }
      FD.lock = true;
      var inner = flipEl();
      if (inner) inner.style.willChange = 'transform';
    }
    if (e.cancelable) e.preventDefault();
    FD.dx = dx;
    var card = e.currentTarget;
    var w = card.clientWidth || 1;
    var el = flipEl();
    if (el) el.style.transform = 'rotateY(' + (flipBase(card) + (dx / w) * 180) + 'deg)';
  }

  function flipRelease(e) {
    if (!FD.on) return;
    FD.on = false;
    var card = e.currentTarget;
    var w = card.clientWidth || 1;
    var dt = Date.now() - FD.t0;
    var isBack = card.classList.contains('is-back');

    if (Math.abs(FD.dx) < 8 && dt < 260) {
      setFlip(!isBack);
    } else {
      var ok = Math.abs(FD.dx) > w * 0.22 || Math.abs(FD.dx / Math.max(dt, 1)) > 0.4;
      setFlip(ok ? !isBack : isBack);
    }
    flipHold = Date.now() + 10000;
  }

  function initFlip() {
    var card = $('homeFlip');
    if (!card || card.__wired) return;
    card.__wired = true;
    card.style.touchAction = 'pan-y';
    card.addEventListener('pointerdown', flipPress, { passive: true });
    card.addEventListener('pointermove', flipMove, { passive: false });
    card.addEventListener('pointerup', flipRelease);
    card.addEventListener('pointercancel', flipRelease);
  }

  function startFlip() {
    if (flipTimer) clearInterval(flipTimer);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    flipTimer = setInterval(function () {
      if (Date.now() < flipHold) return;
      var el = $('homeFlip');
      if (!el) return;
      setFlip(!el.classList.contains('is-back'));
    }, 4000);
  }

  /* ---------------- 购买 ---------------- */
  var BUY = { qty: 1, unit: 0 };

  function unitPrice(p) {
    return p.retail;
  }

  function openBuy() {
    var p = byId(state.product) || D.products[0];
    BUY.unit = unitPrice(p);
    BUY.qty = 1;
    $('buyName').textContent = p.name;
    document.querySelector('#buySheet .buy-thumb use').setAttribute('href', '#' + p.icon);
    $('buyPrice').innerHTML = '¥' + BUY.unit + '<span class="unit">/ 件</span>' +
      (BUY.unit !== p.retail ? '<s>¥' + p.retail + '</s>' : '');
    $('buyQty').value = '1';
    $('buyConfirm').textContent = eff() === 'buyer' ? '加入方案' : '加入选品单';
    updateBuy();
    $('buyMask').classList.add('is-open');
    $('buySheet').classList.add('is-open');
    if (window.I18N) window.I18N.sync();
  }

  function closeBuy() {
    $('buyMask').classList.remove('is-open');
    $('buySheet').classList.remove('is-open');
  }

  function updateBuy() {
    var sum = BUY.unit * BUY.qty;
    $('buySum').textContent = '¥' + sum.toLocaleString('en-US');
  }

  function submitBuy() {
    var p = byId(state.product) || D.products[0];
    addToList(p, BUY.qty);
    closeBuy();
    toast('已加入选品单');
  }

  /* ---------------- 事件 ---------------- */
  var taps = 0, tapTimer = null;

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-go],[data-tab],[data-product],[data-add],[data-back],[data-copy],[data-scene],[data-identity],[data-rail],[data-sheet],[data-auth],[data-search-entry],[data-price-go],[data-price-clear],[data-cat],[data-letter],[data-brand],[data-brand-clear],[data-buy],[data-order-status],[data-add-list],[data-list-step],[data-list-remove],[data-info],[data-inv-type]');
    if (!el) return;

    if (el.hasAttribute('data-letter')) { jumpBrand(el.getAttribute('data-letter')); return; }
    if (el.hasAttribute('data-brand')) { setBrand(el.getAttribute('data-brand')); return; }
    if (el.hasAttribute('data-brand-clear')) { state.brand = null; renderCatalog(state.query); return; }
    if (el.hasAttribute('data-cat')) { catIndex = Number(el.getAttribute('data-cat')); renderCat(); if (window.I18N) window.I18N.sync(); return; }
    if (el.hasAttribute('data-add-list')) { var bp2 = byId(state.product); if (bp2) addToList(bp2); return; }
    if (el.hasAttribute('data-list-step')) { stepList(el.getAttribute('data-id'), Number(el.getAttribute('data-list-step'))); return; }
    if (el.hasAttribute('data-list-remove')) { state.list = state.list.filter(function (x) { return x.id !== el.getAttribute('data-list-remove'); }); renderList(); renderActionbar(); renderMe(); return; }
    if (el.hasAttribute('data-info')) { openInfo(el.getAttribute('data-info')); return; }
    if (el.hasAttribute('data-inv-type')) { INV.type = el.getAttribute('data-inv-type'); renderInvoice(); return; }
    if (el.hasAttribute('data-buy')) { openBuy(); return; }
    if (el.hasAttribute('data-price-go')) { applyPrice(); return; }
    if (el.hasAttribute('data-price-clear')) { clearPrice(); return; }
    if (el.hasAttribute('data-search-entry')) {
      go('catalog');
      setTimeout(function () { var si = $('catalogSearch'); if (si) si.focus(); }, 420);
      return;
    }
    if (el.hasAttribute('data-tab')) {
      var next = el.getAttribute('data-tab');
      var ai = tabIndex(current), bi = tabIndex(next);
      stack = [next];
      show(next, (ai > -1 && bi > -1 && bi < ai) ? 'back' : 'forward');
      return;
    }
    if (el.hasAttribute('data-go')) { go(el.getAttribute('data-go')); return; }
    if (el.hasAttribute('data-product')) { renderProduct(el.getAttribute('data-product')); go('product'); return; }
    if (el.hasAttribute('data-add')) {
      state.plan += 1;
      $('planCount').textContent = state.plan;
      toast((window.I18N ? I18N.t('已加入方案') : '已加入方案') + ' · ' + state.plan);
      return;
    }
    if (el.hasAttribute('data-back')) { back(); return; }
    if (el.hasAttribute('data-copy')) { toast('编号已复制'); return; }
    if (el.hasAttribute('data-auth')) {
      var act = el.getAttribute('data-auth');
      if (act === 'phone' || act === 'code' || act === 'apply') { openAuth(act); return; }
      if (act === 'grant' || act === 'bindcode') { setAuthView('loading'); setTimeout(function () { setAuthView('found'); }, 900); return; }
      if (act === 'start') { closeAuth(); setIdentity('employee'); toast('已绑定明德银行'); return; }
      if (act === 'submit') { closeAuth(); toast('申请已提交，等待企业管理员审批'); return; }
    }
    if (el.hasAttribute('data-sheet')) { openSheet(); return; }
    if (el.hasAttribute('data-identity')) { setIdentity(el.getAttribute('data-identity')); return; }

    if (el.hasAttribute('data-rail')) {
      var r = el.getAttribute('data-rail');
      if (r === 'preview') { setPreview(true); return; }
      if (RAIL_ROLE[r]) applyIdentity(RAIL_ROLE[r]);
      var ra = tabIndex(current), rb = tabIndex(r);
      stack = [r];
      show(r, (ra > -1 && rb > -1 && rb < ra) ? 'back' : 'forward');
      return;
    }

    if (el.hasAttribute('data-scene')) {
      var kind = el.getAttribute('data-scene');
      if (kind === 'blocked') { toast('预览态已禁用此操作'); return; }
      if (kind === 'preview') { setPreview(true); return; }
      toast(el.getAttribute('data-msg') || '');
      return;
    }
  });

  $('identityBtn').addEventListener('click', function () {
    taps += 1;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(function () { taps = 0; }, 900);
    if (taps >= 3) {
      taps = 0;
      closeSheet();
      toast('调试 · ' + state.identity + ' / ' + stack[stack.length - 1] + ' / ' + priceSource());
      return;
    }
    openSheet();
  });

  var bBtn = $('identityBtnB');
  if (bBtn) bBtn.addEventListener('click', openSheet);

  var lb = $('langBtn');
  if (lb) lb.addEventListener('click', function (ev) {
    var s = ev.target.closest('[data-lang]');
    window.I18N.set(s ? s.getAttribute('data-lang') : (window.I18N.lang() === 'zh' ? 'en' : 'zh'));
  });

  var csearch = $('catalogSearch');
  if (csearch) {
    csearch.addEventListener('input', function () {
      state.query = this.value;
      renderCatalog(state.query);
      if (window.I18N) window.I18N.sync();
    });
  }

  ['priceMin', 'priceMax'].forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener('keydown', function (e) { if (e.key === 'Enter') applyPrice(); });
  });

  document.addEventListener('click', function (e) {
    var dot = e.target.closest('.fdot');
    if (dot) { setFlip(dot.getAttribute('data-flip') === '1'); flipHold = Date.now() + 10000; return; }

  });

  $('mask').addEventListener('click', closeSheet);
  $('authMask').addEventListener('click', closeAuth);
  var bsearch = $('brandSearch');
  if (bsearch) {
    bsearch.addEventListener('input', function () {
      renderBrands(this.value);
      if (window.I18N) window.I18N.sync();
    });
  }

  document.addEventListener('click', function (e) {
    var st = e.target.closest('[data-step]');
    if (!st) return;
    BUY.qty = Math.max(1, Math.min(999, BUY.qty + Number(st.getAttribute('data-step'))));
    $('buyQty').value = BUY.qty;
    updateBuy();
  });

  if ($('buyMask')) $('buyMask').addEventListener('click', closeBuy);
  if ($('buyClose')) $('buyClose').addEventListener('click', closeBuy);
  if ($('buyConfirm')) $('buyConfirm').addEventListener('click', submitBuy);
  if ($('buyQty')) {
    $('buyQty').addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '');
      var v = parseInt(this.value, 10);
      if (!isNaN(v)) { BUY.qty = Math.max(1, Math.min(999, v)); updateBuy(); }
    });
    $('buyQty').addEventListener('blur', function () { this.value = BUY.qty; });
  }
  if ($('buyPhone')) $('buyPhone').addEventListener('input', function () { this.value = this.value.replace(/[^0-9]/g, ''); });

    if ($('listCheckout')) $('listCheckout').addEventListener('click', checkoutList);
  if ($('infoMask')) $('infoMask').addEventListener('click', closeInfo);
  if ($('toast')) $('toast').addEventListener('click', function () {
    if (!this.__fn) return;
    var f = this.__fn; this.__fn = null; this.classList.remove('is-on'); f();
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#invSave')) return;
    Array.prototype.forEach.call(document.querySelectorAll('[data-inv]'), function (el) {
      D.invoice[el.getAttribute('data-inv')] = el.value;
    });
    toast('已保存');
  });

  $('previewBtn').addEventListener('click', function () { setPreview(!state.preview); });
  $('exitPreview').addEventListener('click', function () { setPreview(false); });

  document.addEventListener('click', function (e) {
    var st = e.target.closest('.sort');
    if (st) {
      st.parentNode.querySelectorAll('.sort').forEach(function (x) { x.classList.remove('is-on'); });
      st.classList.add('is-on');
      return;
    }
    var chip = e.target.closest('.chip');
    if (!chip) return;
    chip.parentNode.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-on'); });
    chip.classList.add('is-on');
    if (chip.parentNode.id === 'budgetChips') {
      var cmin = chip.getAttribute('data-min');
      var cmax = chip.getAttribute('data-max');
      state.min = cmin === '' || cmin === null ? null : Number(cmin);
      state.max = cmax === '' || cmax === null ? null : Number(cmax);
      if ($('priceMin')) $('priceMin').value = state.min === null ? '' : state.min;
      if ($('priceMax')) $('priceMax').value = state.max === null ? '' : state.max;
      renderCatalog(state.query);
    }
    if (chip.parentNode.id === 'homeBudget') {
      var hmin = chip.getAttribute('data-min');
      var hmax = chip.getAttribute('data-max');
      state.min = hmin === '' || hmin === null ? null : Number(hmin);
      state.max = hmax === '' || hmax === null ? null : Number(hmax);
      if ($('priceMin')) $('priceMin').value = state.min === null ? '' : state.min;
      if ($('priceMax')) $('priceMax').value = state.max === null ? '' : state.max;
      syncChips();
      renderCatalog(state.query);
      if (current !== 'catalog') go('catalog');
    }
  });

  /* ---------------- 启动 ---------------- */
  renderRail();
  renderIdentity();
  renderWalletCards();
  renderGrids();
  renderMe();
  syncChips();
  renderCat();
  renderBrands();
  renderList();
  renderAddress();
  renderInvoice();
  initGallery();
  initFlip();
  startFlip();
  var bs = screenEl('brands');
  if (bs && !bs.__spy) { bs.__spy = true; bs.addEventListener('scroll', spyBrands); }
  renderProduct('cup');
  show('home');
  if (window.I18N) window.I18N.sync();
})();
