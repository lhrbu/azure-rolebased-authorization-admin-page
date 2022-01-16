import { Form, Input, Button,Switch, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import AdminWebAPI  from "../WebAPIs/AdminWebAPI"

export default function AdminPage()
{
    const [form] = useForm()
    const [tokenAssigned,setTokenAssigned]=useState<boolean>(false)
    useEffect(()=>{
        setTokenAssigned(AdminWebAPI.HasAccessToken())
    },[])

    return (
        <Form form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            onFinish={values=>{
                AdminWebAPI.SetAccessToken(values.Base64AccessToken);
                setTokenAssigned(AdminWebAPI.HasAccessToken())
                message.success("set access token successfully!",2)
            }}
        >
            <Form.Item
                label="Base64 Access Token"
                name="Base64AccessToken"
                rules={[{ required: true}]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="Token Assigned">
                <Switch checked={tokenAssigned}/>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                <Button type="primary" danger style={{marginLeft:"12px"}} 
                    onClick={()=>{
                        AdminWebAPI.RemoveAccessToken()
                        setTokenAssigned(AdminWebAPI.HasAccessToken())
                        }}>
                    Expire Token
                </Button>
            </Form.Item>
        </Form>
    )
}