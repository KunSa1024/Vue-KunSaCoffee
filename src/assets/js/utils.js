import { Toast } from 'vant'; // Toast:　轻提示

class Utils {

    // 验证表单
    validForm(o) {
        // 验证表单的数据, object
        for (let key in o) {
            if (!o[key].reg.test(o[key].value)) {
                // 显示提示错误
                Toast({
                    message: o[key].errorMsg,
                    position: 'bottom',
                    duration: 3000,
                    forbidClick: true
                });
                return false;
            }
        }
        // 表单验证通过
        return true;
    }
}

// 传送
export const utils = new Utils();