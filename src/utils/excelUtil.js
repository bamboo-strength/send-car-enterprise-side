import XLSX from 'xlsx';
import {message} from "antd";
import {importExcelData} from '../services/SaleSpecialConfServices';
import Func from "./Func";

function importExcel(file,isshow){

   // 获取上传的文件对象
  const { files } = file.target;
  // 通过FileReader对象读取文件
  const fileReader = new FileReader();
  fileReader.onload = event => {
    try {
      const { result } = event.target;
      // 以二进制流方式读取得到整份excel表格对象
      const workbook = XLSX.read(result, { type: 'binary' });
      let data = []; // 存储获取到的数据
      // 遍历每张工作表进行读取（这里默认只读取第一张表）
      for (const sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          // 利用 sheet_to_json 方法将 excel 转成 json 数据
          data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          break; // 如果只取第一张表，就取消注释这行
        }
      }
      console.log(data);// excel数据
      importExcelData({params:data}).then(
        (res)=>{
          // console.log(res);
          if (res.success){
            message.success("导入完毕!");
            if (Func.notEmpty(isshow)) {
              isshow(1)
            }
          } else {
            message.error(`导入异常`);
            if (Func.notEmpty(isshow)) {
              isshow(1)
            }
          }
        }
      );
    } catch (e) {
      console.log('文件类型不正确');
    }
  };
  // 以二进制方式打开文件
  fileReader.readAsBinaryString(files[0]);
}
export default {importExcel};
