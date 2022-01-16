import React, { useEffect, useState } from "react"
import { Form, Select, Button, message } from "antd"
import Domain from "../Models/Domain"
import nameof from "../Utils/nameof"
import { useForm } from "antd/lib/form/Form"
import { AssignRolePayload, UsersAdminWebAPI } from "../WebAPIs/UsersWebAPI"
import Role from "../Models/Role"
import { RolesWebAPI } from "../WebAPIs/RolesWebAPI"
import { DomainWebAPI } from "../WebAPIs/DomainWebAPI"

const { Option } = Select


const AssignRoleEditor:React.FC<{OnSubmit?:(payload:AssignRolePayload)=>void}>= 
({OnSubmit})=>
{
    const [form] = useForm()
    const [userIds, setUserIds] = useState<string[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [domains, setDomains] = useState<Domain[]>([])

    const [selectedRoles,setSelectedRoles] = useState<Role[]>([])
    const [loading,setLoading] = useState<boolean>(false)

    useEffect(()=>{FetchData()},[])
    return (
        <Form form={form} 
            autoComplete='off'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            onFinish={async values=>{
                try{
                    setLoading(true)
                    await UsersAdminWebAPI.AssignRoles([values as AssignRolePayload])
                    await FetchData();
                    OnSubmit?.(values as AssignRolePayload)
                    message.success("Assigned successfully",2)
                }catch(err){ message.error((err as any).message,2)}
                finally{setLoading(false)}
            }}
        >
            <Form.Item label={nameof<AssignRolePayload>("DomainName")}
                name={nameof<AssignRolePayload>("DomainName")}
                rules={[{ required: true }]}
            >
                <Select showSearch disabled={loading}
                    onChange={value => 
                    {
                        form.setFieldsValue({ "DomainName": value })
                        const targetRoles = roles.filter(role=>role.DomainName===value)
                        setSelectedRoles([...targetRoles])

                    }}>
                    {
                        domains.map(domain => <Option value={domain.Name}
                            key={domain.Name}>{domain.Name}</Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item label="Role Name"
                name={nameof<AssignRolePayload>("Name")}
                rules={[{ required: true }]}
            >
                <Select showSearch disabled={loading}
                    onChange={value => form.setFieldsValue({ "Name": value })}>
                    {
                        selectedRoles.map(role => <Option value={role.Name}
                            key={role.Name}>{role.Name}</Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item label="User Id"
                name={nameof<AssignRolePayload>("UserId")}
                rules={[{ required: true }]}
            >
                <Select showSearch disabled={loading}
                    onChange={value => form.setFieldsValue({ "UserId": value })}>
                    {
                        userIds.map(userId=> <Option value={userId}
                            key={userId}>{userId}</Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                    <Button type="primary" htmlType="submit" disabled={loading}>
                        Submit
                    </Button>
                </Form.Item>
        </Form>
    )

    async function FetchData()
    {
        try{
        setLoading(true)
        setUserIds([...await UsersAdminWebAPI.GetUserId()])
        setRoles([...await RolesWebAPI.GetAll()])
        setDomains([...await DomainWebAPI.GetAll()])
        }catch(err){message.error((err as any).message,2)}
        finally{setLoading(false)}
    }
}

export default AssignRoleEditor