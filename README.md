# AI Frontend

一个用于练习前后端联调的 Vue 3 前端项目。页面提供按用户 ID 查询用户信息的功能，通过 Axios 调用 FastAPI 后端（默认 `http://localhost:8000`）的 `GET /users/{user_id}` 接口，并以「字段名：值」的形式展示查询结果。

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
| 路由 | Vue Router（已安装，尚未接入） |
| 代码检查 | ESLint 10 + oxlint |
| 开发插件 | vite-plugin-vue-devtools |
| 包管理器 | npm |
| Node 版本 | `^22.18.0` 或 `>=24.12.0` |

## 功能

- **用户查询**：输入用户 ID 后调用后端 `GET /users/{user_id}`，成功后渲染返回对象的所有字段。
- **交互状态**：查询期间按钮禁用并显示「查询中...」；输入为空时提示「请输入用户 ID」；支持回车键触发查询。
- **错误处理**：优先展示后端返回的 `detail` 字段（FastAPI `HTTPException` 的格式），其次 `err.message`，最后回退为「查询失败」。
- **请求封装**：`src/api/http.js` 创建统一的 Axios 实例，`baseURL` 读取环境变量 `VITE_API_BASE_URL`，超时 10 秒。
- **开发体验**：Vite 热更新、Vue DevTools、`@` 别名指向 `src/`、oxlint + ESLint 双检查。

## 目录结构

```text
AI-frontend/
├── src/
│   ├── api/
│   │   ├── http.js              # Axios 实例：baseURL 来自环境变量，超时 10 秒
│   │   └── users.js             # 用户接口：getUserById
│   ├── components/
│   │   └── UserSearch.vue       # 用户查询组件（输入、加载、错误、结果展示）
│   ├── App.vue                  # 根组件
│   └── main.js                  # 应用入口：创建并挂载 Vue 应用
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

前端当前只调用一个接口：

| Method | Endpoint | 功能 | 认证 |
| --- | --- | --- | --- |
| GET | `/users/{user_id}` | 查询用户详情 | 当前前端未携带 |

- 请求地址为 `VITE_API_BASE_URL` + `/users/{user_id}`，例如 <http://localhost:8000/users/1>。
- 成功时将 `response.data` 直接渲染为字段列表；FastAPI 的 `UserResponse` 返回 `id` / `name` / `age`。
- 用户不存在时后端返回 404，页面展示响应中的 `detail`（如「未找到用户」）。
- 跨域：FastAPI-week2 已通过 CORS 允许 `http://localhost:5173` 与 `http://127.0.0.1:5173` 访问。

> **⚠️ 认证注意**：FastAPI-week2 的 `/users` 路由整体挂载了 `get_current_user` 依赖，`GET /users/{user_id}` 需要请求头 `Authorization: Bearer <token>`。当前前端没有登录流程，Axios 也没有添加认证头，直接对接会返回 **401**。联调前需二选一：
>
> 1. 后端临时移除该接口的认证依赖；
> 2. 前端补充登录（`POST /auth/login`），并在 Axios 请求拦截器中统一携带 token。

### 请求示例

```bash
# 后端需已启动
curl http://127.0.0.1:8000/users/1
```

## 待办 / 已知问题

- [ ] 接入登录流程并为请求携带 JWT，解决 `/users/{user_id}` 的 401。
- [ ] `vue-router` 已在依赖中安装，但 `src/main.js` 尚未注册路由，目前为单页应用。
- [ ] 尚未配置单元测试或端到端测试。
