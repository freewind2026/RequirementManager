# 需求管理系统

一个基于Django + React的需求管理系统，支持用户管理、项目管理、项目组管理、资源管理（需求、设计、代码）以及变更跟踪功能。

## 技术栈

### 后端
- Python 3.11+
- Django 5.0+
- Django REST Framework
- Django REST Framework SimpleJWT
- MySQL 8.0+

### 前端
- React 18+
- TypeScript
- TailwindCSS 3+
- Vite 5+
- Zustand
- Lucide React

## 项目结构

```
RequirementManager/
├── backend/                    # Django后端
│   ├── api/                    # API应用
│   │   ├── migrations/         # 数据库迁移
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py           # 数据库模型
│   │   ├── serializers.py      # 序列化器
│   │   ├── urls.py             # API路由
│   │   └── views.py            # 视图逻辑
│   ├── requirement_manager/    # 项目配置
│   │   ├── __init__.py
│   │   ├── settings.py         # 设置文件
│   │   ├── urls.py             # 根路由
│   │   └── wsgi.py
│   └── manage.py               # Django管理命令
├── frontend/                   # React前端
│   ├── src/
│   │   ├── api/                # API调用
│   │   ├── components/         # 组件
│   │   ├── pages/              # 页面
│   │   ├── store/              # 状态管理
│   │   ├── App.tsx             # 应用入口
│   │   ├── main.tsx            # 主入口
│   │   └── index.css           # 全局样式
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
├── .trae/documents/            # 项目文档
│   ├── prd.md                 # 产品需求文档
│   └── technical-architecture.md  # 技术架构文档
└── README.md
```

## 快速开始

### 1. 环境要求

- Python 3.11+
- Node.js 20+
- MySQL 8.0+

### 2. 后端配置

```bash
# 进入后端目录
cd backend

# 安装依赖
pip install django djangorestframework djangorestframework-simplejwt mysqlclient django-cors-headers

# 配置数据库
# 修改 requirement_manager/settings.py 中的数据库配置

# 创建数据库表
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 启动后端服务
python manage.py runserver 0.0.0.0:8000
```

### 3. 前端配置

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 4. 访问应用

- 前端地址: http://localhost:5173
- 后端API: http://localhost:8000/api/
- Django管理后台: http://localhost:8000/admin/

## API接口

### 认证接口
| 方法 | 接口 | 描述 |
|------|------|------|
| POST | /api/auth/login/ | 用户登录 |
| POST | /api/auth/register/ | 用户注册 |

### 用户管理
| 方法 | 接口 | 描述 |
|------|------|------|
| GET | /api/users/ | 获取用户列表 |
| GET | /api/users/:id/ | 获取用户详情 |
| POST | /api/users/ | 创建用户 |
| PUT | /api/users/:id/ | 更新用户 |
| DELETE | /api/users/:id/ | 删除用户 |

### 项目管理
| 方法 | 接口 | 描述 |
|------|------|------|
| GET | /api/projects/ | 获取项目列表 |
| GET | /api/projects/:id/ | 获取项目详情 |
| POST | /api/projects/ | 创建项目 |
| PUT | /api/projects/:id/ | 更新项目 |
| DELETE | /api/projects/:id/ | 删除项目 |

### 项目组管理
| 方法 | 接口 | 描述 |
|------|------|------|
| GET | /api/project-groups/ | 获取项目组列表 |
| GET | /api/project-groups/:id/ | 获取项目组详情 |
| POST | /api/project-groups/ | 创建项目组 |
| PUT | /api/project-groups/:id/ | 更新项目组 |
| DELETE | /api/project-groups/:id/ | 删除项目组 |
| POST | /api/project-groups/:id/members/ | 添加成员 |
| DELETE | /api/project-groups/:id/members/:userId/ | 移除成员 |

### 资源管理
| 方法 | 接口 | 描述 |
|------|------|------|
| GET | /api/requirements/ | 获取需求列表 |
| POST | /api/requirements/ | 创建需求 |
| PUT | /api/requirements/:id/ | 更新需求 |
| DELETE | /api/requirements/:id/ | 删除需求 |
| GET | /api/designs/ | 获取设计列表 |
| POST | /api/designs/ | 创建设计 |
| PUT | /api/designs/:id/ | 更新设计 |
| DELETE | /api/designs/:id/ | 删除设计 |
| GET | /api/codes/ | 获取代码列表 |
| POST | /api/codes/ | 创建代码记录 |
| PUT | /api/codes/:id/ | 更新代码记录 |
| DELETE | /api/codes/:id/ | 删除代码记录 |

### 变更历史
| 方法 | 接口 | 描述 |
|------|------|------|
| GET | /api/changes/ | 获取变更列表 |
| GET | /api/changes/:id/ | 获取变更详情 |

## 默认账户

```
邮箱: admin@example.com
密码: password
```

## 功能特性

- ✅ 用户管理（注册、登录、角色管理）
- ✅ 项目管理（创建、编辑、删除项目）
- ✅ 项目组管理（创建组、添加/移除成员）
- ✅ 需求管理（看板视图、优先级、状态流转）
- ✅ 设计文档管理（内容、附件）
- ✅ 代码管理（分支、提交记录）
- ✅ 变更跟踪（历史记录、变更对比）
- ✅ 仪表盘（统计概览、图表展示）
