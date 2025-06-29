/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  {
    path: '/microcontroller-select',
    name: 'MicrocontrollerSelect',
    component: () => import('@/views/microcontroller/Select.vue')
  },
  {
    path: '/microcontroller/choose',
    name: 'McuChoose',
    component: () => import('@/views/mcuChoose/index.vue')
  },
  {
    path: '/test-layout',
    name: 'TestLayout',
    component: () => import('@/views/microcontroller/TestLayout.vue')
  },
  {
    path: '/',
    component: () => import('@/layouts/AppSider.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/framework',
        name: 'Framework',
        component: () => import('@/layouts/Menu.vue'),
        props: { id: 'framework' },
        //props: true,
        redirect: { name: 'FrameworkSocketIpc' },
        children: [
          {
            path: '/framework/socket/ipc',
            name: 'FrameworkSocketIpc',
            component: () => import('@/views/framework/socket/Ipc.vue')
          },
          {
            path: '/framework/socket/httpserver',
            name: 'FrameworkSocketHttpServer',
            component: () => import('@/views/framework/socket/HttpServer.vue')
          },
          {
            path: '/framework/socket/socketserver',
            name: 'FrameworkSocketSocketServer',
            component: () => import('@/views/framework/socket/SocketServer.vue')
          },
          {
            path: '/framework/sqlitedb/index',
            name: 'FrameworkSqliteDBIndex',
            component: () => import('@/views/framework/sqlitedb/Index.vue')
          },
          {
            path: '/framework/jobs/index',
            name: 'FrameworkJobsIndex',
            component: () => import('@/views/framework/jobs/Index.vue')
          },
          {
            path: '/framework/software/index',
            name: 'FrameworkSoftwareIndex',
            component: () => import('@/views/framework/software/Index.vue')
          },
          {
            path: '/framework/updater/index',
            name: 'FrameworkUpdaterIndex',
            component: () => import('@/views/framework/updater/Index.vue')
          },
        ]
      },
      {
        path: '/os',
        name: 'Os',
        component: () => import('@/layouts/Menu.vue'),
        props: { id: 'os' },
        redirect: { name: 'OsFileIndex' },
        children: [
          {
            path: '/os/file/index',
            name: 'OsFileIndex',
            component: () => import('@/views/os/file/Index.vue')
          },
          {
            path: '/os/file/pic',
            name: 'OsFilePic',
            component: () => import('@/views/os/file/Pic.vue')
          },
          {
            path: '/os/window/index',
            name: 'OsWindowIndex',
            component: () => import('@/views/os/window/Index.vue')
          },
          {
            path: '/os/notification/index',
            name: 'OsNotificationIndex',
            component: () => import('@/views/os/notification/Index.vue')
          }
        ]
      },
      {
        path: '/effect',
        name: 'Effect',
        component: () => import('@/layouts/Menu.vue'),
        props: { id: 'effect' },
        redirect: { name: 'EffectLoginIndex' },
        children: [
          {
            path: '/effect/login/index',
            name: 'EffectLoginIndex',
            component: () => import('@/views/effect/login/Index.vue')
          }
        ]
      },
      {
        path: '/cross',
        name: 'Cross',
        component: () => import('@/layouts/Menu.vue'),
        props: { id: 'cross' },
        redirect: { name: 'CrossGoIndex' },
        children: [
          {
            path: '/cross/go/index',
            name: 'CrossGoIndex',
            component: () => import('@/views/cross/go/Index.vue')
          },
          {
            path: '/cross/java/index',
            name: 'CrossJavaIndex',
            component: () => import('@/views/cross/java/Index.vue')
          },
          {
            path: '/cross/python/index',
            name: 'CrossPythonIndex',
            component: () => import('@/views/cross/python/Index.vue')
          },
        ]
      },
      {
        path: '/pinoutConfig',
        name: 'PinoutConfig',
        component: () => import('@/layouts/Menu.vue'),
        props: { id: 'pinoutConfig' },
        redirect: { name: 'PinoutConfigMode' },
        children: [
          {
            path: '/pinoutConfig/mode',
            name: 'PinoutConfigMode',
            component: () => import('@/views/pinoutConfig/Mode.vue')
          },
          {
            path: '/pinoutConfig/config',
            name: 'PinoutConfigConfig',
            component: () => import('@/views/pinoutConfig/Config.vue')
          },
        ]
      },
      {
        path: '/clockConfig',
        name: 'ClockConfig',
        component: () => import('@/layouts/Menu.vue'),
        props: { id: 'clockConfig' },
        redirect: { name: 'ClockConfigClock' },
        children: [
          {
            path: '/clockConfig/clock',
            name: 'ClockConfigClock',
            component: () => import('@/views/clockConfig/Clock.vue')
          },
          {
            path: '/clockConfig/setting',
            name: 'ClockConfigSetting',
            component: () => import('@/views/clockConfig/Setting.vue')
          },
        ]
      },
      {
        path: '/projectManager',
        name: 'ProjectManager',
        component: () => import('@/layouts/Menu.vue'),
        props: { id: 'projectManager' },
        redirect: { name: 'ProjectManagerProject' },
        children: [
          {
            path: '/projectManager/project',
            name: 'ProjectManagerProject',
            component: () => import('@/views/projectManager/Project.vue')
          },
          {
            path: '/projectManager/codegen',
            name: 'ProjectManagerCodeGen',
            component: () => import('@/views/projectManager/CodeGen.vue')
          },
          {
            path: '/projectManager/advanced',
            name: 'ProjectManagerAdvanced',
            component: () => import('@/views/projectManager/Advanced.vue')
          },
        ]
      },
      {
        path: '/tools',
        name: 'Tools',
        component: () => import('@/layouts/Menu.vue'),
        props: { id: 'tools' },
        redirect: { name: 'ToolsPCC' },
        children: [
          {
            path: '/tools/pcc',
            name: 'ToolsPCC',
            component: () => import('@/views/tools/PCC.vue')
          },
          {
            path: '/tools/cad',
            name: 'ToolsCAD',
            component: () => import('@/views/tools/CAD.vue')
          },
        ]
      },
    ]
  },
  {
    path: '/special',
    children: [
      {
        path: 'subwindow',
        name: 'SpecialSubwindowIpc',
        component: () => import('@/views/os/subwindow/Ipc.vue')
      },
      {
        path: '/login',
        name: 'SpecialLoginWindow',
        component: () => import('@/views/effect/login/Window.vue')
      },
    ]
  },
]

export default constantRouterMap
