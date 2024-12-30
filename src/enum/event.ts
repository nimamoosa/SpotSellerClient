export enum Events {
  TOKEN_FOR_UPLOAD_FILE = "authorization_with:upload_file",
  UPLOAD_FILE = "uploadFile",
  CREATE_COURSE = "createCourse",
  EDIT_COURSE = "editCourse",
  DELETE_FILE = "deleteFile",
  GET_AUTH = "getAuth",
  GET_LICENSE = "getAllLicense",
  GET_PAYMENT = "getClientPayment",
  SIGNUP_USERS = "registeredUsers",
  REGISTER = "register",
}

export enum ReceiverEvents {
  TOKEN_FOR_UPLOAD_FILE = "authorizationEventReceiver",
  UPLOAD_FILE = "uploadFileEventReceiver",
  CREATE_COURSE = "createCourseEventReceiver",
  EDIT_COURSE = "editCourseEventReceiver",
  DELETE_FILE = "deleteFileEventReceiver",
  GET_AUTH = "getAuthEventReceiver",
  GET_LICENSE = "getAllLicenseEventReceiver",
  GET_PAYMENT = "getClientPaymentEventReceiver",
  SIGNUP_USERS = "registeredUsersEventReceiver",
}

export enum OnMethod {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
}
