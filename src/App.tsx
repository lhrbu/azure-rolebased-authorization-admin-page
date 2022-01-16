import "./App.css"
import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import DomainsPage from "./Pages/DomainsPage";
import AdminPage from "./Pages/AdminPage";
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import UsersPage from "./Pages/UsersPage";

const { Header, Content, Footer } = Layout;

const RouteNames = {
  Admin:"/",
  Domains:"/Domains",
  AddUser:"/Users"
}


export default function App()
{
  return (
    <Layout className="layout">
      <BrowserRouter>
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[window.location.pathname]}>
            <Menu.Item key={RouteNames.Admin}>
              <NavLink end to={RouteNames.Admin}>Admin</NavLink>
            </Menu.Item>
            <Menu.Item key={RouteNames.Domains}>
              <NavLink end to={RouteNames.Domains}>Domains</NavLink>
            </Menu.Item>
            <Menu.Item key={RouteNames.AddUser}>
              <NavLink end to={RouteNames.AddUser}>Users</NavLink>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 64px' }}>
          <div className="site-layout-content">
            <Routes>
              <Route path={RouteNames.Domains} element={<DomainsPage />} />
              <Route path={RouteNames.AddUser} element={<UsersPage />} />
              <Route path={RouteNames.Admin}  element={<AdminPage />}/>
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Authorization Admin</Footer>
      </BrowserRouter>
    </Layout>
  )
}
