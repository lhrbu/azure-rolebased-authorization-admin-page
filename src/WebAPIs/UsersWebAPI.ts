import SensitiveData from "../Models/SensitiveData"
import AdminWebAPI from "./AdminWebAPI"
import WebAPI from "./WebAPI"

type UsersWebAPI = "/api/users/add" | "/api/users/updatepassword"
type UsersAdminWebAPI = "/api/users/assignroles" | "/api/users/delete/" | "/api/users/getuserids"
export interface UpdatePasswordPayload
{
    UserId:string
    EncodedPassword:string
    NewEncodedPassword:string
}

export interface AssignRolePayload
{
    UserId:string
    DomainName:string
    Name:string
}

export const UsersWebAPI = {
    Add: async(sensitiveData:SensitiveData)=>await WebAPI.post(<UsersWebAPI>"/api/users/add",sensitiveData),
    UpdatePassword: async(payload:UpdatePasswordPayload)=>await WebAPI.put(<UsersWebAPI>"/api/users/updatepassword",payload)
}

export const UsersAdminWebAPI = {
    AssignRoles:async(payload:AssignRolePayload[])=>await AdminWebAPI.Get().put(<UsersAdminWebAPI>"/api/users/assignroles",payload),
    Delete:async(userId:string)=>{
        const url = `${<UsersAdminWebAPI>"/api/roles-delete/"}${encodeURI(userId)}}`
        await AdminWebAPI.Get().delete(url)
    },
    GetUserId:async()=>(await AdminWebAPI.Get().get(<UsersAdminWebAPI>"/api/users/getuserids")).data as string[]
}