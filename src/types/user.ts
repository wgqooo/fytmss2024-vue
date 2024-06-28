
export interface User {
    id: Number;
    empNo:string
    empName: string;
    empSex:string;
    empMobile: string;
    empBirthday:Date
    empAddress:string;
    roleName: string;
    enabled:number;
    //state:string
}

export interface Register {
    username: string;
    password: string;
    email: string;
}