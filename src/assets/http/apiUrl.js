/* 全局定义接口url */

// 表格模拟数据
const SystemData = `/manager/system/getSystemList`;
// host头，这里我们要使用代理，所以定义的字符串apiReplace是用来进行反向代理时的标记字符串。
const apiHost = '/manager/auth/'
// 密码登录
const Login = `/manager/auth/login`
// 短信登录
const LoginByVin = `/manager/auth/loginByVin`
// 发送短信
// const SendSms = `/manager/auth/sendSms`
const SendSms = `/manager/auth/code`
// 表格模拟数据
const GetPermissionData = `/manager/auth/permission`
// 表格模拟数据
const GetTableData = `/apiReplace/table`

// const UploadImage = "/api/manager/member/avatar"

const UploadWorkStationImage = "/api/member_house/work_stations/uploadWorkStationAvatar"

const ServerUrl = "http://192.168.1.46:8082";
// const ServerUrl = "https://www.yarenda.cn";

const UploadNewsImage = ServerUrl+ "/api/manager/news/upload_image";
const UploadNotificationImage = ServerUrl + "/api/manager/news/upload_image";
//办理单位上传办理流程和办理结果图片
const UploadUnitImage = ServerUrl + "/api/suggestion_deal/unit_suggestion/image";

const ExportOpinion = ServerUrl + "/api/member_house/opinion/exportOpinion";
const ExportSuggestion = ServerUrl + "/api/member_house/suggestion/exportSuggestion";
const ExportPerformance = ServerUrl + "/api/member_house/performance/exportPerformance";
const ExportSuggestionCount = ServerUrl + "/api/member_house/suggestion/exportSuggestionCount";
const ExportPerformanceCount = ServerUrl + "/api/member_house/performance/exportPerformanceCount";

const UploadAvatar = ServerUrl + "/api/manager/upload";
const UploadImage = ServerUrl + "/api/manager/upload/uploadPic";

export default {
    SystemData,
    Login,
    LoginByVin,
    SendSms,
    GetPermissionData,
    GetTableData,
    UploadImage,
    UploadAvatar,
    UploadWorkStationImage,
    ServerUrl,
    UploadNewsImage,
    UploadNotificationImage,
    UploadUnitImage,
    ExportOpinion,
    ExportSuggestion,
    ExportPerformance,
    ExportSuggestionCount,
    ExportPerformanceCount,
}
