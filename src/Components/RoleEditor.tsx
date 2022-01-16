import React, { useEffect, useState } from "react"
import { Form, Select, Input, InputNumber, Button, Skeleton, message } from "antd"
import { useForm } from "antd/lib/form/Form"
import nameof from "../Utils/nameof"
import Role from "../Models/Role"
import Domain from "../Models/Domain"
import { DomainWebAPI } from "../WebAPIs/DomainWebAPI"

const { Option } = Select

const RoleEditor: React.FC<{ Role?:Role,OnSubmit?: (role: Role) => void }> =
    ({ Role,OnSubmit }) =>
    {
        const [form] = useForm()
        const [domains, setDomains] = useState<Domain[]>([])
        const [loading,setLoading]=useState<boolean>(true)
        useEffect(()=>{
            FetchData()
        },[])
        useEffect(()=>{
            if(Role){
                form.setFieldsValue({...Role})
            }
        },[Role])
        if(loading){return <Skeleton active/>}
        
        return (
            <Form form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                onFinish={values => OnSubmit?.(values as Role)}
            >
                <Form.Item label={nameof<Role>("DomainName")}
                    name={nameof<Role>("DomainName")}
                    rules={[{ required: true }]}
                >
                    <Select showSearch
                        onChange={value => form.setFieldsValue({ "DomainName": value })}>
                        {
                            domains.map(domain => <Option value={domain.Name}
                                key={domain.Name}>{domain.Name}</Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item label={nameof<Role>("Name")}
                    name={nameof<Role>("Name")}
                    rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={nameof<Role>("ReadLevel")}
                    name={nameof<Role>("ReadLevel")}
                    rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item label={nameof<Role>("WriteLevel")}
                    name={nameof<Role>("WriteLevel")}
                    rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        )

        async function FetchData()
        {
            setLoading(true)
                try{ setDomains([...await DomainWebAPI.GetAll()]) }
                catch(err){message.error((err as any).message)}
                finally{setLoading(false)}
        }
    }

export default RoleEditor