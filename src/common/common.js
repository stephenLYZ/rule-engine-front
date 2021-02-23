import * as common from '@/common/common'
import Clipboard from 'clipboard';
import ElementUI from "element-ui";

export default common

export function getSymbolExplanation(name) {
  switch (name) {
    case "EQ":
      return "等于";
    case "NE":
      return "不等于";
    case "GT":
      return "大于";
    case "LT":
      return "小于";
    case "GE":
      return "大于等于";
    case "LE":
      return "小于等于";
    case "CONTAIN":
      return "包含";
    case "NOT_CONTAIN":
      return "不包含";
    case "IN":
      return "在";
    case "NOT_IN":
      return "不在";
    case "STARTS_WITH":
      return "以..开始";
    case "ENDS_WITH":
      return "以..结束";
  }
}

export function getSymbolByValueType(valueType) {
  switch (valueType) {
    case "STRING":
      return [{"explanation": "等于", "name": "EQ", "symbol": "=="}, {
        "explanation": "不等于",
        "name": "NE",
        "symbol": "!="
      }, {"explanation": "包含", "name": "CONTAIN", "symbol": "contain"}, {
        "explanation": "以..结束",
        "name": "ENDS_WITH",
        "symbol": "ends with"
      }, {"explanation": "以..开始", "name": "STARTS_WITH", "symbol": "starts with"}];
    case "BOOLEAN":
      return [{"explanation": "等于", "name": "EQ", "symbol": "=="}, {
        "explanation": "不等于",
        "name": "NE",
        "symbol": "!="
      }];
    case "NUMBER":
      return [{"explanation": "大于", "name": "GT", "symbol": ">"}, {
        "explanation": "小于",
        "name": "LT",
        "symbol": "<"
      }, {"explanation": "等于", "name": "EQ", "symbol": "=="}, {
        "explanation": "不等于",
        "name": "NE",
        "symbol": "!="
      }, {"explanation": "大于等于", "name": "GE", "symbol": ">="}, {
        "explanation": "小于等于",
        "name": "LE",
        "symbol": "<="
      }];
    case "COLLECTION":
      return [{"explanation": "等于", "name": "EQ", "symbol": "=="}, {
        "explanation": "在",
        "name": "IN",
        "symbol": "in"
      }, {"explanation": "不在", "name": "NOT_IN", "symbol": "not in"}, {
        "explanation": "包含",
        "name": "CONTAIN",
        "symbol": "contain"
      }, {"explanation": "不包含", "name": "NOT_CONTAIN", "symbol": "not contain"}];
    case "DATE":
      return [{"explanation": "大于", "name": "GT", "symbol": ">"}, {
        "explanation": "小于",
        "name": "LT",
        "symbol": "<"
      }, {"explanation": "等于", "name": "EQ", "symbol": "=="}, {
        "explanation": "不等于",
        "name": "NE",
        "symbol": "!="
      }, {"explanation": "大于等于", "name": "GE", "symbol": ">="}, {
        "explanation": "小于等于",
        "name": "LE",
        "symbol": "<="
      }];
  }
}

export function datePickerOptions() {
  return {
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date());
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
      }
    }]
  }
}

export function copy(e, code) {
  const clipboard = new Clipboard(e.target, {
    // 点击copy按钮，直接通过text直接返回复印的内容
    text: () => code
  });
  clipboard.on('success', (e) => {
    ElementUI.Message({
      message: '复制成功',
      type: 'success'
    });
    clipboard.off('error');
    clipboard.off('success');
    clipboard.destroy()
  });
  clipboard.on('error', (e) => {
    console.log(e);
    ElementUI.Message({
      message: '该浏览器不支持此方式复制',
      type: 'success'
    });
    clipboard.off('error');
    clipboard.off('success');
    clipboard.destroy()
  });
  clipboard.onClick(e)
}
