import { hasToken } from '@/utils/storage'
import React from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'

export default function AuthRoute({ component: Component, ...rest }) {
  const location = useLocation()
  // console.log(location)
  return (
    <Route
      {...rest}
      render={() => {
        if (hasToken()) {
          return <Component></Component>
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  // 从哪儿来的
                  from: location.pathname,
                },
              }}
            ></Redirect>
          )
        }
      }}
    ></Route>
  )
}
