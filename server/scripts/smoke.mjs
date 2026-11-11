/* 接口冒烟：node scripts/smoke.mjs [baseUrl] [opsToken] */
const base = (process.argv[2] || 'http://127.0.0.1:3000').replace(/\/$/, '');
const opsToken = process.argv[3] || process.env.OPS_TOKEN || '';

let failed = 0;

async function call(method, path, { token, body, ops } = {}) {
  const res = await fetch(base + path, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(ops ? { 'x-ops-token': ops } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

function check(name, ok, detail) {
  if (ok) {
    console.log(`  ok   ${name}`);
  } else {
    failed++;
    console.log(`  FAIL ${name}${detail ? ' — ' + JSON.stringify(detail) : ''}`);
  }
}

const health = await call('GET', '/api/health');
check('health', health.status === 200 && health.data.ok === true, health);

const catalog = await call('GET', '/api/products');
check('products 8 条', catalog.status === 200 && catalog.data.items.length === 8, catalog.data.total);

const filtered = await call('GET', '/api/products?category=drink&max=300');
check('筛选 杯壶 ≤300', filtered.status === 200 && filtered.data.items.every((p) => p.retail <= 300), filtered.data.items?.length);

const login = await call('POST', '/api/auth/wx-login', { body: { code: 'demo' } });
check('登录', login.status === 200 && !!login.data.token, login.data);
const token = login.data.token;

const me = await call('GET', '/api/auth/me', { token });
check('身份列表', me.status === 200 && me.data.memberships.length === 3, me.data);

const profile = await call('GET', '/api/profile', { token });
check('资料聚合', profile.status === 200 && profile.data.addresses.length >= 2, profile.status);

const created = await call('POST', '/api/selections', {
  token,
  body: { items: [{ productId: 'cup', qty: 2 }, { productId: 'tea', qty: 1 }], note: '冒烟测试' }
});
check('提交选品单', created.status === 201 && created.data.total === 168 * 2 + 268, created.data);

const list = await call('GET', '/api/selections', { token });
check('选品记录', list.status === 200 && list.data.items.length >= 1, list.data.stats);

if (opsToken) {
  const admin = await call('GET', '/api/admin/selections', { ops: opsToken });
  check('管理端列表', admin.status === 200 && admin.data.items.length >= 1, admin.status);
  if (created.status === 201) {
    const patched = await call('PATCH', `/api/admin/selections/${created.data.id}`, { ops: opsToken, body: { status: 'quoted' } });
    check('改状态 quoted', patched.status === 200 && patched.data.status === 'quoted', patched.data.status);
  }
}

console.log(failed ? `\n${failed} 项失败` : '\n全部通过');
process.exit(failed ? 1 : 0);
