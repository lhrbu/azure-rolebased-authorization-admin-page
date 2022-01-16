import ContactInformation from "./ContactInformation";
import Role from "./Role";

export default interface User
{
    UserId:string
    EncodedPassword:string,
    ContactInformation?:ContactInformation
    Roles?:Role[]
}