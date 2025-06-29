// 子菜单
export default {
	framework: {
		'menu_100' : {
			icon: 'profile',
			title: '通信',
			pageName: 'FrameworkSocketIpc',
			params: {}
		},
		'menu_101' : {
			icon: 'profile',
			title: 'http服务',
			pageName: 'FrameworkSocketHttpServer',
			params: {}
		},
		'menu_102' : {
			icon: 'profile',
			title: 'socket服务',
			pageName: 'FrameworkSocketSocketServer',
			params: {}
		},
		'menu_104' : {
			icon: 'profile',
			title: 'sqlite数据库',
			pageName: 'FrameworkSqliteDBIndex',
			params: {}
		},
		'menu_105' : {
			icon: 'profile',
			title: '任务',
			pageName: 'FrameworkJobsIndex',
			params: {}
		},
		'menu_106' : {
			icon: 'profile',
			title: '软件调用',
			pageName: 'FrameworkSoftwareIndex',
			params: {}
		},
    'menu_107' : {
			icon: 'profile',
			title: '自动更新',
			pageName: 'FrameworkUpdaterIndex',
			params: {}
		},
	},
  os: {
    'menu_100' : {
        icon: 'profile',
        title: '文件',
        pageName: 'OsFileIndex',
        params: {}
    },
    'menu_102' : {
        icon: 'profile',
        title: '窗口',
        pageName: 'OsWindowIndex',
        params: {}
    },
    'menu_103' : {
        icon: 'profile',
        title: '桌面通知',
        pageName: 'OsNotificationIndex',
        params: {}
    },
    'menu_110' : {
        icon: 'profile',
        title: '图片',
        pageName: 'OsFilePic',
        params: {}
    },
  },
  effect: {
    'menu_100' : {
      icon: 'profile',
      title: '登录',
      pageName: 'EffectLoginIndex',
      params: {}
    }
  },
  cross: {
    'menu_100' : {
      icon: 'profile',
      title: 'go服务',
      pageName: 'CrossGoIndex',
      params: {}
    },
    'menu_110' : {
      icon: 'profile',
      title: 'java服务',
      pageName: 'CrossJavaIndex',
      params: {}
    },
    'menu_120' : {
      icon: 'profile',
      title: 'python服务',
      pageName: 'CrossPythonIndex',
      params: {}
    },
  },
  pinoutConfig: {
    'menu_100' : {
      icon: 'setting',
      title: '引脚模式及配置',
      pageName: 'PinoutConfigMode',
      params: {}
    },
    'menu_110' : {
      icon: 'setting',
      title: '配置信息',
      pageName: 'PinoutConfigConfig',
      params: {}
    },
  },
  clockConfig: {
    'menu_100' : {
      icon: 'clock-circle',
      title: '时钟配置',
      pageName: 'ClockConfigClock',
      params: {}
    },
    'menu_110' : {
      icon: 'setting',
      title: '时钟设置',
      pageName: 'ClockConfigSetting',
      params: {}
    },
  },
  projectManager: {
    'menu_100' : {
      icon: 'project',
      title: '项目管理',
      pageName: 'ProjectManagerProject',
      params: {}
    },
    'menu_110' : {
      icon: 'code',
      title: '代码生成',
      pageName: 'ProjectManagerCodeGen',
      params: {}
    },
    'menu_120' : {
      icon: 'setting',
      title: '高级设置',
      pageName: 'ProjectManagerAdvanced',
      params: {}
    },
  },
  tools: {
    'menu_100' : {
      icon: 'tool',
      title: 'PCC工具',
      pageName: 'ToolsPCC',
      params: {}
    },
    'menu_110' : {
      icon: 'tool',
      title: 'CAD工具',
      pageName: 'ToolsCAD',
      params: {}
    },
  },
}
