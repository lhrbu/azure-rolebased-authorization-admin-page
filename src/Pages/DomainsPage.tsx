import React, { Fragment, useEffect, useState } from 'react'
import Domain from '../Models/Domain'
import { Tabs, Card, Empty, Col, Row, Skeleton, Button, Tag, message } from 'antd';
import { DomainWebAPI, DomainAdminWebAPI } from '../WebAPIs/DomainWebAPI';
import { CloseOutlined, EditOutlined } from "@ant-design/icons"
import Modal from 'antd/lib/modal/Modal';
import RoleEditor from '../Components/RoleEditor';
import { RolesAdminWebAPI, RolesWebAPI } from '../WebAPIs/RolesWebAPI';
import Role from '../Models/Role';

const { TabPane } = Tabs;


export default function DomainsPage()
{
    const [domains, setDomains] = useState<Domain[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [editorAction, setEditorAction] = useState<"add" | "update" | "">("")
    const [editRole, setEditRole] = useState<Role | undefined>(undefined)

    useEffect(() => { FetchData() }, [])

    if (loading) { return <Skeleton active /> }

    return (
        <Fragment>
            <Tabs type="editable-card" onChange={e=>window.localStorage.setItem("selectedTabPane",e)}
                defaultActiveKey={window.localStorage.getItem("selectedTabPane")??undefined}
                onEdit={async (e, action) => { if (action === "add") { await AddDomain(); } }}>
                {
                    domains.map(domain => (
                        <TabPane
                            tab={domain.Name} 
                            key={domain.Name} 
                            closable={false}>
                            {
                                <Row gutter={[16, 16]} style={{marginTop:"16px"}}>
                                    {
                                        domain.Roles!.map(role => (
                                            <Col span={8} key={role.DomainName + role.Name}>
                                                <Card title={role.Name} extra={(
                                                    <div>
                                                        <EditOutlined onClick={() =>
                                                        {
                                                            setEditRole(role)
                                                            setEditorAction("update")
                                                            setModalVisible(true)
                                                        }} />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                        <CloseOutlined onClick={async () =>
                                                        {
                                                            if (window.confirm("Sure to delete the role?"))
                                                            {
                                                                setLoading(true)
                                                                try{
                                                                    await RolesAdminWebAPI.Delete(role)
                                                                    message.success("Delete Susscefully", 2)
                                                                }catch(err){
                                                                    message.error((err as any).message,2)
                                                                }
                                                                finally{
                                                                    await FetchData()
                                                                    setLoading(false)
                                                                }
                                                            }
                                                        }} />
                                                    </div>

                                                )}>
                                                    <Card.Grid style={{ width: "50%", textAlign: "left" }}>
                                                        <Tag color="blue">Read  Level: </Tag>
                                                        <Tag>{role.ReadLevel}</Tag>
                                                    </Card.Grid>
                                                    <Card.Grid style={{ width: "50%", textAlign: "left" }}>
                                                        <Tag color="blue">Write Level: </Tag>
                                                        <Tag>{role.WriteLevel}</Tag>
                                                    </Card.Grid>
                                                </Card>
                                            </Col>
                                        ))
                                    }
                                    <Col span={8} key="role-add">
                                        <Card title="Add Role">
                                            <Button shape="round" type="primary"
                                                onClick={() =>
                                                {
                                                    setEditRole({ DomainName: domain.Name, Name: "", ReadLevel: 0, WriteLevel: 0 })
                                                    setEditorAction("add")
                                                    setModalVisible(true)
                                                }}>Add Role</Button>
                                        </Card>
                                    </Col>
                                </Row>

                            }
                        </TabPane>
                    ))
                }
            </Tabs>
            <Modal visible={modalVisible} footer={null} onCancel={() =>
            {
                setModalVisible(false)
                setEditRole(undefined)
            }}>
                <RoleEditor Role={editRole} OnSubmit={async role =>
                {
                    let okFlag = true
                    try
                    {
                        setLoading(true)
                        if (editorAction === "add")
                        {
                            await RolesAdminWebAPI.Add(role);

                        } else if (editorAction === "update")
                        {
                            await RolesAdminWebAPI.Update(role);
                        }
                    } catch (err)
                    {
                        message.error((err as any).message, 2)
                        okFlag = false
                    }
                    finally
                    {
                        setModalVisible(false)
                        await FetchData();
                        setEditRole(undefined)
                        setLoading(false)
                    }
                    if (okFlag)
                    {
                        message.success("Succesfully!", 2)
                    }
                }} />
            </Modal>
        </Fragment>
    )


    async function FetchData()
    {
        setLoading(true)
        setDomains([...await DomainWebAPI.GetAll()])
        setLoading(false)
    }

    async function AddDomain()
    {
        try
        {
            if (window.confirm("Confirm to add domain"))
            {
                const domain = window.prompt("Input domain name")
                if (domain)
                {
                    await DomainAdminWebAPI.Add({ Name: domain } as Domain)
                    message.success("Add successfully!", 2);
                    await FetchData()
                }
            }
        } catch (err)
        {
            message.error((err as any).message, 2)
        }
    }
}