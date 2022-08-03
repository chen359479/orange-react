export default {
    pw:[
        { required: true, min: 6, message: '请输入最少6位密码', trigger: 'blur' },
        { pattern: /^[0-9a-zA-Z]*$/g, message: '密码由最少6位为数字或小写字母或大写字母组成' }
    ],
    phone:[
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern:/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: "请输入合法手机号/电话号", trigger: "blur" }
    ],
    username:[
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' },
        { pattern: /^[0-9a-zA-Z]*$/g, message: '用户名为数字，小写字母，大写字母' }
    ],
    title:[
        { required: true, message: '请输入标题名称', trigger: 'blur' },
        { min: 5, max: 40, message: '长度在 5 到 40 个字符', trigger: 'blur' }
    ],
    viewPath: [
        { required: true, message: '请输入菜单路径', trigger: 'blur' },
        { min: 2, max: 42, message: '长度在 2 到 42 个字符', trigger: 'blur' },
        { pattern: /^\/[0-9a-zA-Z\/]*$/g, message: '菜单路径以/开头后接数字、小写字母、大写字母' }
    ],
    // 组件名称的验证
    name :[
        { required: true, message: '请输入组件名称', trigger: 'blur' },
        { min: 2, max: 42, message: '长度在 2 到 42 个字符', trigger: 'blur' },
        { pattern: /^[0-9a-zA-Z]*$/g, message: '组件名称为数字，小写字母，大写字母' }
    ],
    // 菜单名称
    viewTitle:[
        { required: true, message: '请输入菜单名称', trigger: 'blur' },
        { min: 2, max: 42, message: '长度在 2 到 42 个字符', trigger: 'blur' },
    ]

}
