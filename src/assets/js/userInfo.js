export  default {
    userInfo:{},
    token:"",
    userJit: [  // 用户权限
        {
            label: "超级管理员",
            value: "superAdmin"
        },{
            label: "管理员",
            value: "admin"
        },{
            label: "用户",
            value: "user"
        },
    ],
    userState: [  // 用户状态
        {
            label: "启用",
            value: 1
        }, {
            label: "锁定",
            value: 2
        }, {
            label: "销户",
            value: 3
        },
    ]
}
