export default {
    require:[
        { required: true, message: '此项必填', trigger: [ 'blur' , 'change' ] }
    ],
    requiredNumber :[
        { required: true, message: '此项必填！', type:'number', trigger: ['change', 'blur'] }
    ],
    requiredObj :[
        { required: true, message: '此项必填！', type:'object', trigger: ['change', 'blur'] }
    ],
    requiredArr :[ {  type: 'array', required: true, message: '此项必填！', trigger: ['change', 'blur'] } ],
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
    ],
    // 发动机号
    engineNumber: [ { required: true, message: '请输入正确的发动机号',pattern:new RegExp(/^[A-Za-z0-9]{17}$/, "g")} ],
    // 车架号
    vinReg: [{ required: true, message: '请输入正确的车架号',pattern:new RegExp(/^[A-HJ-NPR-Z0-9]{17}$/, "g")}],
    // 身份证号
    idNumber:[ { required: true, message: '请输入正确的身份证号',pattern:new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, "g")}],
}
