import type { FC } from 'react'
import { StrictMode, Suspense } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Layout, theme } from 'antd'
import { routes } from './router'
import { Header } from './components/Header'

export const App: FC = () => {
  const {
    token: { colorBgContainer: background },
  } = theme.useToken()

  return <StrictMode>

    <Router>
      <Layout h-full>
        <Layout.Header style={{ background }}>
          <Header />
        </Layout.Header>
        <Layout.Content>
          <Suspense>
            <Routes>
              {routes.map(({ path, Component }) => (
                <Route key={path} path={path} Component={Component} />
              ))}
            </Routes>
          </Suspense>
        </Layout.Content>
      </Layout>
    </Router>

  </StrictMode>
}
