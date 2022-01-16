import { Form, Input, message, Button,Tabs, Card, Empty, Col, Row, Skeleton, Tag,  } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import SensitiveData from '../Models/SensitiveData';
import nameof from '../Utils/nameof';
import md5 from 'md5'
import { UsersAdminWebAPI, UsersWebAPI } from '../WebAPIs/UsersWebAPI';
import Modal from 'antd/lib/modal/Modal';
import AssignRoleEditor from '../Components/AssignRoleEditor';
import { CloseOutlined } from '@ant-design/icons';
import { RolesAdminWebAPI } from '../WebAPIs/RolesWebAPI';

export default function UsersPage()
{
    const [uploading, setUploading] = useState<boolean>(false)
    const [userIds,setUserIds] = useState<string[]>([])
    const [modalVisible,setModalVisible] = useState<boolean>(false)

    useEffect(()=>{
        FetchData()
    },[]    )

    return (
        <Fragment>
            <div className='Mauve page-title'>Users Admin</div>
            <Form autoComplete='off' autoSave='off'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                onFinish={async values =>
                {
                    if (values.Password !== values.ConfirmPassword)
                    { message.error("Password doesn't match", 2) }
                    else
                    {
                        try
                        {
                            setUploading(true)
                            const sensitiveData: SensitiveData =
                            {
                                UserId: values.UserId,
                                EncodedPassword: md5(values.Password)
                            }
                            await UsersWebAPI.Add(sensitiveData)
                            message.success("Added Successfully", 2)
                        } catch (err)
                        {
                            message.error((err as any).message, 2)
                        } finally
                        {
                            setUploading(false)
                        }

                    }
                }}
            >
                <Form.Item
                    label={nameof<SensitiveData>("UserId")}
                    name={nameof<SensitiveData>("UserId")}
                    rules={[{ required: true }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item 
                    label="Password"
                    name="Password"
                    rules={[{ required: true }]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="ConfirmPassword"
                    rules={[{ required: true }]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                    <Button type="primary" htmlType="submit" loading={uploading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <hr style={{margin:"32px 0px"}}/>
            <div style={{marginBottom:"32px"}}>
                <Button type="primary" onClick={()=>setModalVisible(true)}>Assign Role</Button>
                <Modal visible={modalVisible}  footer={null} onCancel={()=>setModalVisible(false)}>
                    <AssignRoleEditor/>
                </Modal>
            </div>
            
            <Row gutter={[16, 16]}>
                {
                    userIds.map(userId=>(
                        <Col span={8} key={userId}>
                            <Card extra={(
                                 <CloseOutlined onClick={async ()=>{
                                    if(window.confirm("delete user?"))
                                    {
                                        try{
                                            setUploading(true)
                                            await UsersAdminWebAPI.Delete(userId);
                                            message.success("Delete successfully",2)
                                        }catch(err){message.error((err as any).message,2)}
                                        finally{setUploading(false)}
                                    }
                                 }}/>
                            )}>
                                <Card.Grid style={{ width: "50%", textAlign: "left" }}>
                                    {userId}
                                </Card.Grid>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </Fragment>
    )

    async function FetchData()
    {
        setUserIds([...await UsersAdminWebAPI.GetUserId()])
    }
}