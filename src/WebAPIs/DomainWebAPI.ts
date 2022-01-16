import Domain from "../Models/Domain"
import AdminWebAPI from "./AdminWebAPI"
import WebAPI from "./WebAPI"


type DomainWebAPIMethods = "/api/domains/getall" | "/api/domains/get/" 
type DomainAdminWebAPIMethods = "/api/domains/add" | "/api/domains/delete/"

export const DomainWebAPI = {
    GetAll:async() => (await WebAPI.get(<DomainWebAPIMethods>"/api/domains/getall")).data as Domain[],
    Get:async(domainName:string)=>{
        const url = `${<DomainWebAPIMethods>"/api/domains/get/"}${encodeURI(domainName)}`
        return (await WebAPI.get(url)).data as Domain
    }
}

export const DomainAdminWebAPI = {
    Add: async(domain:Domain)=>await AdminWebAPI.Get().post(<DomainAdminWebAPIMethods>"/api/domains/add",domain),
    Delete:async(domainName:string) => {
        const url = `${<DomainAdminWebAPIMethods>"/api/domains/delete/"}${encodeURI(domainName)}`
        await AdminWebAPI.Get().delete(url)
    }
}