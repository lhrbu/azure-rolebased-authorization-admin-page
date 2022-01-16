import Role from "../Models/Role"
import WebAPI from "./WebAPI"
import AdminWebAPI from "./AdminWebAPI"
import SensitiveData from "../Models/SensitiveData"

type RolesWebAPIMethods = "/api/roles/getall" | "/api/roles/queryrolesofuser" | "/api/roles/queryrolesofuserindomain/" 
type RolesAdminWebAPIMethods = "/api/roles/add" | "/api/roles/delete" | "/api/roles/update" 

export const RolesWebAPI ={
    GetAll:async() => (await WebAPI.get(<RolesWebAPIMethods>"/api/roles/getall")).data as Role[],
    QueryRolesOfUser:async(sensitiveData:SensitiveData)=>await WebAPI.post(<RolesWebAPIMethods>"/api/roles/queryrolesofuser",sensitiveData),
    QueryRolesOfUserInDomain:async(sensitiveData:SensitiveData,domainName:string) =>
        {
            const url = `${<RolesWebAPIMethods>"/api/roles/queryrolesofuserindomain/"}${encodeURI(domainName)}`
            return await WebAPI.post(url,sensitiveData)
        }
}

export const RolesAdminWebAPI = {
    Add:async(role:Role)=>await AdminWebAPI.Get().post(<RolesAdminWebAPIMethods>"/api/roles/add",role),
    Delete:async(role:Role)=>await AdminWebAPI.Get().post(<RolesAdminWebAPIMethods>"/api/roles/delete",role),
    Update:async(role:Role)=>await AdminWebAPI.Get().put(<RolesAdminWebAPIMethods>"/api/roles/update",role),
}