const user = (state, actions) => {
    //判断state是否存在，如果不存在返回默认值
    if (!state) {
        return {
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
    }

    if(actions.type === "SET_USER_INFO"){
        return {
            ...state,
            userInfo: actions.userInfo
        }
    }else if (actions.type === "SET_TOKEN"){
        return {
            ...state,
            token:actions.token
        }
    }

    return state;
}

export default user;
