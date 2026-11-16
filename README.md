# AI Frontend

一个用于练习前后端联调与登录鉴权的 Vue 3 前端项目。通过 Axios 调用 FastAPI 后端（默认 `http://localhost:8000`），提供用户注册、表单登录、JWT 携带、路由守卫和个人中心页面。

- 应用入口：`src/main.js`
- 开发地址：<http://localhost:5173>
- 后端项目：[FastAPI-week2](https://github.com/kokozzzzzz/fastapi-week2)（需单独启动，默认 `http://localhost:8000`）

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 语言 | JavaScript |
| 框架 | Vue 3（Composition API / `<script setup>`） |
| 构建工具 | Vite 8 |
| HTTP 客户端 | Axios 1.x |
| 路由 | Vue Router 5（history 模式 + 全局守卫） |
| 代码检查 | ESLint 10 + oxlint |
| 开发插件 | vite-plugin-vue-devtools |
| 包管理器 | npm |
| Node 版本 | `^22.18.0` 或 `>=24.12.0` |

## 功能

- **用户注册**：`/register` 提交用户名、密码、确认密码与年龄；校验用户名非空、年龄 ≥ 1、密码至少 6 位、两次密码一致。成功后提示并跳转登录页；后端 422 校验错误会提取 `detail` 数组第一条展示。
- **用户登录**：`/login` 以 `application/x-www-form-urlencoded` 提交 `username` / `password`，成功后读取 `access_token` 写入 `localStorage` 并跳转 `/profile`；登录接口自身的 401 只在页面内展示错误，不触发全局跳转。
- **路由守卫**：`src/router/index.js` 通过路由的 `requiresAuth` / `guestOnly` 元信息结合 `localStorage` 中的 token 控制访问。
- **JWT 携带**：`src/api/http.js` 的请求拦截器在存在 token 时自动附加 `Authorization: Bearer <token>`。
- **401 统一处理**：响应拦截器捕获非登录接口的 401，清除本地登录状态并派发 `auth:expired` 事件，`src/main.js` 监听后跳转 `/login`。
- **个人中心**：`/profile` 挂载时调用 `GET /auth/me`，逐字段展示当前登录用户；「退出登录」清除 token 并返回登录页。
- **请求封装**：`src/api/http.js` 创建统一的 Axios 实例，`baseURL` 读取环境变量 `VITE_API_BASE_URL`，超时 10 秒。
- **开发体验**：Vite 热更新、Vue DevTools、`@` 别名指向 `src/`、oxlint + ESLint 双检查。

## 页面路由

| 路径 | 页面 | 访问控制 |
| --- | --- | --- |
| `/` | 重定向到 `/profile` | — |
| `/login` | `src/views/LoginView.vue` | 已登录时跳转 `/profile` |
| `/register` | `src/views/RegisterView.vue` | 已登录时跳转 `/profile` |
| `/profile` | `src/views/ProfileView.vue` | 未登录时跳转 `/login` |

## 目录结构

```text
AI-frontend/
├── src/
│   ├── api/
│   │   ├── http.js              # Axios 实例：环境变量 baseURL、10 秒超时、鉴权与 401 拦截器
│   │   ├── auth.js              # 认证接口：registerUser / loginUser / getCurrentUser
│   │   └── users.js             # 用户接口：getUserById（当前未挂载到页面）
│   ├── components/
│   │   └── UserSearch.vue       # 用户查询组件（App.vue 中已注释，暂未使用）
│   ├── router/
│   │   └── index.js             # 路由表与登录守卫
│   ├── utils/
│   │   └── auth.js              # 登录状态：token / currentUser / setToken / setUser / clearAuth
│   ├── views/
│   │   ├── LoginView.vue        # 登录页
│   │   ├── RegisterView.vue     # 注册页
│   │   └── ProfileView.vue      # 个人中心
│   ├── App.vue                  # 根组件：渲染 RouterView
│   └── main.js                  # 应用入口：注册路由、监听 auth:expired
│
├── public/
│   └── favicon.ico              # 站点图标
│
├── dist/                        # 构建产物（npm run build 生成，已加入 .gitignore）
├── index.html                   # HTML 入口
├── vite.config.js               # Vite 配置：Vue 插件、DevTools、@ 别名
├── jsconfig.json                # 编辑器路径提示：@ → ./src
├── eslint.config.js             # ESLint 配置
├── .oxlintrc.json               # oxlint 配置
├── .env.development             # 开发环境变量
├── .editorconfig                # 编辑器格式约定
├── .vscode/
│   └── extensions.json          # 推荐插件：Volar、ESLint、EditorConfig、oxc
├── package.json
└── README.md
```

## 环境配置

### 1. 环境要求

- Node.js `^22.18.0` 或 `>=24.12.0`
- npm
- Git
- 已启动的 FastAPI 后端（默认 <http://localhost:8000>）

### 2. 克隆项目并安装依赖

```bash
git clone https://github.com/kokozzzzzz/AI-frontend.git
cd AI-frontend
npm install
```

### 3. 配置环境变量

开发环境变量在 `.env.development` 中：

```env
VITE_API_BASE_URL=http://localhost:8000
```

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 是 | 后端 API 基础地址。缺失时 Axios 的 `baseURL` 为 `undefined`，请求会发往前端自身的域名 |

> **说明**：Vite 只会把 `VITE_` 前缀的变量注入客户端，且变量在启动时读取，修改后需重启 `npm run dev`。`npm run build` 不会读取 `.env.development`，部署到其他环境时需另外创建 `.env.production`。

## 运行方式

```bash
npm run dev
```

默认监听 <http://localhost:5173>，修改代码后自动热更新。

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器（热更新） |
| `npm run build` | 构建生产版本到 `dist/` |
| `npm run preview` | 本地预览构建产物 |
| `npm run lint` | 依次运行 oxlint 与 ESLint（均带 `--fix`，ESLint 缓存写入 `.eslintcache`） |

> **提示**：`vite.config.js` 中的 `@` 别名指向 `src/`，`jsconfig.json` 提供对应的编辑器路径提示；两者需保持一致。

## 后端对接

前端当前调用的接口：

| Method | Endpoint | 功能 | 认证 |
| --- | --- | --- | --- |
| POST | `/auth/register` | 注册新用户 | 否 |
| POST | `/auth/login` | 表单登录，返回 JWT | 否 |
| GET | `/auth/me` | 查询当前登录用户 | Bearer token |
| GET | `/users/{user_id}` | 查询用户详情 | Bearer token（当前前端未挂载该页面） |

- 登录请求体为 `application/x-www-form-urlencoded`（字段 `username` / `password`），对应 FastAPI 的 `OAuth2PasswordRequestForm`；前端从响应中读取 `access_token`。
- 注册请求体为 JSON：`{ "name": "...", "password": "...", "age": 20 }`。
- 请求地址为 `VITE_API_BASE_URL` + 接口路径，例如 <http://localhost:8000/auth/me>。
- 个人中心将 `GET /auth/me` 的 `response.data` 直接渲染为字段列表。
- 跨域：FastAPI-week2 已通过 CORS 允许 `http://localhost:5173` 与 `http://127.0.0.1:5173` 访问。

> **登录态说明**：token 保存在 `localStorage` 的 `access_token` 键中，路由守卫直接读取该键判断登录状态；`src/utils/auth.js` 中的 `token` ref 只在模块加载时初始化一次。

### 请求示例

```bash
# 后端需已启动；先登录获取 token
curl -X POST http://127.0.0.1:8000/auth/login \
  -d "username=demo&password=123456"

# 携带 token 查询当前用户
curl http://127.0.0.1:8000/auth/me \
  -H "Authorization: Bearer <token>"
```

## 待办 / 已知问题

- [ ] `src/api/users.js` 与 `src/components/UserSearch.vue` 仍保留，但 `App.vue` 已改为只渲染 `RouterView`，暂未接入路由，后续决定删除或改为独立页面。
- [ ] token 过期只依赖后端 401 被动退出，尚未解析 JWT 的 `exp` 做主动检查。
- [ ] 注册成功使用原生 `alert` 提示，可替换为页面内提示。
- [ ] 尚未配置单元测试或端到端测试。
